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
            <th>Project Lead</th>
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
