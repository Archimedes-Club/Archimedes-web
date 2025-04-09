// // NotificationService.tsx
// import React, { useState, useEffect } from "react";
// import {
//   Badge,
//   Menu,
//   MenuItem,
//   Typography,
//   Box,
//   Button,
//   Divider,
//   List,
//   ListItem,
//   IconButton,
// } from "@mui/material";
// import NotificationsIcon from "@mui/icons-material/Notifications";
// import { useNavigate } from "react-router-dom";
// import "../styles/NotificationService.css"; // Ensure you have the CSS file for styling

// export interface ProjectMember {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
//   avatar?: string;
//   skills?: string;
//   joinDate?: Date;
// }

// export interface Notification {
//   id: number;
//   type:
//     | "invite_request"
//     | "project_invite"
//     | "request_accepted"
//     | "request_rejected";
//   message: string;
//   projectId: number;
//   projectTitle: string;
//   fromUser: string;
//   timestamp: Date;
//   read: boolean;
//   skills?: string;
//   userId?: number;
//   email?: string;
// }

// interface NotificationProps {
//   userRole: string;
//   onAcceptInvite?: (
//     userId: number,
//     projectId: number,
//     skills: string,
//     name: string,
//     email: string
//   ) => void;
// }

// export const useNotifications = (userRole: string, projects: any[] = []) => {
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Mock notifications based on user role
//     const mockNotifications: Notification[] = [];
//     if (userRole === "professor") {
//       mockNotifications.push(
//         {
//           id: 1,
//           type: "invite_request",
//           message: "John Doe wants to join your project",
//           projectId: 1,
//           projectTitle: "AI Research Project",
//           fromUser: "John Doe",
//           timestamp: new Date(2025, 3, 2),
//           read: false,
//           skills: "Python, Machine Learning, Data Analysis",
//           userId: 101,
//           email: "john.doe@example.com",
//         },
//         {
//           id: 2,
//           type: "invite_request",
//           message: "Jane Smith wants to join your project",
//           projectId: 1,
//           projectTitle: "AI Research Project",
//           fromUser: "Jane Smith",
//           timestamp: new Date(2025, 3, 3),
//           read: false,
//           skills: "React, TypeScript, UI/UX Design",
//           userId: 102,
//           email: "jane.smith@example.com",
//         },
//         {
//           id: 3,
//           type: "project_invite",
//           message: "Prof. Johnson invited you to join Web Development Project",
//           projectId: 2,
//           projectTitle: "Web Development Project",
//           fromUser: "Prof. Johnson",
//           timestamp: new Date(2025, 3, 1),
//           read: true,
//         }
//       );
//     } else {
//       mockNotifications.push(
//         {
//           id: 4,
//           type: "request_accepted",
//           message: "Your request to join AI Research Project was accepted",
//           projectId: 1,
//           projectTitle: "AI Research Project",
//           fromUser: "Prof. Lopez",
//           timestamp: new Date(2025, 3, 3),
//           read: false,
//         },
//         {
//           id: 5,
//           type: "request_rejected",
//           message: "Your request to join IoT Project was rejected",
//           projectId: 3,
//           projectTitle: "IoT Project",
//           fromUser: "Prof. Williams",
//           timestamp: new Date(2025, 3, 2),
//           read: false,
//         },
//         {
//           id: 6,
//           type: "project_invite",
//           message: "Prof. Johnson invited you to join Web Development Project",
//           projectId: 2,
//           projectTitle: "Web Development Project",
//           fromUser: "Prof. Johnson",
//           timestamp: new Date(2025, 3, 1),
//           read: true,
//         }
//       );
//     }
//     setNotifications(mockNotifications);
//   }, [userRole]);

//   const markAsRead = (id: number) => {
//     setNotifications(
//       notifications.map((notification) =>
//         notification.id === id ? { ...notification, read: true } : notification
//       )
//     );
//   };

//   const handleAcceptInvite = (
//     notificationId: number,
//     projectId: number,
//     fromUser: string
//   ) => {
//     console.log(`Accepted invite from ${fromUser} for project ${projectId}`);
//     markAsRead(notificationId);
//   };

//   const handleRejectInvite = (
//     notificationId: number,
//     projectId: number,
//     fromUser: string
//   ) => {
//     console.log(`Rejected invite from ${fromUser} for project ${projectId}`);
//     markAsRead(notificationId);
//   };

//   // const handleViewAllInvites = (projectId: number) => {
//   //   navigate(`/projects/${projectId}`);
//   // };

//   const handleViewAllInvites = (projectId: number) => {
//     navigate(`/projects/${projectId}?viewInvites=true`);
//   };

//   const formatDate = (date: Date) => {
//     const today = new Date();
//     const yesterday = new Date(today);
//     yesterday.setDate(yesterday.getDate() - 1);

//     if (date.toDateString() === today.toDateString()) {
//       return `Today at ${date.toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       })}`;
//     } else if (date.toDateString() === yesterday.toDateString()) {
//       return `Yesterday at ${date.toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       })}`;
//     } else {
//       return (
//         date.toLocaleDateString([], { month: "short", day: "numeric" }) +
//         ` at ${date.toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         })}`
//       );
//     }
//   };

//   return {
//     notifications,
//     unreadCount: notifications.filter((n) => !n.read).length,
//     markAsRead,
//     handleAcceptInvite,
//     handleRejectInvite,
//     handleViewAllInvites,
//     formatDate,
//   };
// };

// export const NotificationComponent: React.FC<NotificationProps> = ({
//   userRole,
//   onAcceptInvite,
// }) => {
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const {
//     notifications,
//     unreadCount,
//     markAsRead,
//     handleAcceptInvite,
//     handleRejectInvite,
//     handleViewAllInvites,
//     formatDate,
//   } = useNotifications(userRole);
//   const navigate = useNavigate();
//   const menuOpen = Boolean(anchorEl);

//   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleNotificationItemClick = (notification: Notification) => {
//     markAsRead(notification.id);
//     if (
//       notification.type === "project_invite" ||
//       notification.type === "request_accepted" ||
//       notification.type === "request_rejected"
//     ) {
//       navigate(`/projects/${notification.projectId}`);
//     }
//     handleClose();
//   };

//   const handleAcceptInviteClick = (notification: Notification) => {
//     handleAcceptInvite(
//       notification.id,
//       notification.projectId,
//       notification.fromUser
//     );

//     // Call the parent component's handler if provided
//     if (onAcceptInvite && notification.userId && notification.skills) {
//       onAcceptInvite(
//         notification.userId,
//         notification.projectId,
//         notification.skills,
//         notification.fromUser,
//         notification.email ||
//           `${notification.fromUser.toLowerCase().replace(" ", ".")}@example.com`
//       );
//     }

//     handleClose();
//   };

//   return (
//     <>
//       <IconButton
//         onClick={handleClick}
//         aria-controls={menuOpen ? "notification-menu" : undefined}
//         aria-haspopup="true"
//         aria-expanded={menuOpen ? "true" : undefined}
//         sx={{
//           position: "absolute",
//           top: "10px",
//           right: "20px",
//           "& .MuiSvgIcon-root": {
//             fontSize: "28px", // Increase icon size
//           },
//         }}
//       >
//         <Badge badgeContent={unreadCount} color="error">
//           <NotificationsIcon className="notification-icon" />
//         </Badge>
//       </IconButton>
//       <Menu
//         id="notification-menu"
//         anchorEl={anchorEl}
//         open={menuOpen}
//         onClose={handleClose}
//         PaperProps={{
//           style: {
//             maxHeight: 400,
//             width: "350px",
//           },
//         }}
//         transformOrigin={{ horizontal: "right", vertical: "top" }}
//         anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
//       >
//         <Box sx={{ p: 2, borderBottom: "1px solid #eee" }}>
//           <Typography variant="h6">Notifications</Typography>
//         </Box>

//         {notifications.length === 0 ? (
//           <MenuItem>
//             <Typography variant="body2">No notifications</Typography>
//           </MenuItem>
//         ) : (
//           <List sx={{ width: "100%", p: 0 }}>
//             {notifications.map((notification) => (
//               <React.Fragment key={notification.id}>
//                 <ListItem
//                   alignItems="flex-start"
//                   sx={{
//                     backgroundColor: notification.read
//                       ? "transparent"
//                       : "#f0f7ff",
//                     "&:hover": { backgroundColor: "#f5f5f5" },
//                   }}
//                 >
//                   <Box sx={{ width: "100%" }}>
//                     <Box
//                       display="flex"
//                       justifyContent="space-between"
//                       alignItems="center"
//                     >
//                       <Typography variant="subtitle2" color="text.primary">
//                         {notification.fromUser}
//                       </Typography>
//                       <Typography variant="caption" color="text.secondary">
//                         {formatDate(notification.timestamp)}
//                       </Typography>
//                     </Box>

//                     <Typography
//                       variant="body2"
//                       color="text.primary"
//                       sx={{ mt: 1 }}
//                     >
//                       {notification.message}
//                     </Typography>

//                     {userRole === "professor" &&
//                       notification.type === "invite_request" && (
//                         <Box
//                           sx={{
//                             mt: 1,
//                             display: "flex",
//                             flexDirection: "column",
//                             gap: 1,
//                           }}
//                         >
//                           {notification.skills && (
//                             <Typography
//                               variant="caption"
//                               color="text.secondary"
//                             >
//                               Skills: {notification.skills}
//                             </Typography>
//                           )}
//                           <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
//                             <Button
//                               size="small"
//                               variant="contained"
//                               color="primary"
//                               onClick={() =>
//                                 handleAcceptInviteClick(notification)
//                               }
//                             >
//                               Accept
//                             </Button>
//                             <Button
//                               size="small"
//                               variant="outlined"
//                               color="error"
//                               onClick={() => {
//                                 handleRejectInvite(
//                                   notification.id,
//                                   notification.projectId,
//                                   notification.fromUser
//                                 );
//                                 handleClose();
//                               }}
//                             >
//                               Reject
//                             </Button>
//                           </Box>
//                         </Box>
//                       )}

//                     {(notification.type === "project_invite" ||
//                       notification.type === "request_accepted" ||
//                       notification.type === "request_rejected") && (
//                       <Box sx={{ mt: 1 }}>
//                         <Button
//                           size="small"
//                           variant="text"
//                           color="primary"
//                           onClick={() =>
//                             handleNotificationItemClick(notification)
//                           }
//                         >
//                           View Project
//                         </Button>
//                       </Box>
//                     )}
//                   </Box>
//                 </ListItem>
//                 <Divider component="li" />
//               </React.Fragment>
//             ))}

//             {userRole === "professor" &&
//               notifications.filter((n) => n.type === "invite_request").length >
//                 2 && (
//                 <ListItem>
//                   <Button
//                     fullWidth
//                     variant="text"
//                     onClick={() => {
//                       handleViewAllInvites(1);
//                       handleClose();
//                     }}
//                   >
//                     See all invite requests
//                   </Button>
//                 </ListItem>
//               )}
//           </List>
//         )}
//       </Menu>
//     </>
//   );
// };

// // Add the missing ProjectMembersSection component
// export const ProjectMembersSection: React.FC<{
//   projectId: number | string;
//   userRole: string;
// }> = ({ projectId, userRole }) => {
//   const [members, setMembers] = useState<ProjectMember[]>([]);

//   useEffect(() => {
//     // Mock data for project members
//     const mockMembers: ProjectMember[] = [
//       {
//         id: "1",
//         name: "Aiden Smith",
//         email: "aiden@example.com",
//         role: "TEAM LEAD",
//         skills: "Project Management, Leadership",
//         joinDate: new Date(2025, 1, 15),
//       },
//     ];

//     setMembers(mockMembers);
//   }, [projectId]);

//   return (
//     <div className="project-members-section">
//       <h3>Project Members</h3>
//       {members.length === 0 ? (
//         <p>No members in this project yet.</p>
//       ) : (
//         <div className="members-list">
//           {members.map((member) => (
//             <div key={member.id} className="member-card">
//               <div className="member-avatar-container">
//                 {member.avatar ? (
//                   <img
//                     src={member.avatar}
//                     alt={member.name}
//                     className="member-avatar"
//                   />
//                 ) : (
//                   <div className="member-avatar-placeholder">
//                     <Typography variant="h6">
//                       {member.name.charAt(0)}
//                     </Typography>
//                   </div>
//                 )}
//               </div>
//               <div className="member-info">
//                 <Typography variant="h6" className="member-name">
//                   {member.name}
//                 </Typography>
//                 <Typography variant="body2" className="member-email">
//                   {member.email}
//                 </Typography>
//                 <span className="member-role-chip">{member.role}</span>
//                 {member.skills && (
//                   <Typography variant="body2" className="member-skills">
//                     <strong>Skills:</strong> {member.skills}
//                   </Typography>
//                 )}
//                 {member.joinDate && (
//                   <Typography variant="body2" className="member-join-date">
//                     <strong>Joined:</strong>{" "}
//                     {member.joinDate.toLocaleDateString()}
//                   </Typography>
//                 )}
//               </div>
//               {userRole === "professor" && (
//                 <Button
//                   variant="outlined"
//                   color="error"
//                   size="small"
//                   className="remove-member-btn"
//                 >
//                   Remove Member
//                 </Button>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// NotificationService.tsx updated UI and logic

// NotificationService.tsx (Updated with grouped View All Requests by project)
// import React, { useState, useEffect } from "react";
// import {
//   Badge,
//   Menu,
//   MenuItem,
//   Typography,
//   Box,
//   Button,
//   Divider,
//   List,
//   ListItem,
//   IconButton,
// } from "@mui/material";
// import NotificationsIcon from "@mui/icons-material/Notifications";
// import { useNavigate } from "react-router-dom";
// import "../styles/NotificationService.css";

// export interface ProjectMember {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
//   avatar?: string;
//   skills?: string;
//   joinDate?: Date;
// }

// export interface Notification {
//   id: number;
//   type:
//     | "invite_request"
//     | "project_invite"
//     | "request_accepted"
//     | "request_rejected";
//   message: string;
//   projectId: number;
//   projectTitle: string;
//   fromUser: string;
//   timestamp: Date;
//   read: boolean;
//   skills?: string;
//   userId?: number;
//   email?: string;
// }

// interface NotificationProps {
//   userRole: string;
//   onAcceptInvite?: (
//     userId: number,
//     projectId: number,
//     skills: string,
//     name: string,
//     email: string
//   ) => void;
// }

// export const useNotifications = (userRole: string, projects: any[] = []) => {
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const navigate = useNavigate();

//   // "id": 3,
//   //       "user_id": 3,
//   //       "member_name": "Test Student 1",
//   //       "project_id": 11,
//   //       "proejct_title": "Archimedes Web portal",
//   //       "role": "member",
//   //       "status": "pending",
//   //       "user_email": "teststudent.1@northeastern.edu"

//   useEffect(() => {
//     const mockNotifications: Notification[] = [];
//     if (userRole === "professor") {
//       mockNotifications.push(
//         {
//           id: 1,
//           type: "invite_request",
//           message: "John Doe wants to join your project",
//           projectId: 1,
//           projectTitle: "AI Research Project",
//           fromUser: "John Doe",
//           timestamp: new Date(),
//           read: false,
//           skills: "Python, Machine Learning",
//           userId: 101,
//           email: "john@example.com",
//         },
//         {
//           id: 2,
//           type: "invite_request",
//           message: "Jane Smith wants to join your project",
//           projectId: 1,
//           projectTitle: "AI Research Project",
//           fromUser: "Jane Smith",
//           timestamp: new Date(),
//           read: false,
//           skills: "React, TypeScript",
//           userId: 102,
//           email: "jane@example.com",
//         },
//         {
//           id: 3,
//           type: "invite_request",
//           message: "Mike Ross wants to join your project",
//           projectId: 2,
//           projectTitle: "Blockchain Project",
//           fromUser: "Mike Ross",
//           timestamp: new Date(),
//           read: false,
//           skills: "Solidity, Smart Contracts",
//           userId: 103,
//           email: "mike@example.com",
//         }
//       );
//     }
//     setNotifications(mockNotifications);
//   }, [userRole]);

//   const markAsRead = (id: number) => {
//     setNotifications((prev) =>
//       prev.map((n) => (n.id === id ? { ...n, read: true } : n))
//     );
//   };

//   const handleAcceptInvite = (
//     notificationId: number,
//     projectId: number,
//     fromUser: string
//   ) => {
//     markAsRead(notificationId);
//     console.log(`Accepted invite from ${fromUser} for project ${projectId}`);
//   };

//   const handleRejectInvite = (
//     notificationId: number,
//     projectId: number,
//     fromUser: string
//   ) => {
//     markAsRead(notificationId);
//     console.log(`Rejected invite from ${fromUser} for project ${projectId}`);
//   };

//   const handleViewAllInvites = (projectId: number) => {
//     notifications
//       .filter((n) => n.projectId === projectId && !n.read)
//       .forEach((n) => markAsRead(n.id));
//     navigate(`/projects/${projectId}?viewInvites=true`);
//   };

//   const formatDate = (date: Date) => {
//     return date.toLocaleString();
//   };

//   return {
//     notifications,
//     unreadCount: notifications.filter((n) => !n.read).length,
//     markAsRead,
//     handleAcceptInvite,
//     handleRejectInvite,
//     handleViewAllInvites,
//     formatDate,
//   };
// };

// export const NotificationComponent: React.FC<NotificationProps> = ({
//   userRole,
//   onAcceptInvite,
// }) => {
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const {
//     notifications,
//     unreadCount,
//     markAsRead,
//     handleAcceptInvite,
//     handleRejectInvite,
//     handleViewAllInvites,
//     formatDate,
//   } = useNotifications(userRole);

//   const menuOpen = Boolean(anchorEl);
//   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const inviteGroups = notifications.reduce((acc, n) => {
//     if (n.type !== "invite_request") return acc;
//     const key = n.projectId;
//     if (!acc[key]) {
//       acc[key] = {
//         projectTitle: n.projectTitle,
//         projectId: n.projectId,
//         requests: [],
//       };
//     }
//     acc[key].requests.push(n);
//     return acc;
//   }, {} as Record<number, { projectTitle: string; projectId: number; requests: Notification[] }>);

//   return (
//     <>
//       <IconButton
//         onClick={handleClick}
//         sx={{ position: "absolute", top: 10, right: 20 }}
//       >
//         <Badge badgeContent={unreadCount} color="error">
//           <NotificationsIcon />
//         </Badge>
//       </IconButton>
//       <Menu
//         anchorEl={anchorEl}
//         open={menuOpen}
//         onClose={handleClose}
//         PaperProps={{ style: { maxHeight: 400, width: "350px" } }}
//         transformOrigin={{ horizontal: "right", vertical: "top" }}
//         anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
//       >
//         <Box sx={{ p: 2, borderBottom: "1px solid #eee" }}>
//           <Typography variant="h6">Notifications</Typography>
//         </Box>
//         {Object.keys(inviteGroups).length === 0 ? (
//           <MenuItem>No notifications</MenuItem>
//         ) : (
//           <List sx={{ width: "100%", p: 0 }}>
//             {Object.values(inviteGroups).map((group) => (
//               <React.Fragment key={group.projectId}>
//                 <ListItem alignItems="flex-start">
//                   <Box sx={{ width: "100%" }}>
//                     {group.requests.map((req) => (
//                       <Typography key={req.id} variant="body2">
//                         {req.fromUser} wants to join{" "}
//                         <strong>{group.projectTitle}</strong>
//                       </Typography>
//                     ))}
//                     <Button
//                       size="small"
//                       variant="text"
//                       sx={{ mt: 1 }}
//                       onClick={() => {
//                         handleViewAllInvites(group.projectId);
//                         handleClose();
//                       }}
//                     >
//                       View All Requests
//                     </Button>
//                   </Box>
//                 </ListItem>
//                 <Divider component="li" />
//               </React.Fragment>
//             ))}
//           </List>
//         )}
//       </Menu>
//     </>
//   );
// };

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

// Backend structure
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
  const [notifications, setNotifications] = useState<NotificationExtended[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const mock: NotificationExtended[] = [];
    if (userRole === "professor") {
      mock.push(
        {
          id: 1,
          user_id: 3,
          member_name: "Test Student 1",
          project_id: 11,
          proejct_title: "Archimedes Web portal",
          role: "member",
          status: "pending",
          user_email: "teststudent.1@northeastern.edu",
          read: false,
          timestamp: new Date(),
        },
        {
          id: 2,
          user_id: 4,
          member_name: "Test Student 2",
          project_id: 11,
          proejct_title: "Archimedes Web portal",
          role: "member",
          status: "pending",
          user_email: "teststudent.2@northeastern.edu",
          read: false,
          timestamp: new Date(),
        }
      );
    }
    setNotifications(mock);
  }, [userRole]);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleViewAllInvites = (projectId: number) => {
    notifications
      .filter((n) => n.project_id === projectId && !n.read)
      .forEach((n) => markAsRead(n.id));
    navigate(`/projects/${projectId}?viewInvites=true`);
  };

  return {
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
    handleViewAllInvites,
    markAsRead,
  };
};

export const NotificationComponent: React.FC<NotificationProps> = ({ userRole }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { notifications, unreadCount, handleViewAllInvites } = useNotifications(userRole);

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
        title: n.proejct_title,
        projectId: n.project_id,
        requests: [],
      };
    }
    acc[n.project_id].requests.push(n);
    return acc;
  }, {} as Record<number, { title: string; projectId: number; requests: NotificationExtended[] }>);

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{ position: "absolute", top: 10, right: 20 }}
      >
        <Badge badgeContent={unreadCount} color="error">
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
                        {req.member_name} wants to join <strong>{group.title}</strong>
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