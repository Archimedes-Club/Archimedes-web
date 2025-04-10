import axios from "axios";
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

export const getPendingRequests = async() => {
    try {
        const response = api.get('api/v1/project_memberships/pending_requests');
        return response;
    } catch (error) {
        handleApiError(error);
    }
}