import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import ProjectTable from "./ProjectTable";
import { Project } from "../types/projects";
import "../App.css";

const AllProjects: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreatePageOpen, setIsCreatePageOpen] = useState(false);
  const [isEditPageOpen, setIsEditPageOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState<Omit<Project, "id">>({
    title: "",
    description: "",
    status: "",
    category: "",
    team_lead: "",
    team_size: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/projects", {
          method: "GET",
        });
        const data = await response.json();
        setProjects(data.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  // Handle Create Project
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });
      const data = await response.json();
      setProjects((prevProjects) => [...prevProjects, data.data]);
      setIsCreatePageOpen(false);
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit Project
  const handleEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/projects/${editingProject.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingProject),
        }
      );
      const data = await response.json();
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === data.data.id ? data.data : project
        )
      );
      setIsEditPageOpen(false);
    } catch (error) {
      console.error("Error editing project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Project
  const handleDeleteProject = async (id: number) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/v1/projects/${id}`, {
        method: "DELETE",
      });
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== id)
      );
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="main-content">
        {isCreatePageOpen || isEditPageOpen ? (
          <div className="create-project-page">
            <h2 className="breadcrumb">
              Dashboard / {isEditPageOpen ? "Edit Project" : "Create Project"}
            </h2>
            <div className="create-project-container">
              <h2 className="page-title">
                {isEditPageOpen ? "Edit Project" : "Create a New Project"}
              </h2>
              <form
                className="project-form"
                onSubmit={
                  isEditPageOpen ? handleEditProject : handleCreateProject
                }
              >
                <label>Project Title</label>
                <input
                  type="text"
                  placeholder="Enter Project Title"
                  value={
                    isEditPageOpen && editingProject
                      ? editingProject.title
                      : newProject.title
                  }
                  onChange={(e) =>
                    isEditPageOpen && editingProject
                      ? setEditingProject({
                          ...editingProject,
                          title: e.target.value,
                        })
                      : setNewProject({ ...newProject, title: e.target.value })
                  }
                  className="input-field"
                  disabled={isSubmitting}
                />
                <label>Description</label>
                <textarea
                  placeholder="Enter Description"
                  value={
                    isEditPageOpen && editingProject
                      ? editingProject.description
                      : newProject.description
                  }
                  onChange={(e) =>
                    isEditPageOpen && editingProject
                      ? setEditingProject({
                          ...editingProject,
                          description: e.target.value,
                        })
                      : setNewProject({
                          ...newProject,
                          description: e.target.value,
                        })
                  }
                  className="input-field"
                  disabled={isSubmitting}
                />
                <label>Team Size</label>
                <input
                  type="number"
                  placeholder="Enter Team Size"
                  value={
                    isEditPageOpen && editingProject
                      ? editingProject.team_size
                      : newProject.team_size
                  }
                  onChange={(e) =>
                    isEditPageOpen && editingProject
                      ? setEditingProject({
                          ...editingProject,
                          team_size: Number(e.target.value),
                        })
                      : setNewProject({
                          ...newProject,
                          team_size: Number(e.target.value),
                        })
                  }
                  className="input-field"
                  disabled={isSubmitting}
                />
                <label>Status</label>
                <select
                  className="input-field"
                  value={
                    isEditPageOpen && editingProject
                      ? editingProject.status
                      : newProject.status
                  }
                  onChange={(e) =>
                    isEditPageOpen && editingProject
                      ? setEditingProject({
                          ...editingProject,
                          status: e.target.value,
                        })
                      : setNewProject({ ...newProject, status: e.target.value })
                  }
                  disabled={isSubmitting}
                >
                  <option value="">Select Project Status</option>
                  <option value="Deployed">Deployed</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Hiring">Hiring</option>
                </select>
                <label>Category</label>
                <select
                  className="input-field"
                  value={
                    isEditPageOpen && editingProject
                      ? editingProject.category
                      : newProject.category
                  }
                  onChange={(e) =>
                    isEditPageOpen && editingProject
                      ? setEditingProject({
                          ...editingProject,
                          category: e.target.value,
                        })
                      : setNewProject({
                          ...newProject,
                          category: e.target.value,
                        })
                  }
                  disabled={isSubmitting}
                >
                  <option value="">Select Project Category</option>
                  <option value="Web">Web</option>
                  <option value="Research">Research</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="IoT">IoT</option>
                </select>
                <label>Team Lead</label>
                <input
                  type="text"
                  placeholder="Enter Team Lead"
                  value={
                    isEditPageOpen && editingProject
                      ? editingProject.team_lead
                      : newProject.team_lead
                  }
                  onChange={(e) =>
                    isEditPageOpen && editingProject
                      ? setEditingProject({
                          ...editingProject,
                          team_lead: e.target.value,
                        })
                      : setNewProject({
                          ...newProject,
                          team_lead: e.target.value,
                        })
                  }
                  className="input-field"
                  disabled={isSubmitting}
                />
                <div className="form-buttons">
                  <button type="submit" className="create-btn">
                    {isEditPageOpen ? "Update Project" : "Create Project"}
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setIsCreatePageOpen(false);
                      setIsEditPageOpen(false);
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <>
            <div className="header">
              <h1>All Projects</h1>
              <span className="notification">🔔</span>
            </div>
            <div className="buttons">
              <button
                className="create-btn"
                onClick={() => setIsCreatePageOpen(true)}
              >
                Create a Project
              </button>
            </div>
            <ProjectTable
              projects={projects}
              onEdit={(project) => {
                setEditingProject(project);
                setIsEditPageOpen(true);
              }}
              onDelete={handleDeleteProject}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default AllProjects;
