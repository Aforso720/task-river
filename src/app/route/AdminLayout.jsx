import React from "react";
import { Outlet } from "react-router";
import AdminHeader from "@/widgets/AdminHeader/AdminHeader";

export default function AdminLayout() {
  return (
    <section className="AdminLayout">
      <AdminHeader />
      <section className="flex justify-center">
        <Outlet />
      </section>
    </section>
  );
}
