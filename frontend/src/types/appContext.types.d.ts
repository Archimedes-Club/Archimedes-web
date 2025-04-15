
export interface AppContextType {
    user: User | null;
    setUser: (user: User) => void;
  
    projects: Project[];
    setProjects: (projects: Project[]) => void;
  
    addProject: (project: Project) => void;
    updateProject: (project: Project) => void;
    deleteProject: (projectId: number) => void;
  }