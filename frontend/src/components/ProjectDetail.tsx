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
  const [loading, setLoading] = useState<boolean>(true);
  const [tabValue, setTabValue] = useState(0);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchProject = () => {
      setLoading(true);
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
              avatar: "",
            },
          ],
        };

        setProject(mockProject);
        setLoading(false);
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
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          className="back-button"
        >
          BACK TO PROJECTS
        </Button>

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
              -
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
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      className="remove-member-btn"
                      onClick={() => handleRemoveClick(member.id)}
                    >
                      Remove Member
                    </Button>
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
