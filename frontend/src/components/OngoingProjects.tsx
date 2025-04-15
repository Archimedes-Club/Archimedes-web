//UI fixing
// OngoingProjects.tsx
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
import "../styles/OngoingProjects.css";
import { getUserProjects } from "../services/api/projectMembershipServices";
import { Project } from "../types/projects.types";

const OngoingProjects: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const handleViewProject = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const [userProjects, setUserProjects] = useState<Project[] | []>([]);


  useEffect(()=>{
    const loadProjects = async () =>{
      try {
        const response = await getUserProjects();
        if (response && response.data && Array.isArray(response.data)){
          setUserProjects(response.data);
        }else{
          console.error("Invalid Data format: Expected an array");
          setUserProjects([]);
        }
      } catch (error:any) {
        alert(error);
      }
    }

    loadProjects();
  }, [])


  const displayProjects = userProjects.length > 0 ? userProjects : [];

  function onEdit(project: Project): void {
    alert("Function not implemented yet");
  }

  function onDelete(project: Project): void {
    alert("function not implemented yet");
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

      <div className={`main-content ${isSidebarVisible ? "shifted" : ""}`}>
        <div className="ongoingprojects">
          <div className="header">
            <Typography variant="h5" className="page-header">
              Ongoing Projects
            </Typography>
          </div>
          <div className="table-container">
            {
              displayProjects.length == 0 ? (
                <Typography variant="h6" className="page-header">
                    You don't have any active projects yet 😀
                </Typography>
              ):(
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
                          <Tooltip title="Edit Project">
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => onEdit && onEdit(project)}
                              className="edit-button"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Project">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => onDelete && onDelete(project)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
              )
            }
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default OngoingProjects;
