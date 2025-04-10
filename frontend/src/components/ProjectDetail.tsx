// ProjectDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Chip,
  Tabs,
  Tab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GroupIcon from "@mui/icons-material/Group";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./Sidebar";
import "../styles/ProjectDetail.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  NotificationComponent,
  ProjectMembersSection,
} from "./NotificationService";
import { getUser } from "../services/api/authServices";

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

interface ProjectMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface PendingInvite {
  id: number;
  name: string;
  email: string;
  skills: string;
}

interface Project {
  id: string;
  title: string;
  company: string;
  status: string;
  description: string;
  lead?: string;
  members: ProjectMember[];
}

const ProjectDetail: React.FC = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setIsLoading] = useState<boolean>(true);
  const [tabValue, setTabValue] = useState(0);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("student");
  const [userName, setUserName] = useState<string>("");

  const [pendingInvites, setPendingInvites] = useState<
    {
      id: number;
      name: string;
      email: string;
      skills: string;
    }[]
  >([]);
  const [showPendingInvites, setShowPendingInvites] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleRemoveClick = (memberId: string) => {
    setMemberToRemove(memberId);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setMemberToRemove(null);
  };

  const handleConfirmRemove = () => {
    if (memberToRemove && project) {
      const updatedMembers = project.members.filter(
        (member) => member.id !== memberToRemove
      );
      setProject({
        ...project,
        members: updatedMembers,
      });
    }
    setDialogOpen(false);
    setMemberToRemove(null);
  };

  // Handle accepting a join request
  const handleAcceptInvite = (
    userId: number,
    projectId: number,
    skills: string,
    name: string,
    email: string
  ) => {
    if (project) {
      // Create new member from invite data
      const newMember: ProjectMember = {
        id: userId.toString(),
        name: name,
        email: email,
        role: "MEMBER",
      };

      // Add the new member to the project
      setProject({
        ...project,
        members: [...project.members, newMember],
      });

      // Remove from pending invites if it exists there
      setPendingInvites(
        pendingInvites.filter((invite) => invite.id !== userId)
      );
    }
  };

  // Handle rejecting an invite
  const handleRejectInvite = (inviteId: number) => {
    // In a real app, call API to reject the invite
    console.log(`Rejected invite with ID ${inviteId}`);

    // Remove from pending invites list
    setPendingInvites(
      pendingInvites.filter((invite) => invite.id !== inviteId)
    );
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUser();
        if (userData && userData.data) {
          setUserRole(userData.data.role || "student");
          setUserName(userData.data.name || "User");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Check if we're coming from "See all invite requests"
    const params = new URLSearchParams(window.location.search);
    const viewInvites = params.get("viewInvites");

    if (viewInvites === "true" && userRole === "professor") {
      setShowPendingInvites(true);

      // Mock data for pending invites - in a real app, fetch from API
      const mockPendingInvites = [
        {
          id: 101,
          name: "John Doe",
          email: "john.doe@example.com",
          skills: "Python, Machine Learning, Data Analysis",
        },
        {
          id: 102,
          name: "Jane Smith",
          email: "jane.smith@example.com",
          skills: "React, TypeScript, UI/UX Design",
        },
      ];

      setPendingInvites(mockPendingInvites);
    }
  }, [projectId, userRole]);

  useEffect(() => {
    const fetchProject = () => {
      setIsLoading(true);
      setTimeout(() => {
        const mockProject: Project = {
          id: projectId || "1",
          title: "Website Redesign – Aiko & Associates",
          company: "BLUEGROUSE FINANCE PTY LTD",
          status: "IN PROGRESS",
          description:
            "The project involves a complete redesign of the company website. The new design will focus on user experience, incorporating a modern, responsive layout and improved navigation. The aim is to enhance visitor experience and increase conversion rates.",
          lead: "",
          members: [
            {
              id: "1",
              name: "Aiden Smith",
              email: "aiden@example.com",
              role: "FREELANCER",
            },
          ],
        };

        setProject(mockProject);
        setIsLoading(false);
      }, 500);
    };

    fetchProject();
  }, [projectId]);

  const handleBack = () => {
    navigate("/ongoingprojects");
  };

  if (loading) {
    return (
      <div className="project-detail-loading">Loading project details...</div>
    );
  }

  if (!project) {
    return <div className="project-detail-error">Project not found</div>;
  }

  return (
    <div className="layout-container">
      {/* Hamburger Menu */}
      <IconButton
        className="hamburger-menu"
        onClick={toggleSidebar}
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
      >
        <MenuIcon />
      </IconButton>

      {/* Sidebar */}
      <Sidebar
        isVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
      />

      {/* Sidebar Overlay - only visible on mobile when sidebar is open */}
      {isMobile && isSidebarVisible && (
        <div
          className="sidebar-overlay visible"
          onClick={() => setIsSidebarVisible(false)}
        ></div>
      )}

      <div
        className={`project-detail-container ${
          isSidebarVisible ? "sidebar-visible" : ""
        }`}
      >
        <div
          className="project-header-actions"
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            className="back-button"
          >
            BACK TO PROJECTS
          </Button>

          {/* Add notification component */}
          <NotificationComponent
            userRole={userRole}
            onAcceptInvite={
              userRole === "professor" ? handleAcceptInvite : undefined
            }
          />
        </div>

        <div className="project-details">
          <Typography variant="h4" className="section-title">
            Project details
          </Typography>

          <div className="project-header">
            <div className="project-image-container">
              <div className="project-image"></div>
            </div>
            <div className="project-header-info">
              <Typography variant="h5" className="project-title">
                {project.title}
              </Typography>
              <Typography variant="subtitle1" className="project-company">
                {project.company}
              </Typography>
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
              {project.lead || "-"}
            </Typography>
          </div>

          <div className="project-tabs-section">
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="project tabs"
              className="project-tabs"
            >
              <Tab
                icon={<GroupIcon />}
                label="Project Members"
                id="project-tab-0"
                aria-controls="project-tabpanel-0"
              />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              {userRole === "professor" &&
                showPendingInvites &&
                pendingInvites.length > 0 && (
                  <div className="pending-invites-section">
                    <Typography
                      variant="h6"
                      className="section-subtitle"
                      sx={{ mb: 2 }}
                    >
                      Pending Join Requests
                    </Typography>
                    <div className="members-list">
                      {pendingInvites.map((invite) => (
                        <div
                          key={invite.id}
                          className="member-card pending-invite-card"
                        >
                          <div className="member-avatar-container">
                            <div className="member-avatar-placeholder">
                              <Typography variant="h6">
                                {invite.name.charAt(0)}
                              </Typography>
                            </div>
                          </div>
                          <div className="member-info">
                            <Typography variant="h6" className="member-name">
                              {invite.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              className="member-email"
                            >
                              {invite.email}
                            </Typography>
                            <Typography
                              variant="body2"
                              className="member-skills"
                            >
                              <strong>Skills:</strong> {invite.skills}
                            </Typography>
                          </div>
                          <div className="invite-actions">
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              className="accept-invite-btn"
                              onClick={() =>
                                handleAcceptInvite(
                                  invite.id,
                                  Number(projectId),
                                  invite.skills,
                                  invite.name,
                                  invite.email
                                )
                              }
                              sx={{ mr: 1 }}
                            >
                              Accept
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              className="reject-invite-btn"
                              onClick={() => handleRejectInvite(invite.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              <Typography
                variant="h6"
                className="section-subtitle"
                sx={{ mb: 2, mt: showPendingInvites ? 4 : 0 }}
              >
                Current Members
              </Typography>
              <div className="members-list">
                {project.members.map((member) => (
                  <div key={member.id} className="member-card">
                    <div className="member-avatar-container">
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="member-avatar"
                        />
                      ) : (
                        <div className="member-avatar-placeholder">
                          <Typography variant="h6">
                            {member.name.charAt(0)}
                          </Typography>
                        </div>
                      )}
                    </div>
                    <div className="member-info">
                      <Typography variant="h6" className="member-name">
                        {member.name}
                      </Typography>
                      <Typography variant="body2" className="member-email">
                        {member.email}
                      </Typography>
                      <span className="member-role-chip">{member.role}</span>
                    </div>
                    {userRole === "professor" && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        className="remove-member-btn"
                        onClick={() => handleRemoveClick(member.id)}
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

      {/* Confirmation Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Remove Member"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to remove this member from the project?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmRemove} color="error" autoFocus>
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProjectDetail;
