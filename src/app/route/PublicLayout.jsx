import React from "react";
import Header from "@/widgets/Header";
import Footer from "@/widgets/Footer";
import { Outlet } from "react-router";

export default function PublicLayout() {
  return (
    <div className="App flex justify-between flex-col items-center">
      <Header />
      <main className="flex justify-center items-center">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
