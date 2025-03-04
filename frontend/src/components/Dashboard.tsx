// import React, { useState } from "react";
// import Sidebar from "./Sidebar";
// import { Project } from "../types/projects";
// import "../App.css";

// const Dashboard: React.FC = () => {
//   const [projects, setProjects] = useState<Project[]>([
//     {
//       id: 1,
//       title: "AI Research Initiative",
//       description: "AI advancements",
//       status: "Launched",
//       teamSize: 5,
//     },
//     {
//       id: 2,
//       title: "Blockchain Security",
//       description: "Secure blockchain networks",
//       status: "In Progress",
//       teamSize: 3,
//     },
//     {
//       id: 3,
//       title: "Green Computing",
//       description: "Sustainable tech solutions",
//       status: "Completed",
//       teamSize: 4,
//     },
//   ]);

//   const [isCreatePageOpen, setIsCreatePageOpen] = useState(false);
//   const [isEditPageOpen, setIsEditPageOpen] = useState(false);
//   const [editingProject, setEditingProject] = useState<Project | null>(null);
//   const [newProject, setNewProject] = useState<Omit<Project, "id">>({
//     title: "",
//     description: "",
//     status: "",
//     teamSize: 1,
//   });

//   const addProject = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (
//       !newProject.title.trim() ||
//       !newProject.description.trim() ||
//       !newProject.status.trim() ||
//       newProject.teamSize <= 0
//     ) {
//       alert("All fields are required.");
//       return;
//     }
//     setProjects([...projects, { id: Date.now(), ...newProject }]);
//     setNewProject({ title: "", description: "", status: "", teamSize: 1 });
//     setIsCreatePageOpen(false);
//   };

//   const deleteProject = (id: number) => {
//     setProjects(projects.filter((proj) => proj.id !== id));
//   };

//   const editProject = (project: Project) => {
//     setEditingProject({ ...project });
//     setIsEditPageOpen(true);
//   };

//   const updateProject = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (editingProject) {
//       setProjects(
//         projects.map((proj) =>
//           proj.id === editingProject.id ? editingProject : proj
//         )
//       );
//       setEditingProject(null);
//       setIsEditPageOpen(false);
//     }
//   };

//   return (
//     <div className="dashboard">
//       <Sidebar />
//       {!isCreatePageOpen && !isEditPageOpen ? (
//         <main className="main-content">
//           <div className="header">
//             <h1>Welcome Prof. Lopez</h1>
//             <span className="notification">🔔</span>
//           </div>

//           <div className="buttons">
//             <button
//               className="create-btn"
//               onClick={() => setIsCreatePageOpen(true)}
//             >
//               Create a Project
//             </button>
//             <button className="submit-btn">Submit a Project Idea</button>
//           </div>

//           <table className="project-table">
//             <thead>
//               <tr>
//                 <th>Project Title</th>
//                 <th>Description</th>
//                 <th>Status</th>
//                 <th>Team Size</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {projects.map((project) => (
//                 <tr key={project.id}>
//                   <td>{project.title}</td>
//                   <td>{project.description}</td>
//                   <td>{project.status}</td>
//                   <td>{project.teamSize}</td>
//                   <td>
//                     <button
//                       className="edit-btn"
//                       onClick={() => editProject(project)}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       className="delete-btn"
//                       onClick={() => deleteProject(project.id)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </main>
//       ) : (
//         <main className="create-project-page">
//           <h2 className="breadcrumb">
//             Dashboard / {isEditPageOpen ? "Edit Project" : "Create Project"}
//           </h2>
//           <div className="create-project-container">
//             <h2 className="page-title">
//               {isEditPageOpen ? "Edit Project" : "Create a New Project"}
//             </h2>
//             <form
//               className="project-form"
//               onSubmit={isEditPageOpen ? updateProject : addProject}
//             >
//               <label>Project Title</label>
//               <input
//                 type="text"
//                 placeholder="Enter Project Title"
//                 value={
//                   isEditPageOpen && editingProject
//                     ? editingProject.title
//                     : newProject.title
//                 }
//                 onChange={(e) =>
//                   isEditPageOpen && editingProject
//                     ? setEditingProject({
//                         ...editingProject,
//                         title: e.target.value,
//                       })
//                     : setNewProject({ ...newProject, title: e.target.value })
//                 }
//                 className="input-field"
//               />
//               <label>Description</label>
//               <textarea
//                 placeholder="Enter Description"
//                 value={
//                   isEditPageOpen && editingProject
//                     ? editingProject.description
//                     : newProject.description
//                 }
//                 onChange={(e) =>
//                   isEditPageOpen && editingProject
//                     ? setEditingProject({
//                         ...editingProject,
//                         description: e.target.value,
//                       })
//                     : setNewProject({
//                         ...newProject,
//                         description: e.target.value,
//                       })
//                 }
//                 className="input-field"
//               />
//               <label>Team Size</label>
//               <input
//                 type="number"
//                 placeholder="Enter Team Size"
//                 value={
//                   isEditPageOpen && editingProject
//                     ? editingProject.teamSize
//                     : newProject.teamSize
//                 }
//                 onChange={(e) =>
//                   isEditPageOpen && editingProject
//                     ? setEditingProject({
//                         ...editingProject,
//                         teamSize: Number(e.target.value),
//                       })
//                     : setNewProject({
//                         ...newProject,
//                         teamSize: Number(e.target.value),
//                       })
//                 }
//                 className="input-field"
//               />
//               <label>Status</label>
//               <select
//                 className="input-field"
//                 value={
//                   isEditPageOpen && editingProject
//                     ? editingProject.status
//                     : newProject.status
//                 }
//                 onChange={(e) =>
//                   isEditPageOpen && editingProject
//                     ? setEditingProject({
//                         ...editingProject,
//                         status: e.target.value,
//                       })
//                     : setNewProject({ ...newProject, status: e.target.value })
//                 }
//               >
//                 <option value="">Select Project Status</option>
//                 <option value="Launched">Launched</option>
//                 <option value="In Progress">In Progress</option>
//                 <option value="Completed">Completed</option>
//               </select>
//               <div className="form-buttons">
//                 <button type="submit" className="create-btn">
//                   {isEditPageOpen ? "Update Project" : "Create Project"}
//                 </button>
//                 <button
//                   className="cancel-btn"
//                   onClick={() => {
//                     setIsCreatePageOpen(false);
//                     setIsEditPageOpen(false);
//                   }}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </main>
//       )}
//     </div>
//   );
// };

// export default Dashboard;

//Code updated for API integration

import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ProjectTable from "./ProjectTable";
import { Project } from "../types/projects";
import "../App.css";

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
      !newProject.status.trim() ||
      newProject.team_size <= 0
    ) {
      alert("All fields are required.");
      return;
    }
    try {
      console.log("Creating project:", JSON.stringify(newProject));
      const response = await fetch("http://127.0.0.1:8000/api/v1/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });
      const createdProject = await response.json();
      setProjects([...projects, createdProject]);
      setNewProject({
        title: "",
        description: "",
        category: "",
        status: "",
        team_size: 1,
        team_lead: "",
      });
      setIsCreatePageOpen(false);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  // Delete a project
  const deleteProject = async (id: number) => {
    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
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
    if (editingProject) {
      try {
        const response = await fetch(`/api/projects/${editingProject.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingProject),
        });
        const updatedProject = await response.json();
        setProjects(
          projects.map((proj) =>
            proj.id === updatedProject.id ? updatedProject : proj
          )
        );
        setEditingProject(null);
        setIsEditPageOpen(false);
      } catch (error) {
        console.error("Error updating project:", error);
      }
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
              >
                <option value="">Select Project Status</option>
                <option value="Launched">Launched</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <div className="form-buttons">
                <button type="submit" className="create-btn">
                  {isEditPageOpen ? "Update Project" : "Create Project"}
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setIsCreatePageOpen(false);
                    setIsEditPageOpen(false);
                  }}
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
