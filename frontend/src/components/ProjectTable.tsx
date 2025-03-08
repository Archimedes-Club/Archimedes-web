import React from "react";
import { Project } from "../types/projects";
import "../App.css";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface ProjectTableProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
}

const ProjectTable: React.FC<ProjectTableProps> = ({
  projects,
  onEdit,
  onDelete,
}) => {
  return (
    <div>
      <h2 className="table-title">All Projects</h2>
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
                <IconButton color="primary" onClick={() => onEdit(project)}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={() => onDelete(project.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable;
