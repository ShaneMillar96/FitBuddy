import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const useLogout = () => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token"); 
        toast.info("Logged out successfully.");
        navigate("/login");
    };

    return { logout };
};
