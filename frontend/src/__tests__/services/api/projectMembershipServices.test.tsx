jest.mock('../../../services/api/projectMembershipServices', () => ({
  joinProjectRequest: jest.fn(),
  getPendingRequests: jest.fn(),
  getProjectMembers: jest.fn(),
  approveJoinRequest: jest.fn(),
  rejectJoinRequest: jest.fn(),
  removeMemberFromProject: jest.fn(),
  getUserProjects: jest.fn()
}));

jest.mock('../../../services/api/authServices', () => ({
  handleApiError: jest.fn()
}));

import {
  joinProjectRequest,
  getPendingRequests,
  getProjectMembers,
  approveJoinRequest,
  rejectJoinRequest,
  removeMemberFromProject,
  getUserProjects
} from '../../../services/api/projectMembershipServices';

import { handleApiError } from '../../../services/api/authServices';

describe('Project Membership API Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('joinProjectRequest', () => {
    it('should send a join request successfully', async () => {
      const projectId = 123;
      const mockResponse = { 
        data: { 
          message: 'Join request sent successfully',
          data: {
            id: 1,
            project_id: projectId,
            user_id: 456,
            status: 'pending'
          } 
        } 
      };
      
      (joinProjectRequest as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await joinProjectRequest(projectId);
      
      expect(joinProjectRequest).toHaveBeenCalledWith(projectId);
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when sending a join request fails', async () => {
      const projectId = 123;
      const mockError = new Error('Failed to send join request');
      
      (joinProjectRequest as jest.Mock).mockImplementationOnce(() => {
        handleApiError(mockError);
        return undefined;
      });

      const result = await joinProjectRequest(projectId);
      
      expect(joinProjectRequest).toHaveBeenCalledWith(projectId);
      expect(handleApiError).toHaveBeenCalledWith(mockError);
      expect(result).toBeUndefined();
    });
  });

  describe('getPendingRequests', () => {
    it('should fetch pending requests successfully', async () => {
      const mockResponse = { 
        data: [
          { id: 1, project_id: 101, user_id: 201, status: 'pending' },
          { id: 2, project_id: 102, user_id: 202, status: 'pending' }
        ]
      };
      
      (getPendingRequests as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await getPendingRequests();
      
      expect(getPendingRequests).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when fetching pending requests fails', async () => {
      const mockError = new Error('Failed to fetch pending requests');
      
      (getPendingRequests as jest.Mock).mockImplementationOnce(() => {
        handleApiError(mockError);
        return undefined;
      });

      const result = await getPendingRequests();
      
      expect(getPendingRequests).toHaveBeenCalled();
      expect(handleApiError).toHaveBeenCalledWith(mockError);
      expect(result).toBeUndefined();
    });
  });

  describe('getProjectMembers', () => {
    it('should fetch project members successfully', async () => {
      const projectId = 123;
      const mockResponse = { 
        data: [
          { id: 1, project_id: projectId, user_id: 201, status: 'approved', user: { name: 'User 1' } },
          { id: 2, project_id: projectId, user_id: 202, status: 'approved', user: { name: 'User 2' } }
        ]
      };
      
      (getProjectMembers as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await getProjectMembers(projectId);
      
      expect(getProjectMembers).toHaveBeenCalledWith(projectId);
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when fetching project members fails', async () => {
      const projectId = 123;
      const mockError = new Error('Failed to fetch project members');
      
      (getProjectMembers as jest.Mock).mockImplementationOnce(() => {
        handleApiError(mockError);
        return undefined;
      });

      const result = await getProjectMembers(projectId);
      
      expect(getProjectMembers).toHaveBeenCalledWith(projectId);
      expect(handleApiError).toHaveBeenCalledWith(mockError);
      expect(result).toBeUndefined();
    });
  });

  describe('approveJoinRequest', () => {
    it('should approve a join request successfully', async () => {
      const projectId = 123;
      const userId = 456;
      const mockResponse = { 
        data: { 
          message: 'Join request approved successfully',
          data: {
            id: 1,
            project_id: projectId,
            user_id: userId,
            status: 'approved'
          }
        }
      };
      
      (approveJoinRequest as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await approveJoinRequest(projectId, userId);
      
      expect(approveJoinRequest).toHaveBeenCalledWith(projectId, userId);
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when approving a join request fails', async () => {
      const projectId = 123;
      const userId = 456;
      const mockError = new Error('Failed to approve join request');
      
      (approveJoinRequest as jest.Mock).mockImplementationOnce(() => {
        handleApiError(mockError);
        return undefined;
      });

      const result = await approveJoinRequest(projectId, userId);
      
      expect(approveJoinRequest).toHaveBeenCalledWith(projectId, userId);
      expect(handleApiError).toHaveBeenCalledWith(mockError);
      expect(result).toBeUndefined();
    });
  });

  describe('rejectJoinRequest', () => {
    it('should reject a join request successfully', async () => {
      const projectId = 123;
      const userId = 456;
      const mockResponse = { 
        data: { 
          message: 'Join request rejected successfully',
          data: {
            id: 1,
            project_id: projectId,
            user_id: userId,
            status: 'rejected'
          }
        }
      };
      
      (rejectJoinRequest as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await rejectJoinRequest(projectId, userId);
      
      expect(rejectJoinRequest).toHaveBeenCalledWith(projectId, userId);
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when rejecting a join request fails', async () => {
      const projectId = 123;
      const userId = 456;
      const mockError = new Error('Failed to reject join request');
      
      (rejectJoinRequest as jest.Mock).mockImplementationOnce(() => {
        handleApiError(mockError);
        return undefined;
      });

      const result = await rejectJoinRequest(projectId, userId);
      
      expect(rejectJoinRequest).toHaveBeenCalledWith(projectId, userId);
      expect(handleApiError).toHaveBeenCalledWith(mockError);
      expect(result).toBeUndefined();
    });
  });

  describe('removeMemberFromProject', () => {
    it('should remove a member from a project successfully', async () => {
      const projectId = 123;
      const userId = 456;
      const mockResponse = { 
        data: { 
          message: 'Member removed successfully' 
        }
      };
      
      (removeMemberFromProject as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await removeMemberFromProject(projectId, userId);
      
      expect(removeMemberFromProject).toHaveBeenCalledWith(projectId, userId);
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when removing a member fails', async () => {
      const projectId = 123;
      const userId = 456;
      const mockError = new Error('Failed to remove member');
      
      (removeMemberFromProject as jest.Mock).mockImplementationOnce(() => {
        handleApiError(mockError);
        return undefined;
      });

      const result = await removeMemberFromProject(projectId, userId);
      
      expect(removeMemberFromProject).toHaveBeenCalledWith(projectId, userId);
      expect(handleApiError).toHaveBeenCalledWith(mockError);
      expect(result).toBeUndefined();
    });
  });

  describe('getUserProjects', () => {
    it('should fetch user projects successfully', async () => {
      const mockResponse = { 
        data: [
          { 
            id: 1, 
            project_id: 101, 
            user_id: 201, 
            status: 'approved',
            project: { 
              id: 101, 
              name: 'Project 1', 
              description: 'Description 1' 
            } 
          },
          { 
            id: 2, 
            project_id: 102, 
            user_id: 201, 
            status: 'approved',
            project: { 
              id: 102, 
              name: 'Project 2', 
              description: 'Description 2' 
            } 
          }
        ]
      };
      
      (getUserProjects as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await getUserProjects();
      
      expect(getUserProjects).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when fetching user projects fails', async () => {
      const mockError = new Error('Failed to fetch user projects');
      
      (getUserProjects as jest.Mock).mockImplementationOnce(() => {
        handleApiError(mockError);
        return undefined;
      });

      const result = await getUserProjects();
      
      expect(getUserProjects).toHaveBeenCalled();
      expect(handleApiError).toHaveBeenCalledWith(mockError);
      expect(result).toBeUndefined();
    });
  });
});