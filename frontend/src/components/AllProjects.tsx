import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import ProjectTable from "./ProjectTable";
import { Project } from "../types/projects";
import "../App.css";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import "../styles/DashboardMain.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import { getProjects, getProjectWithID, createProject, putProject, patchProject, deleteProjectWithID } from "../services/api/projectServices";

const AllProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatePageOpen, setIsCreatePageOpen] = useState(false);
  const [isEditPageOpen, setIsEditPageOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    status: "",
    category: "",
    team_lead: "",
    team_size: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const isMobile = useMediaQuery("(max-width:768px)");

  const navigate = useNavigate();

  const handleRowClick = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  const apiToken = localStorage.getItem("authToken");

  // const handleRowClick = (project: Project) => {
  //   setEditingProject({ ...project });
  //   setIsEditPageOpen(true);
  // };

  // Toggle sidebar function
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getProjects();
        console.log("response using axios", response);
        const data = response?.data;
        if (Array.isArray(data.data)) {
          setProjects(data.data);
        } else {
          console.error("Invalid data format: Expected an array");
          setProjects([]); // Set an empty array to prevent errors
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]); // Set an empty array if API fails
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [apiToken]);

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

    setIsSubmitting(true);
    try {
      const response = await createProject(JSON.stringify(newProject));
      if (response?.status != 201) {
        const errorData = await response?.data;
        console.error("Server Error:", errorData);
        alert(`Server Error: ` + errorData.message);
        return;
      }
      const createdProject = await response;
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
      setIsSubmitting(false);
    }
  };

  const deleteProject = async (id: number) => {
    try {
      const response = await deleteProjectWithID(id);
      if (response?.status != 200) {
        const error = await response?.data.message;
        console.error("Server Error:", error);
      } else {
        const message = await response?.data;
        alert(message.message);
      }
      setProjects(projects.filter((proj) => proj.id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const editProject = (project: Project) => {
    setEditingProject({ ...project });
    setIsEditPageOpen(true);
  };

  const updateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
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

    setIsSubmitting(true);
    try {
      const response = await putProject(editingProject.id, JSON.stringify(editingProject));
      // if (!response) {
      //   const errorData = await response.json();
      //   console.error("Server Error:", errorData);
      //   alert(`Server Error: ` + errorData.message);
      //   return;
      // }
      const jsonResponse = await response;
      const updatedProject = jsonResponse?.data;
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
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard">
      {/* Hamburger Menu */}
      <IconButton className="hamburger-menu" onClick={toggleSidebar}>
        <MenuIcon />
      </IconButton>

      {/* Sidebar */}
      <Sidebar
        isVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
      />

      {/* Sidebar Overlay - only visible on mobile when sidebar is open */}
      {isMobile && isSidebarVisible && (
        <div
          className="sidebar-overlay visible"
          onClick={() => setIsSidebarVisible(false)}
        ></div>
      )}

      {isLoading ? (
        <div
          className={`loading-container ${
            isSidebarVisible && !isMobile ? "shifted" : ""
          }`}
        >
          Loading projects...
        </div>
      ) : !isCreatePageOpen && !isEditPageOpen ? (
        <div
          className={`main-content ${
            isSidebarVisible && !isMobile ? "shifted" : ""
          }`}
        >
          <div className="header">
            <h2>All Projects</h2>
            <IconButton>
              <NotificationsIcon className="notification-icon" />
            </IconButton>
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
            onRowClick={handleRowClick}
          />

          <div className="view-more-container">
            <button
              className="view-more-btn"
              onClick={() => navigate("/all-projects")}
            >
              View More
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`create-project-page ${
            isSidebarVisible && !isMobile ? "shifted" : ""
          }`}
        >
          <div className="breadcrumb">
            Dashboard / {isEditPageOpen ? "Edit Project" : "Create Project"}
          </div>
          <div className="create-project-container">
            <h2 className="page-title">
              {isEditPageOpen ? "Edit Project" : "Create a New Project"}
            </h2>
            <form
              className="project-form"
              onSubmit={isEditPageOpen ? updateProject : addProject}
            >
              <label htmlFor="title">Project Title</label>
              <input
                type="text"
                id="title"
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

              <label htmlFor="description">Description</label>
              <textarea
                id="description"
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

              <label htmlFor="team_size">Team Size</label>
              <select
                id="team_size"
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
              >
                <option value="">Select team size</option>
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>

              <label htmlFor="status">Status</label>
              <select
                id="status"
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
                className="input-field"
                disabled={isSubmitting}
              >
                <option value="">Select Project Status</option>
                <option value="Deployed">Deployed</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Hiring">Hiring</option>
              </select>

              <label htmlFor="category">Category</label>
              <select
                id="category"
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
                className="input-field"
                disabled={isSubmitting}
              >
                <option value="">Select Project Category</option>
                <option value="Web">Web</option>
                <option value="Research">Research</option>
                <option value="AI/ML">AI/ML</option>
                <option value="IoT">IoT</option>
              </select>

              <label htmlFor="team_lead">Team Lead</label>
              <input
                type="text"
                id="team_lead"
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
                <button
                  type="submit"
                  className="create-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Processing..."
                    : isEditPageOpen
                    ? "Update Project"
                    : "Create Project"}
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
      )}
    </div>
  );
};

export default AllProjects;
