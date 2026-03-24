import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// The user dashboard has been merged back into the main website (/).
// This component simply redirects users there.
export default function UserDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  return null;
}
