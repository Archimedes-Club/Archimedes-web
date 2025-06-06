// OngoingProjects.tsx (UPDATED)
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Tooltip,
  Box,
  Typography,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Folder as FolderIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import ProjectForm from "./ProjectForm";
import { getUserProjects } from "../services/api/projectMembershipServices";
import {
  putProject,
  deleteProjectWithID,
} from "../services/api/projectServices";

import { Project } from "../types/projects.types";
import "../styles/OngoingProjects.css";
import { getUser } from "../services/api/authServices";
import { NotificationComponent } from "./NotificationService";
import { HamburgerToggle } from "./Sidebar";

const OngoingProjects: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRole, setUserRole] = useState<string>("student"); // default to student

  const handleViewProject = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  useEffect(() => {
    document.title = "Ongoing Projects";
    const loadProjects = async () => {
      try {
        const response = await getUserProjects();
        if (response && response.data && Array.isArray(response.data)) {
          setUserProjects(response.data);
        } else {
          console.error("Invalid Data format: Expected an array");
          setUserProjects([]);
        }
      } catch (error: any) {
        alert(error);
      }
    };

    const fetchUserInfo = async () => {
      try {
        const response = await getUser();
        if (response?.data?.role) {
          setUserRole(response.data.role);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUserInfo(); // ✅ Get user role
    loadProjects(); // ✅ Get projects
  }, []);
  //   loadProjects();
  // }, []);

  const updateProject = async (project: Project) => {
    setIsSubmitting(true);
    try {
      const response = await putProject(project.id, project);
      if (response && response.data) {
        const updated = response.data.data;
        setUserProjects((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        );
        setEditingProject(null);
      }
    } catch (error) {
      alert("Error updating project: " + error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProject = async (projectId: number) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirm) return;

    try {
      const response = await deleteProjectWithID(projectId);
      if (response?.data?.message) {
        alert(response.data.message);
      }

      // Update state to remove the deleted project from list
      setUserProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (error) {
      alert("Error deleting project: " + error);
    }
  };

  const displayProjects = userProjects.length > 0 ? userProjects : [];

  return (
    <div className="layout-container">
      <HamburgerToggle toggleSidebar={toggleSidebar} />

      <Sidebar
        isVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
      />

      <div className={`main-content ${isSidebarVisible ? "shifted" : ""}`}>
        <div className="ongoingprojects">
          <div
            className="header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" className="page-header">
              Ongoing Projects
            </Typography>
            <NotificationComponent userRole={userRole} />
          </div>

          <div className="table-container">
            {displayProjects.length === 0 ? (
              <Typography variant="h6" className="page-header">
                You don't have any active projects yet 😀
              </Typography>
            ) : (
              <TableContainer
                component={Paper}
                className="projects-table-container"
              >
                <Table
                  className="projects-table"
                  aria-label="ongoing projects table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell
                        width="5%"
                        className="table-header-cell"
                      ></TableCell>
                      <TableCell width="40%" className="table-header-cell">
                        Project Title
                      </TableCell>
                      <TableCell width="20%" className="table-header-cell">
                        Status
                      </TableCell>
                      <TableCell width="20%" className="table-header-cell">
                        Team Members
                      </TableCell>
                      <TableCell
                        width="15%"
                        className="table-header-cell"
                        align="center"
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayProjects.map((project) => (
                      <TableRow key={project.id} className="table-row">
                        <TableCell className="table-cell" width="5%">
                          <FolderIcon color="action" />
                        </TableCell>
                        <TableCell className="table-cell" width="40%">
                          <Typography
                            variant="body1"
                            className="project-title"
                            onClick={() => handleViewProject(project.id)}
                          >
                            {project.title}
                          </Typography>
                        </TableCell>
                        <TableCell className="status-cell" width="20%">
                          {project.status}
                        </TableCell>
                        <TableCell className="members-cell" width="20%">
                          {project.team_size}
                        </TableCell>
                        <TableCell
                          className="table-cell"
                          width="15%"
                          align="center"
                        >
                          <Box className="actions-container">
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleViewProject(project.id)}
                              className="view-button"
                            >
                              View Project
                            </Button>
                            {userRole === "professor" && (
                              <>
                                <Tooltip title="Edit Project">
                                  <IconButton
                                    color="primary"
                                    size="small"
                                    onClick={() => setEditingProject(project)}
                                    className="edit-button"
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Project">
                                  <IconButton
                                    color="error"
                                    size="small"
                                    onClick={() => deleteProject(project.id)}
                                  >
                                    {" "}
                                    <DeleteIcon />{" "}
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {editingProject && (
              <div style={{ marginTop: "2rem" }}>
                <Typography variant="h6">Edit Project</Typography>
                <ProjectForm
                  mode="edit"
                  userName={editingProject.team_lead || ""}
                  initialData={editingProject}
                  onSubmit={updateProject}
                  onCancel={() => setEditingProject(null)}
                  isSubmitting={isSubmitting}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OngoingProjects;