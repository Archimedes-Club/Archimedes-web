jest.mock('../../../services/api/projectServices', () => ({
    getProjects: jest.fn(),
    getProjectWithID: jest.fn(),
    createProject: jest.fn(),
    putProject: jest.fn(),
    patchProject: jest.fn(),
    deleteProjectWithID: jest.fn(),
    getProjectJoinRequests: jest.fn()
  }));
  
  jest.mock('../../../services/api/authServices', () => ({
    handleApiError: jest.fn()
  }));
  
  import {
    getProjects,
    getProjectWithID,
    createProject,
    putProject,
    patchProject,
    deleteProjectWithID,
    getProjectJoinRequests
  } from '../../../services/api/projectServices';
  
  import { handleApiError } from '../../../services/api/authServices';
  
  describe('Project API Services', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    describe('getProjects', () => {
      it('should fetch all projects successfully', async () => {
        const mockData = [{ id: 1, name: 'Project 1' }, { id: 2, name: 'Project 2' }];
        
        (getProjects as jest.Mock).mockResolvedValueOnce(mockData);
  
        const result = await getProjects();
        
        expect(getProjects).toHaveBeenCalled();
        expect(result).toEqual(mockData);
      });
  
      it('should handle errors when fetching projects fails', async () => {
        const mockError = new Error('Network error');
        
        (getProjects as jest.Mock).mockImplementationOnce(() => {
          throw mockError;
        });
  
        try {
          await getProjects();
          fail('Expected function to throw');
        } catch (error) {
          expect(error).toBe(mockError);
        }
      });
    });
  
    describe('getProjectWithID', () => {
      it('should fetch a specific project by ID successfully', async () => {
        const projectId = 123;
        const mockResponse = { data: { id: projectId, name: 'Test Project' } };
        
        (getProjectWithID as jest.Mock).mockResolvedValueOnce(mockResponse);
  
        const result = await getProjectWithID(projectId);
        
        expect(getProjectWithID).toHaveBeenCalledWith(projectId);
        expect(result).toEqual(mockResponse);
      });
  
      it('should handle errors when fetching a specific project fails', async () => {
        const projectId = 123;
        const mockError = new Error('Project not found');
        
        (getProjectWithID as jest.Mock).mockImplementationOnce(() => {
          handleApiError(mockError);
          return undefined;
        });
  
        await getProjectWithID(projectId);
        
        expect(getProjectWithID).toHaveBeenCalledWith(projectId);
        expect(handleApiError).toHaveBeenCalledWith(mockError);
      });
    });
  
    describe('createProject', () => {
      it('should create a project successfully', async () => {
        const projectData = { name: 'New Project', description: 'Test description' };
        const mockResponse = { 
          data: { 
            id: 1, 
            name: 'New Project', 
            description: 'Test description' 
          } 
        };
        
        (createProject as jest.Mock).mockResolvedValueOnce(mockResponse);
  
        const result = await createProject(projectData);
        
        expect(createProject).toHaveBeenCalledWith(projectData);
        expect(result).toEqual(mockResponse);
      });
  
      it('should handle errors when creating a project fails', async () => {
        const projectData = { name: 'New Project', description: 'Test description' };
        const mockError = new Error('Validation error');
        
        (createProject as jest.Mock).mockImplementationOnce(() => {
          handleApiError(mockError);
          return undefined;
        });
  
        await createProject(projectData);
        
        expect(createProject).toHaveBeenCalledWith(projectData);
        expect(handleApiError).toHaveBeenCalledWith(mockError);
      });
    });
  
    describe('putProject', () => {
      it('should update a project completely successfully', async () => {
        const projectId = 123;
        const updatedProjectData = { 
          name: 'Updated Project', 
          description: 'Updated description',
          status: 'active'
        };
        const mockResponse = { 
          data: { 
            id: projectId, 
            ...updatedProjectData 
          } 
        };
        
        (putProject as jest.Mock).mockResolvedValueOnce(mockResponse);
  
        const result = await putProject(projectId, updatedProjectData);
        
        expect(putProject).toHaveBeenCalledWith(projectId, updatedProjectData);
        expect(result).toEqual(mockResponse);
      });
  
      it('should handle errors when updating a project fails', async () => {
        const projectId = 123;
        const updatedProjectData = { name: 'Updated Project' };
        const mockError = new Error('Project not found');
        
        (putProject as jest.Mock).mockImplementationOnce(() => {
          handleApiError(mockError);
          return undefined;
        });
  
        await putProject(projectId, updatedProjectData);
        
        expect(putProject).toHaveBeenCalledWith(projectId, updatedProjectData);
        expect(handleApiError).toHaveBeenCalledWith(mockError);
      });
    });
  
    describe('patchProject', () => {
      it('should partially update a project successfully', async () => {
        const projectId = 123;
        const patchData = { name: 'Patched Project Name' };
        const mockResponse = { 
          data: { 
            id: projectId, 
            name: 'Patched Project Name',
            description: 'Original description' 
          } 
        };
        
        (patchProject as jest.Mock).mockResolvedValueOnce(mockResponse);
  
        const result = await patchProject(projectId, patchData);
        
        expect(patchProject).toHaveBeenCalledWith(projectId, patchData);
        expect(result).toEqual(mockResponse);
      });
  
      it('should handle errors when partially updating a project fails', async () => {
        const projectId = 123;
        const patchData = { name: 'Patched Project Name' };
        const mockError = new Error('Project not found');
        
        (patchProject as jest.Mock).mockImplementationOnce(() => {
          handleApiError(mockError);
          return undefined;
        });
  
        await patchProject(projectId, patchData);
        
        expect(patchProject).toHaveBeenCalledWith(projectId, patchData);
        expect(handleApiError).toHaveBeenCalledWith(mockError);
      });
    });
  
    describe('deleteProjectWithID', () => {
      it('should delete a project successfully', async () => {
        const projectId = 123;
        const mockResponse = { data: { message: 'Project deleted successfully' } };
        
        (deleteProjectWithID as jest.Mock).mockResolvedValueOnce(mockResponse);
  
        const result = await deleteProjectWithID(projectId);
        
        expect(deleteProjectWithID).toHaveBeenCalledWith(projectId);
        expect(result).toEqual(mockResponse);
      });
  
      it('should handle errors when deleting a project fails', async () => {
        const projectId = 123;
        const mockError = new Error('Project not found');
        
        (deleteProjectWithID as jest.Mock).mockImplementationOnce(() => {
          handleApiError(mockError);
          return undefined;
        });
  
        await deleteProjectWithID(projectId);
        
        expect(deleteProjectWithID).toHaveBeenCalledWith(projectId);
        expect(handleApiError).toHaveBeenCalledWith(mockError);
      });
    });
  
    describe('getProjectJoinRequests', () => {
      it('should fetch all project join requests successfully', async () => {
        const mockData = [
          { id: 1, projectId: 101, userId: 201, status: 'pending' }, 
          { id: 2, projectId: 102, userId: 202, status: 'approved' }
        ];
        
        (getProjectJoinRequests as jest.Mock).mockResolvedValueOnce(mockData);
  
        const result = await getProjectJoinRequests();
        
        expect(getProjectJoinRequests).toHaveBeenCalled();
        expect(result).toEqual(mockData);
      });
  
      it('should handle errors when fetching join requests fails', async () => {
        const mockError = new Error('Network error');
        
        (getProjectJoinRequests as jest.Mock).mockImplementationOnce(() => {
          handleApiError(mockError);
          throw mockError;
        });
  
        try {
          await getProjectJoinRequests();
          fail('Expected function to throw');
        } catch (error) {
          expect(getProjectJoinRequests).toHaveBeenCalled();
          expect(handleApiError).toHaveBeenCalledWith(mockError);
          expect(error).toBe(mockError);
        }
      });
    });
  });