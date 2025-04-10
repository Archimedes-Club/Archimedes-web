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
  
  // Extended type used in UI logic
  export interface NotificationExtended extends Notification {
    read: boolean;
    timestamp?: Date;
    formattedDate?: string;
  }
  