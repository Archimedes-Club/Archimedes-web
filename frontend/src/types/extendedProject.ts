export interface ProjectExtended {
    id: number;
    title: string;
    description: string;
    status: string;
    category: string;
    team_lead: string;
    team_size: number;
  
    user_id?: number; // the logged-in user ID
    membership_status?: 'active' | 'pending'; // status of the user's join request
  }
  