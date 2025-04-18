import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { emailVerification, getUser, logout } from "../services/api/authServices";

export const VerifyEmail: React.FC = () => {
    const navigate = useNavigate();
    const [resendStatus, setResendStatus] = useState("");


    useEffect(() => {
        const checkVerification = async () => {
            try {
                const user = await getUser();
                window.location.reload();
                navigate('/dashboard');
            } catch (error) {
                console.error("User not verified yet");
            }
        };
        checkVerification();
        const interval = setInterval(checkVerification, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
    }, [navigate]);

    const handleLogout = async () =>{
        try {
            const response = await logout();
            alert(response?.message);
            navigate('/');
        } catch (error) {
            console.error(error)
        }
    }

    const handleResend = async() => {
        setResendStatus("sending verification email...");
        try {
            const response = await emailVerification();
            if (response?.status == 200){
                window.location.reload();
                navigate('/dashboard');
            }else if (response?.status == 202){
                setResendStatus("Verification email sent ✅");
            }
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h2>Verify Your Email Address</h2>
          <br />
          <p>
            A verification link has been sent to your email. Please click on it to activate your account.
          </p>
          <br />
    
          <button onClick={handleResend}>Resend Email</button>
          {resendStatus && <p>{resendStatus}</p>}
    
            <br />
          <p>If you already verified, you'll be redirected automatically. 
            <br />
            If you still didn't get the email, please check the if email address entered for registration is correct.
          </p>
    
          <button onClick={handleLogout} style={{ marginTop: "1rem", color: "red" }}>
            Logout
          </button>
        </div>
      );
}