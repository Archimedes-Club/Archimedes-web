import React from "react";
import { Project } from "../types/projects";
import "../App.css";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "../styles/DashboardMain.css";

interface ProjectTableProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
  onRowClick: (id: number) => void;
}

const ProjectTable: React.FC<ProjectTableProps> = ({
  projects,
  onEdit,
  onDelete,
  onRowClick,
}) => {
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
            <tr
              key={project.id}
              onClick={() => onRowClick(project.id)}
              className="clickable-row"
            >
              <td>{project.title}</td>
              <td>{project.description}</td>
              <td>{project.category}</td>
              <td>{project.team_lead}</td>
              <td>{project.status}</td>
              <td>{project.team_size}</td>
              <td>
                <IconButton onClick={() => onEdit(project)}>
                  <EditIcon style={{ color: "#6a11cb" }} />
                </IconButton>
                <IconButton onClick={() => onDelete(project.id)}>
                  <DeleteIcon style={{ color: "#FF5733" }} />
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
