// import React, { useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   IconButton,
//   Tooltip,
//   Box,
//   Typography,
// } from "@mui/material";
// import {
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Folder as FolderIcon,
//   Menu as MenuIcon,
// } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "./Sidebar";
// import "../styles/OngoingProjects.css";
// import "../styles/DashboardMain.css";

// interface Project {
//   id: string;
//   title: string;
//   status: string;
//   members: number;
// }

// interface OngoingProjectsProps {
//   projects?: Project[];
//   onEdit?: (project: Project) => void;
//   onDelete?: (project: Project) => void;
// }

// const OngoingProjects: React.FC<OngoingProjectsProps> = ({
//   projects = [],
//   onEdit,
//   onDelete,
// }) => {
//   const navigate = useNavigate();
//   const [isSidebarVisible, setIsSidebarVisible] = useState(false);

//   const handleViewProject = (projectId: string) => {
//     navigate(`/projects/${projectId}`);
//   };

//   const toggleSidebar = () => {
//     setIsSidebarVisible(!isSidebarVisible);
//   };

//   // Sample projects data if none is provided
//   const sampleProjects: Project[] = [
//     {
//       id: "1",
//       title: "AI Research Project",
//       status: "Active",
//       members: 5,
//     },
//     {
//       id: "2",
//       title: "Data Mining Study",
//       status: "Active",
//       members: 3,
//     },
//     {
//       id: "3",
//       title: "Blockchain Research",
//       status: "Active",
//       members: 4,
//     },
//     {
//       id: "4",
//       title: "Machine Learning Analysis",
//       status: "Active",
//       members: 6,
//     },
//   ];

//   const displayProjects = projects.length > 0 ? projects : sampleProjects;

//   return (
//     <>
//       {/* Hamburger Menu */}
//       <IconButton className="hamburger-menu" onClick={toggleSidebar}>
//         <MenuIcon />
//       </IconButton>

//       {/* Sidebar */}
//       <Sidebar
//         isVisible={isSidebarVisible}
//         onClose={() => setIsSidebarVisible(false)}
//       />

//       <div className={`main-content ${isSidebarVisible ? "shifted" : ""}`}>
//         <div className="ongoingprojects">
//           <div className="header">
//             <Typography variant="h5" className="page-header">
//               Ongoing Projects
//             </Typography>
//           </div>
//           <div className="table-container">
//             <TableContainer
//               component={Paper}
//               className="projects-table-container"
//             >
//               <Table
//                 className="projects-table"
//                 aria-label="ongoing projects table"
//               >
//                 <TableHead>
//                   <TableRow>
//                     <TableCell
//                       width="5%"
//                       className="table-header-cell"
//                     ></TableCell>
//                     <TableCell width="40%" className="table-header-cell">
//                       Project Title
//                     </TableCell>
//                     <TableCell width="20%" className="table-header-cell">
//                       Status
//                     </TableCell>
//                     <TableCell width="20%" className="table-header-cell">
//                       Team Members
//                     </TableCell>
//                     <TableCell
//                       width="15%"
//                       className="table-header-cell"
//                       align="center"
//                     >
//                       Actions
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {displayProjects.map((project) => (
//                     <TableRow key={project.id} className="table-row">
//                       <TableCell className="table-cell" width="5%">
//                         <FolderIcon color="action" />
//                       </TableCell>
//                       <TableCell className="table-cell" width="40%">
//                         <Typography
//                           variant="body1"
//                           className="project-title"
//                           onClick={() => handleViewProject(project.id)}
//                         >
//                           {project.title}
//                         </Typography>
//                       </TableCell>
//                       <TableCell className="status-cell" width="20%">
//                         {project.status}
//                       </TableCell>
//                       <TableCell className="members-cell" width="20%">
//                         {project.members}
//                       </TableCell>
//                       <TableCell
//                         className="table-cell"
//                         width="15%"
//                         align="center"
//                       >
//                         <Box className="actions-container">
//                           <Button
//                             variant="outlined"
//                             size="small"
//                             onClick={() => handleViewProject(project.id)}
//                             className="view-button"
//                           >
//                             View Project
//                           </Button>
//                           <Tooltip title="Edit Project">
//                             <IconButton
//                               color="primary"
//                               size="small"
//                               onClick={() => onEdit && onEdit(project)}
//                               className="edit-button"
//                             >
//                               <EditIcon />
//                             </IconButton>
//                           </Tooltip>
//                           <Tooltip title="Delete Project">
//                             <IconButton
//                               color="error"
//                               size="small"
//                               onClick={() => onDelete && onDelete(project)}
//                             >
//                               <DeleteIcon />
//                             </IconButton>
//                           </Tooltip>
//                         </Box>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default OngoingProjects;

//UI fixing

// OngoingProjects.tsx
import React, { useState } from "react";
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

interface Project {
  id: string;
  title: string;
  status: string;
  members: number;
}

interface OngoingProjectsProps {
  projects?: Project[];
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

const OngoingProjects: React.FC<OngoingProjectsProps> = ({
  projects = [],
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const handleViewProject = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const sampleProjects: Project[] = [
    {
      id: "1",
      title: "AI Research Project",
      status: "Active",
      members: 5,
    },
    {
      id: "2",
      title: "Data Mining Study",
      status: "Active",
      members: 3,
    },
    {
      id: "3",
      title: "Blockchain Research",
      status: "Active",
      members: 4,
    },
    {
      id: "4",
      title: "Machine Learning Analysis",
      status: "Active",
      members: 6,
    },
  ];

  const displayProjects = projects.length > 0 ? projects : sampleProjects;

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
                        {project.members}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default OngoingProjects;
