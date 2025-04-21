// import React, { useState } from "react";
// import { Project } from "../types/projects";
// import "../App.css";
// import {
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
// } from "@mui/material";
// import "../styles/DashboardMain.css";

// interface ProjectTableProps {
//   projects: Project[];
//   onJoinRequest: (projectId: number, skills: string) => void;
// }

// const ProjectTable: React.FC<ProjectTableProps> = ({
//   projects,
//   onJoinRequest,
// }) => {
//   const [openDialog, setOpenDialog] = useState<boolean>(false);
//   const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);
//   const [skills, setSkills] = useState<string>("");
//   const [requestedProjects, setRequestedProjects] = useState<number[]>([]);

//   const handleOpenDialog = (projectId: number, event: React.MouseEvent) => {
//     event.stopPropagation();
//     setCurrentProjectId(projectId);
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setSkills("");
//     setCurrentProjectId(null);
//   };

//   const handleSubmit = () => {
//     if (currentProjectId && skills.trim()) {
//       onJoinRequest(currentProjectId, skills);
//       setRequestedProjects([...requestedProjects, currentProjectId]);
//       handleCloseDialog();
//     }
//   };

//   return (
//     <div className="table-container">
//       <table className="project-table">
//         <thead>
//           <tr>
//             <th>Project Title</th>
//             <th>Description</th>
//             <th>Category</th>
//             <th>Team Lead</th>
//             <th>Status</th>
//             <th>Team Size</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {projects.map((project) => (
//             <tr key={project.id}>
//               <td>{project.title}</td>
//               <td>{project.description}</td>
//               <td>{project.category}</td>
//               <td>{project.team_lead}</td>
//               <td>{project.status}</td>
//               <td>{project.team_size}</td>
//               <td>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={(e) => handleOpenDialog(project.id, e)}
//                   disabled={requestedProjects.includes(project.id)}
//                 >
//                   {requestedProjects.includes(project.id)
//                     ? "Request Sent"
//                     : "Join Project"}
//                 </Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <Dialog open={openDialog} onClose={handleCloseDialog}>
//         <DialogTitle>Join Project</DialogTitle>
//         <DialogContent>
//           <p>Please enter your skills relevant to this project:</p>
//           <TextField
//             autoFocus
//             margin="dense"
//             id="skills"
//             label="Your Skills"
//             type="text"
//             fullWidth
//             multiline
//             rows={4}
//             value={skills}
//             onChange={(e) => setSkills(e.target.value)}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} color="primary" variant="contained">
//             Send
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default ProjectTable;

//updated code adding feature

// ProjectTable.tsx (Updated)
//

//making changes

import React, { useState } from "react";
import { ProjectExtended } from "../types/extendedProject.types";
import "../App.css";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import "../styles/DashboardMain.css";
import { useNavigate } from "react-router-dom";

interface ProjectTableProps {
  projects: ProjectExtended[];
  onJoinRequest: (projectId: number, skills: string) => void;
  loggedInUserId?: number;
  requestedProjectIds?: number[];
}

const ProjectTable: React.FC<ProjectTableProps> = ({
  projects,
  onJoinRequest,
  loggedInUserId,
  requestedProjectIds = [],
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );

  const navigate = useNavigate();

  const handleConfirmDialogOpen = (projectId: number) => {
    setSelectedProjectId(projectId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedProjectId(null);
    setOpenDialog(false);
  };

  const handleConfirmJoin = () => {
    if (selectedProjectId) {
      onJoinRequest(selectedProjectId, ""); // no skills needed
    }
    setOpenDialog(false);
  };

  return (
    <div className="table-container">
      <table className="project-table">
        <thead>
          <tr>
            <th>Project Title</th>
            <th>Description</th>
            <th>Category</th>
            <th>Team Lead</th>
            <th>Status</th>
            <th>Team Size</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {[...projects]
            .sort((a, b) => b.id - a.id) // or use `b.created_at - a.created_at` if available
            .map((project) => {
              const isMember = project.membership === "active";

              const hasRequested = project.membership === "pending";

              const isRequestedViaProp = requestedProjectIds.includes(
                project.id
              );

              return (
                <tr key={project.id}>
                  <td>{project.title}</td>
                  <td>{project.description}</td>
                  <td>{project.category}</td>
                  <td>{project.team_lead}</td>
                  <td>{project.status}</td>
                  <td>{project.team_size}</td>
                  <td>
                    {isMember ? (
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        View Project
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={hasRequested || isRequestedViaProp}
                        onClick={() => handleConfirmDialogOpen(project.id)}
                      >
                        {hasRequested || isRequestedViaProp
                          ? "Request Sent"
                          : "Join Project"}
                      </Button>
                    )}
                    {(hasRequested || isRequestedViaProp) && (
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          marginTop: "4px",
                          color: "#888",
                        }}
                      >
                        Request status: pending
                      </Typography>
                    )}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      {/* Confirm Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Send Join Request</DialogTitle>
        <DialogContent>
          Are you sure you want to request to join this project?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmJoin}
            color="primary"
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProjectTable;
