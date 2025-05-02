// dashboard.tsx (UPDATED)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import ProjectTable from "./ProjectTable";
import ProjectForm from "./ProjectForm";
import { ProjectExtended } from "../types/extendedProject.types";
import "../App.css";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import "../styles/DashboardMain.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  getProjects,
  createProject,
  putProject,
} from "../services/api/projectServices";
import { getUser } from "../services/api/authServices";
import { NotificationComponent } from "./NotificationService";
import { joinProjectRequest } from "../services/api/projectMembershipServices";
import { AxiosResponse } from "axios";
import { HamburgerToggle } from "./Sidebar";

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<ProjectExtended[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatePageOpen, setIsCreatePageOpen] = useState(false);
  const [isEditPageOpen, setIsEditPageOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectExtended | null>(
    null
  );
  const [newProject, setNewProject] = useState<ProjectExtended>({
    id: 0,
    title: "",
    description: "",
    status: "",
    category: "",
    team_lead: "",
    team_size: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [userRole, setUserRole] = useState<string>("student");
  const [userName, setUserName] = useState<string>("");
  const [userId, setUserId] = useState<number | null>(null);
  const [requestedProjectIds, setRequestedProjectIds] = useState<number[]>([]);

  const isMobile = useMediaQuery("(max-width:768px)");
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  useEffect(() => {
    document.title = "Dashboard";
    const fetchUserData = async () => {
      try {
        const userData = await getUser();
        if (userData && userData.data) {
          setUserRole(userData.data.role || "student");
          setUserName(userData.data.name || "User");
          setUserId(userData.data.id);
          setNewProject((prev) => ({ ...prev, team_lead: userData.data.name }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchProjectsData = async () => {
      try {
        const response = await getProjects();
        if (response && response.data && Array.isArray(response.data)) {
          setProjects(response.data);
        } else {
          console.error("Invalid data format: Expected an array");
          setProjects([]);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
    fetchProjectsData();
  }, []);

  const addProject = async (project: ProjectExtended) => {
    setIsSubmitting(true);
    try {
      const response = await createProject(project);
      if (response && response.data) {
        setProjects([...projects, response.data.data]);
        setIsCreatePageOpen(false);
      }
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateProject = async (project: ProjectExtended) => {
    setIsSubmitting(true);
    try {
      const response = await putProject(project.id, project);
      if (response && response.data) {
        const updatedProject = response.data.data;
        setProjects(
          projects.map((proj) =>
            proj.id === updatedProject.id ? updatedProject : proj
          )
        );
        setEditingProject(null);
        setIsEditPageOpen(false);
      }
    } catch (error) {
      console.error("Error updating project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinRequest = async (projectId: number) => {
    try {
      const response: AxiosResponse | any = await joinProjectRequest([
        projectId,
      ]);
      alert(response.data.message);
      setRequestedProjectIds((prev) => [...prev, projectId]);
    } catch (error) {
      console.error("Error sending join request:", error);
      alert("Failed to send join request." + error);
    }
  };

  return (
    <div className="dashboard">
      <HamburgerToggle toggleSidebar={toggleSidebar} />

      <Sidebar
        isVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
      />

      {isMobile && isSidebarVisible && (
        <div
          className="sidebar-overlay visible"
          onClick={() => setIsSidebarVisible(false)}
        />
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
            <h2>
              Welcome{" "}
              {userRole === "professor" ? `Prof. ${userName}` : userName}
            </h2>
            <div style={{ position: "relative" }}>
              <NotificationComponent userRole={userRole} />
            </div>
          </div>

          <div className="buttons">
            {userRole === "professor" && (
              <button
                className="create-btn"
                onClick={() => setIsCreatePageOpen(true)}
              >
                Create a Project
              </button>
            )}
            <button className="submit-btn">Submit a Project Idea</button>
          </div>

          <ProjectTable
            projects={projects}
            onJoinRequest={handleJoinRequest}
            loggedInUserId={userId ?? undefined}
            requestedProjectIds={requestedProjectIds}
          />
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
            <ProjectForm
              mode={isEditPageOpen ? "edit" : "create"}
              userName={userName}
              initialData={
                isEditPageOpen && editingProject ? editingProject : newProject
              }
              onSubmit={isEditPageOpen ? updateProject : addProject}
              onCancel={() => {
                setIsCreatePageOpen(false);
                setIsEditPageOpen(false);
              }}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
