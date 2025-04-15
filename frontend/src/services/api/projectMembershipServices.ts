import axios from "axios";
import { handleApiError } from "./authServices";
import { typographyClasses } from "@mui/material";

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers:{
        Accept: "application/json",
        "Content-Type": "application/json",
    }
})

/**
 * Post API call to make a join request by a user (authenticated) to a project of "project_id"
 * @param project_id 
 * @returns Response {message, data}
 */
export const joinProjectRequest = async (project_id) => {
    try {
        const data = {
            project_id: project_id
        }
        const response = await api.post('api/v1/project_memberships/request', data);
        return response;
    } catch (error) {
        handleApiError(error);
    }
}

/**
 * Get the pending "join project" requests recieved by authenicated user (always the professor) 
 * @returns array of @type ProjectMemberships 
 */
export const getPendingRequests = async() => {
    try {
        const response = api.get('api/v1/project_memberships/pending_requests');
        return response;
    } catch (error) {
        handleApiError(error);
    }
}

/**
 * Get all the membership details of a project, sends project Id in body
 * @returns array of @type ProjectMemerships
 */

export const getProjectMembers = async (project_id) => {
    try {
        const response = await api.get(`api/v1/project_memberships/members/${project_id}`);
        return response;
    } catch (error) {
        handleApiError(error);
    }
}

/**
 * 
 * @param project_id 
 * @param user_id 
 * @returns a message whether the approval is success or not
 * @rules This can be only sent by a professor who is a project lead of the project with "project_id
 */
export const approveJoinRequest = async (project_id, user_id) =>{
    try {
        const data = {
            project_id: project_id,
            user_id:  user_id
        }
        const response = await api.put("api/v1/project_memberships/approve", data);
        return response;
    } catch (error) {
        handleApiError(error);
    }
}

/**
 * 
 * @param project_id 
 * @param user_id 
 * @returns a message whether the rejection is success or not
 * @rules This can be only sent by a professor who is a project lead of the project with "project_id"
 */
export const rejectJoinRequest = async (project_id, user_id) =>{
    try {   
        const data = {
            project_id: project_id,
            user_id: user_id
        }
        const response = await api.put("api/v1/project_memberships/reject", data);
        return response;
    } catch (error) {
        handleApiError(error);
    }
}

export const removeMemberFromProject = async (project_id, user_id) => {
    try {
        const data = {
            project_id: project_id,
            user_id: user_id
        }
        const response = await api.delete("api/v1/project_memberships", {data});
        return response;
    } catch (error) {
        handleApiError(error);
    }
}