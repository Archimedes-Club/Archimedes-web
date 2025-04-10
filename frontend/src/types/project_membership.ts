export interface ProjectMembership {
    id: number;
    user_id: number;
    member_name: string;
    project_id: number;
    project_title: string;
    role: 'lead' | 'member';
    status: 'active' | 'pending';
    user_email: string;
  }