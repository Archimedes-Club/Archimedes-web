// ProjectDetail.tsx (FINAL FIX for sidebar spacing like Dashboard)
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Chip,
  Tabs,
  Tab,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GroupIcon from "@mui/icons-material/Group";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./Sidebar";
import "../styles/ProjectDetail.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import { NotificationComponent } from "./NotificationService";

import { Project } from "../types/projects";
import { ProjectMembership } from "../types/project_membership";
import {
  approveJoinRequest,
  getProjectMembers,
  rejectJoinRequest,
  removeMemberFromProject,
} from "../services/api/projectMembershipServices";
import { getProjectWithID } from "../services/api/projectServices";
import { ConfirmDialog } from "./ConfirmDialog";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`project-tabpanel-${index}`}
      aria-labelledby={`project-tab-${index}`}
      {...other}
      className="tab-panel"
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

const ProjectDetail: React.FC = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | any>(null);
  const [members, setMembers] = useState<ProjectMembership[]>([]);
  const [pendingInvites, setPendingInvites] = useState<ProjectMembership[]>([]);
  const [loading, setIsLoading] = useState<boolean>(true);
  const [tabValue, setTabValue] = useState(0);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [confimrOpen, setConfirmOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<{
    title: string;
    content: string;
    onConfirm: () => void;
    confirmText: string;
  }>({
    title: "",
    content: "",
    onConfirm: () => {},
    confirmText: "Confirm",
  });
  const [memberToRemove, setMemberToRemove] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<string>("professor");

  const [showPendingInvites, setShowPendingInvites] = useState(true);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  /**
   * Open a confirmation dialog box with
   * @param title title of the dialog box
   * @param content content to be displayed on the dialog box
   * @param onConfirm method to be executed upon confirmation fo the dialog box
   */
  const showConfirmation = (
    title: string,
    content: string,
    onConfirm: () => void,
    confirmText: string = "Confirm"
  ) => {
    setDialogConfig({ title, content, onConfirm, confirmText });
    setConfirmOpen(true);
  };

  /**
   * Method to approve join request, triggers when he approve button is pressed
   * @param membership
   */
  const handleAcceptInvite = (membership: ProjectMembership) => {
    showConfirmation(
      "Confirm Approve?",
      "Are you sure you want to approve the join request",
      () => approve(),
      "Approve"
    );

    const approve = async () => {
      try {
        const approveResponse = await approveJoinRequest(
          membership.project_id,
          membership.user_id
        );

        if (approveResponse?.status == 200) {
          // Remove the membership informtion from pending invites
          setPendingInvites(
            pendingInvites.filter((invite) => invite.id !== membership.id)
          );

          // Move the membership information to current members
          membership["status"] = "active";
          setMembers((data) => [...data, membership]);
        }
      } catch (error: any) {
        alert("Error while approving join request: " + error.message);
      }
    };
  };

  /**
   * Method to reject join request, triggers when he approve button is pressed
   * @param inviteId
   */

  const handleRejectInvite = (membership: ProjectMembership) => {
    showConfirmation(
      "Confirm Reject?",
      "Are you sure you want to reject the join request?",
      () => reject(),
      "Reject"
    );

    const reject = async () => {
      try {
        const rejectResponse = await rejectJoinRequest(
          membership.project_id,
          membership.user_id
        );

        if (rejectResponse?.status == 200) {
          // Removing the join request from the pending invites
          setPendingInvites(
            pendingInvites.filter((request) => request.id !== membership.id)
          );
        }
      } catch (error: any) {
        alert("Error while rejecting join request: " + error.messagea);
      }
    };
  };

  /**
   * Handle remove member from user, triggers upon clicking remove user button
   * @param member
   */
  const handleRemoveClick = (member: ProjectMembership) => {
    showConfirmation(
      "Remove Member confirmation",
      "Are you sure you want to remove the user from the project?",
      () => removeMember(),
      "Confirm Remove"
    );

    const removeMember = async () => {
      try {
        const removeResponse = await removeMemberFromProject(
          member.project_id,
          member.user_id
        );
        if (removeResponse?.status == 200) {
          // remove user from the current members colunn
          setMembers(
            members.filter((existingMember) => existingMember.id !== member.id)
          );
        }
      } catch (error: any) {
        alert(
          "Error while trying to remove member from project: " + error.message
        );
      }
    };
  };

  /**
   * useEffect to load project details and associated membership data (members + pending invites)
   * when the component mounts or when projectId changes.
   *
   * - Fetches project information and membership list in parallel.
   * - Categorizes members into 'active' members and 'pending' invites based on status.
   * - Prevents state updates if the component is unmounted before data is received.
   */
  useEffect(() => {
    let isMounted = true; // to check if the data is already loaded

    const loadData = async () => {
      try {
        const [projectRes, membersRes]: any = await Promise.all([
          getProjectWithID(projectId),
          getProjectMembers(projectId),
        ]);

        if (!isMounted) return; // if loaded alreday then return

        const projectData = projectRes.data.data;

        setProject({
          id: projectData.id,
          title: projectData.title,
          description: projectData.description,
          status: projectData.status,
          team_size: projectData.team_size,
          category: projectData.category,
          team_lead: projectData.team_lead,
        });

        const memberData = membersRes.data;

        console.log("memberData:", memberData);
        if (Array.isArray(memberData)) {
          memberData.forEach((element) => {
            console.log("elemet:", element);
            if (element.status == "pending") {
              setPendingInvites((data) => [...data, element]);
            } else {
              setMembers((data) => [...data, element]);
            }
          });
        } else {
          console.error("Expected array but got:", memberData);
          setMembers([]);
        }
      } catch (error: any) {
        console.error("Error loading project or members:", error.message);
        alert(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  //  To ensure the members are loaded
  useEffect(() => {
    console.log("pending members array", pendingInvites);
    console.log("✅ Members updated:", members);
  }, [members]);

  const handleBack = () => navigate("/ongoingprojects");

  if (loading) return <div>Loading project details...</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div className="layout-container">
      <IconButton
        className="hamburger-menu"
        onClick={toggleSidebar}
        // style={{ left: isSidebarVisible && !isMobile ? 250 : 70 }}
      >
        <MenuIcon />
      </IconButton>

      <Sidebar
        isVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
      />

      {isMobile && isSidebarVisible && (
        <div
          className="sidebar-overlay visible"
          onClick={() => setIsSidebarVisible(false)}
        />
      )}

      <div
        className={`project-detail-container ${
          isSidebarVisible && !isMobile ? "sidebar-visible" : ""
        }`}
      >
        <div className="project-header-actions">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            className="back-button"
          >
            BACK TO PROJECTS
          </Button>
          <NotificationComponent userRole={userRole} />
        </div>

        <div className="project-details">
          <Typography variant="h4">Project details</Typography>

          <div className="project-header">
            {/* <div className="project-image" /> */}
            <div className="project-header-info">
              <Typography variant="h5" className="project-title">
                {project.title}
              </Typography>
              {/* <Typography variant="subtitle1" className="project-company">
                {project.company}
              </Typography> */}
              <Chip label={project.status} className="status-chip" />
              <Typography variant="body1" className="project-description">
                {project.description}
              </Typography>
            </div>
          </div>

          <div className="project-info-section">
            <Typography variant="h6" className="info-title">
              PROJECT LEAD
            </Typography>
            <Typography variant="body1" className="info-value">
              {project.team_lead || "-"}
            </Typography>
          </div>

          <div className="project-tabs-section">
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab icon={<GroupIcon />} label="Project Members" />
            </Tabs>
            <TabPanel value={tabValue} index={0}>
              {userRole === "professor" && showPendingInvites && (
                <div className="pending-invites-section">
                  <Typography variant="h6">Pending Join Requests</Typography>
                  {pendingInvites.map((invite) => (
                    <div
                      key={invite.id}
                      className="member-card pending-invite-card"
                    >
                      <div className="member-avatar-placeholder">
                        <Typography variant="h6">
                          {invite.member_name.charAt(0)}
                        </Typography>
                      </div>
                      <div className="member-info">
                        <Typography variant="h6">
                          {invite.member_name}
                        </Typography>
                        <Typography>{invite.user_email}</Typography>
                      </div>
                      <div className="invite-actions">
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleAcceptInvite(invite)}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleRejectInvite(invite)}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Typography variant="h6" sx={{ mt: 4 }}>
                Current Members
              </Typography>

              <div className="members-list">
                {members.map((member) => (
                  <div key={member.id} className="member-card">
                    <div className="member-avatar-container">
                      <div className="member-avatar-placeholder">
                        <Typography variant="h6">
                          {member.member_name.charAt(0)}
                        </Typography>
                      </div>
                    </div>
                    <div className="member-info">
                      <Typography variant="h6" className="member-name">
                        {member.member_name}
                      </Typography>
                      <Typography variant="body2" className="member-email">
                        {member.user_email}
                      </Typography>
                      <span className="member-role-chip">{member.role}</span>
                    </div>
                    {userRole === "professor" && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        className="remove-member-btn"
                        onClick={() => handleRemoveClick(member)}
                      >
                        Remove Member
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </TabPanel>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confimrOpen}
        title={dialogConfig.title}
        content={dialogConfig.content}
        confirmText={dialogConfig.confirmText}
        onConfirm={() => {
          dialogConfig.onConfirm();
          setConfirmOpen(false);
        }}
        onClose={() => {
          setConfirmOpen(false);
        }}
      />
    </div>
  );
};

export default ProjectDetail;
