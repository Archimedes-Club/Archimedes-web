// NotificationService.tsx (Updated to match backend structure + extended type)
import React, { useState, useEffect } from "react";
import {
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  IconButton,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate } from "react-router-dom";
import "../styles/NotificationService.css";
import { getPendingRequests } from "../services/api/projectMembershipServices";

// Backend structure
export interface Notification {
  id: number;
  user_id: number;
  member_name: string;
  project_id: number;
  project_title: string;
  role: string;
  status: string;
  user_email: string;
}

// Extended for UI usage
export interface NotificationExtended extends Notification {
  read: boolean;
  timestamp?: Date;
  formattedDate?: string;
}

interface NotificationProps {
  userRole: string;
}

export const useNotifications = (userRole: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();

  // Fetches the pending requests recieved by the authenticated uesr (professor)
  useEffect(() => {
    const fetchJoinRequest = async () => {
      try {
        const response: any = await getPendingRequests();
        // console.log("Response from getPendingRequest",response.data);

        setNotifications(response.data);
      } catch (error: any) {
        console.error(
          "error while making an API call to get pending requests for notifications"
        );
        alert(error.message);
      }
    };

    fetchJoinRequest();
  }, [userRole]);

  const handleViewAllInvites = (projectId: number) => {
    navigate(`/projects/${projectId}?viewInvites=true`);
  };

  return {
    notifications,
    handleViewAllInvites,
  };
};

export const NotificationComponent: React.FC<NotificationProps> = ({
  userRole,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { notifications, handleViewAllInvites } = useNotifications(userRole);

  // console.log(notifications);
  const menuOpen = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const grouped = notifications.reduce((acc, n) => {
    if (!acc[n.project_id]) {
      acc[n.project_id] = {
        title: n.project_title,
        projectId: n.project_id,
        requests: [],
      };
    }
    acc[n.project_id].requests.push(n);
    return acc;
  }, {} as Record<number, { title: string; projectId: number; requests: Notification[] }>);

  // console.log(grouped);
  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{ position: "absolute", top: 10, right: 20 }}
      >
        <Badge
          color="error"
          badgeContent={notifications.length > 0 ? notifications.length : null}
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleClose}
        PaperProps={{ style: { maxHeight: 400, width: "350px" } }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ p: 2, borderBottom: "1px solid #eee" }}>
          <Typography variant="h6">Notifications</Typography>
        </Box>
        {Object.keys(grouped).length === 0 ? (
          <MenuItem>No notifications</MenuItem>
        ) : (
          <List sx={{ width: "100%", p: 0 }}>
            {Object.values(grouped).map((group) => (
              <React.Fragment key={group.projectId}>
                <ListItem alignItems="flex-start">
                  <Box sx={{ width: "100%" }}>
                    {group.requests.map((req) => (
                      <Typography key={req.id} variant="body2">
                        {req.member_name} wants to join{" "}
                        <strong>{req.project_title}</strong>
                      </Typography>
                    ))}
                    <Button
                      size="small"
                      variant="text"
                      sx={{ mt: 1 }}
                      onClick={() => {
                        handleViewAllInvites(group.projectId);
                        handleClose();
                      }}
                    >
                      View All Requests
                    </Button>
                  </Box>
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        )}
      </Menu>
    </>
  );
};
