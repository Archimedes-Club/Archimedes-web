// AppContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { AppContextType } from '../types/appContext.types';
import { User } from '../types/user.types';
import { Project } from '../types/projects.types';


const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  const addProject = (project: Project) => {
    setProjects(prev => [...prev, project]);
  };

  const updateProject = (updated: Project) => {
    setProjects(prev =>
      prev.map(p => (p.id === updated.id ? updated : p))
    );
  };

  const deleteProject = (id: number) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const value: AppContextType = {
    user,
    setUser,
    projects,
    setProjects,
    addProject,
    updateProject,
    deleteProject,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};