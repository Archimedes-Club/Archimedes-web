import React from "react";
import { Project } from "../types/projects";
import "../App.css";

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
            <th>Status</th>
            <th>Team Size</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{project.title}</td>
              <td>{project.status}</td>

              <td>{project.team_size}</td>
              <td>
                <button className="edit-btn" onClick={() => onEdit(project)}>
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => onDelete(project.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable;
