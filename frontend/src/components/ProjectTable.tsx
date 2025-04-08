import React, { useState } from "react";
import { Project } from "../types/projects";
import "../App.css";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import "../styles/DashboardMain.css";

interface ProjectTableProps {
  projects: Project[];
  onJoinRequest: (projectId: number, skills: string, projectLead) => void;
}

const ProjectTable: React.FC<ProjectTableProps> = ({
  projects,
  onJoinRequest,
}) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);
  const [skills, setSkills] = useState<string>("");
  const [requestedProjects, setRequestedProjects] = useState<number[]>([]);
  const [teamLead, setTeamLead] = useState<string>("");

  const handleOpenDialog = (projectId: number, project_lead: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setCurrentProjectId(projectId);
    setTeamLead(project_lead);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSkills("");
    setCurrentProjectId(null);
  };

  const handleSubmit = () => {
    if (currentProjectId && skills.trim()) {
      onJoinRequest(currentProjectId, skills, teamLead);
      setRequestedProjects([...requestedProjects, currentProjectId]);
      handleCloseDialog();
    }
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
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{project.title}</td>
              <td>{project.description}</td>
              <td>{project.category}</td>
              <td>{project.team_lead}</td>
              <td>{project.status}</td>
              <td>{project.team_size}</td>
              <td>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => handleOpenDialog(project.id, project.team_lead, e)}
                  disabled={requestedProjects.includes(project.id)}
                >
                  {requestedProjects.includes(project.id)
                    ? "Request Sent"
                    : "Join Project"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Join Project</DialogTitle>
        <DialogContent>
          <p>Please enter your skills relevant to this project:</p>
          <TextField
            autoFocus
            margin="dense"
            id="skills"
            label="Your Skills"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProjectTable;
