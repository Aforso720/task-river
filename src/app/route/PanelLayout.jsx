import React from "react";
import { Outlet , useNavigate } from "react-router";
import useAuthStore from "@/features/Auth/api/loginRequest";

export default function PanelLayout() {
  const {sessionToken} = useAuthStore();
  const navigate = useNavigate();
  if(!sessionToken) return navigate('/');
  return (
    <div className="w-full h-full">
      <Outlet />
    </div>
  );
}
