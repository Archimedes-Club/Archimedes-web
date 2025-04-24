import React, { useEffect, useState } from "react";
import { HamburgerToggle } from "./Sidebar";
import { useAuth } from "../hooks/useAuth";
import Sidebar from "./Sidebar";
import "../styles/UserProfile.css";

const UserProfile: React.FC = () => {
  const { isAuthenticated, loading, userData } = useAuth();
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false);

  const [editPhone, setEditPhone] = useState<boolean>(false);
  const [editLinkedIn, setEditLinkedIn] = useState<boolean>(false);

  const [updatedPhone, setUpdatedPhone] = useState<string>("");
  const [updatedLinkedIn, setUpdatedLinkedIn] = useState<string>("");

  useEffect(() => {
    setUpdatedPhone(userData?.phone || "");
    setUpdatedLinkedIn(userData?.linkedin_url || "");
  }, [userData]);

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated)
    return <div>You are not authenticated. Please log in.</div>;

  const handleSidebarToggle = () => setIsSidebarVisible((prev) => !prev);
  const handleSidebarClose = () => setIsSidebarVisible(false);

  const handlePhoneUpdate = () => {
    if (editPhone) {
      console.log("Updated Phone: ", updatedPhone);
    }
    setEditPhone(!editPhone);
  };

  const handleLinkedInUpdate = () => {
    if (editLinkedIn) {
      console.log("Updated LinkedIn: ", updatedLinkedIn);
    }
    setEditLinkedIn(!editLinkedIn);
  };

  return (
    <div className="layout-container">
      <HamburgerToggle toggleSidebar={handleSidebarToggle} />
      <Sidebar isVisible={isSidebarVisible} onClose={handleSidebarClose} />
      <div className={`main-content ${isSidebarVisible ? "shifted" : ""}`}>
        <h2 className="page-title">User Profile</h2>
        <div className="user-profile-container">
          <form className="profile-form">
            {userData ? (
              <>
                <div className="profile-details">
                  <div className="profile-item">
                    <label>Name:</label>
                    <span>{userData.name}</span>
                  </div>

                  <div className="profile-item">
                    <label>Email id:</label>
                    <span>{userData.email}</span>
                  </div>

                  <div className="profile-item">
                    <label>Mobile number: </label>
                    <div className="input-group">
                      {editPhone ? (
                        <input
                          type="tel"
                          className="profile-input"
                          value={updatedPhone}
                          onChange={(e) => setUpdatedPhone(e.target.value)}
                        />
                      ) : (
                        <span>{updatedPhone || "Not Provided"}</span>
                      )}
                      <button
                        type="button"
                        className="edit-btn"
                        onClick={handlePhoneUpdate}
                      >
                        {editPhone ? "Update" : "Edit"}
                      </button>
                    </div>
                  </div>

                  <div className="profile-item">
                    <label>LinkedIn:</label>
                    <div className="input-group">
                      {editLinkedIn ? (
                        <input
                          type="url"
                          className="profile-input linkedin-input"
                          value={updatedLinkedIn}
                          onChange={(e) => setUpdatedLinkedIn(e.target.value)}
                        />
                      ) : (
                        <span>{updatedLinkedIn || "Not Provided"}</span>
                      )}
                      <button
                        type="button"
                        className="edit-btn"
                        onClick={handleLinkedInUpdate}
                      >
                        {editLinkedIn ? "Update" : "Edit"}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p>Profile information not found.</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
