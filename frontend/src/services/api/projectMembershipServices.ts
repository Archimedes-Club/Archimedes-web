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
        const response = await api.post('api/v1/project_memberships/request', project_id);
        return response;
    } catch (error) {
        handleApiError(error);
    }
}