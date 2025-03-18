//Code updated for API integration

import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ProjectTable from "./ProjectTable";
import { Project } from "../types/projects";
import "../App.css";
// import { Rss } from "lucide-react";

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // New state variable

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/projects", {
          method: "GET",
        }); // Placeholder API URL
        const data = await response.json();
        setProjects(data.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Create a new project
  const addProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newProject.title.trim() ||
      !newProject.description.trim() ||
      !newProject.category.trim() ||
      !newProject.status.trim() ||
      newProject.team_size <= 0
    ) {
      alert("All fields are required.");
      return;
    }
    setIsSubmitting(true); // Set isSubmitting to true
    try {
      console.log("Creating project:", JSON.stringify(newProject));
      const response = await fetch("http://127.0.0.1:8000/api/v1/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(newProject),
      });

      if (!response.ok) {
        // Parse the response error body if available
        const errorData = await response.json();
        console.error("Server Error:", errorData);
        alert(`Server Error: ` + errorData.message);

        if (response.status === 422) {
          console.error("Validation Errors:", errorData.errors);
        } else {
          console.error("Unexpected Error:", errorData.message);
        }

        return; // Stop execution if there is an error
      }

      const createdProject = await response.json();
      setProjects([...projects, createdProject.data]);
      setNewProject({
        title: "",
        description: "",
        category: "Web",
        status: "",
        team_size: 1,
        team_lead: "Abhinav",
      });
      setIsCreatePageOpen(false);
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsSubmitting(false); // Set isSubmitting to false
    }
  };

  // Delete a project
  const deleteProject = async (id: number) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/projects/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error("server error", error);
      } else {
        const message = await response.json();
        alert(message.message);
      }
      setProjects(projects.filter((proj) => proj.id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  // Edit a project
  const editProject = (project: Project) => {
    setEditingProject({ ...project });
    setIsEditPageOpen(true);
  };

  // Update a project
  const updateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    //Input validation
    if (
      !editingProject.title.trim() ||
      !editingProject.description.trim() ||
      !editingProject.category.trim() ||
      !editingProject.status.trim() ||
      editingProject.team_size <= 0
    ) {
      alert("All fields are required.");
      return;
    }
    setIsSubmitting(true); // Set isSubmitting to true
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/projects/${editingProject.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingProject),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server Error:", errorData);
        alert(`Server Error: ` + errorData.message);

        if (response.status === 422) {
          console.error("Validation Errors:", errorData.errors);
        } else {
          console.error("Unexpected Error:", errorData.message);
        }

        return; // Stop execution if there is an error
      }

      const jsonResponse = await response.json();
      const updatedProject = jsonResponse.data;
      setProjects(
        projects.map((proj) =>
          proj.id === updatedProject.id ? updatedProject : proj
        )
      );
      setEditingProject(null);
      setIsEditPageOpen(false);
    } catch (error) {
      console.error("Error updating project:", error);
      alert("An unexpected error occurred while updating the project.");
    } finally {
      setIsSubmitting(false); // Set isSubmitting to false
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      {isLoading ? (
        <p>Loading projects...</p>
      ) : !isCreatePageOpen && !isEditPageOpen ? (
        <main className="main-content">
          <div className="header">
            <h1>Welcome Prof. Lopez</h1>
            <span className="notification">🔔</span>
          </div>

          <div className="buttons">
            <button
              className="create-btn"
              onClick={() => setIsCreatePageOpen(true)}
            >
              Create a Project
            </button>
            <button className="submit-btn">Submit a Project Idea</button>
          </div>

          <ProjectTable
            projects={projects}
            onEdit={editProject}
            onDelete={deleteProject}
          />
        </main>
      ) : (
        // CREATE PROJECT FORM
        <main className="create-project-page">
          <h2 className="breadcrumb">
            Dashboard / {isEditPageOpen ? "Edit Project" : "Create Project"}
          </h2>
          <div className="create-project-container">
            <h2 className="page-title">
              {isEditPageOpen ? "Edit Project" : "Create a New Project"}
            </h2>
            <form
              className="project-form"
              onSubmit={isEditPageOpen ? updateProject : addProject}
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
                disabled={isSubmitting} // Disable input during submission
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
                disabled={isSubmitting} // Disable input during submission
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
                disabled={isSubmitting} // Disable input during submission
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
                disabled={isSubmitting} // Disable input during submission
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
                    : setNewProject({ ...newProject, category: e.target.value })
                }
                disabled={isSubmitting} // Disable input during submission
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
                disabled={isSubmitting} // Disable input during submission
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
                  disabled={isSubmitting} // Disable button during submission
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </main>
      )}
    </div>
  );
};

export default Dashboard;
