import axios  from "axios";
import { handleApiError } from "./authServices";

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers:{
        Accept: "application/json",
        "Content-Type": "application/json",
    }
})


// Get all the projects
export const getProjects = async() =>{
    try{
        const response = await api.get("api/v1/projects");
        return response.data;
    }catch(error){
        handleApiError(error);
        throw error;
    }
}

// Get project with project Id
export const getProjectWithID = async(id) => {
    try{
        const response = api.get(`api/v1/projects/${id}`);
        return response;
    }catch(error){
        handleApiError(error);
    }
}


/**
 * Add Project Post api call
 * arguments : Project Data as Json
 * Return: response {message, data}
 */

export const createProject = async(projectData) => {
    try {
        const response = api.post('api/v1/projects', projectData);
        return response;
    } catch (error) {
        handleApiError(error);
    }
}

/**
 * Edit Project Put Call
 * arguments: Project data which should have all the fields
 * return: response{message, data}
 */
export const putProject = async (id, updatedProjectData) => {
    try{
        const response = api.put(`api/v1/projects/${id}`, updatedProjectData);
        return response;
    }catch(error){
        handleApiError(error);
    }
}

/**
 * Update project using patch call
 * Arguments: Project data with the fields that need to get updated
 * return: response(message, data)
 */

export const patchProject = async (id, patchData) =>{
    try {
        const response = api.patch(`api/v1/projects/${id}`);
        return response;
    } catch (error) {
        handleApiError(error);
    }
}

/**
 * Delete project request
 * Arguments: project id which needs to be deleted
 * return: response - message
 */
export const deleteProjectWithID = async (id) =>{
    try {
        const response = api.delete(`api/v1/projects/${id}`);
        return response;
    } catch (error) {
        handleApiError(error);
    }
}

  
  // Fetch all project join requests
export const getProjectJoinRequests = async () => {
    try {
      const response = await api.get("api/v1/project_memberships");
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };
  

  /**
   * Get all public projects
   */
  export const getPublicProjects = async() => {
    try {
        const response = await api.get("/api/public-projects")
        return response;
    } catch (error) {
        handleApiError(error);
    }
  }