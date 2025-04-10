// Base notification from backend
export interface Notification {
    id: number;
    user_id: number;
    member_name: string;
    project_id: number;
    proejct_title: string;
    role: string;
    status: string;
    user_email: string;
  }