import React from "react";
import './App.scss'
import { Routes, Route, Navigate } from "react-router";
import PublicLayout from "./route/PublicLayout";
import PanelLayout from "./route/PanelLayout";

import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Tariffs from "../pages/Tariffs/Tariffs";
import Updates from "../pages/Updates/Updates";
import Panel from "../pages/Panel/Panel";

import AuthModal from "../features/Auth/UI/AuthModal";
import RegistrModal from "@/features/Auth/UI/RegistrModal";

export default function App() {

  return (
    <>
      <AuthModal />
      <RegistrModal />

      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/tariffs" element={<Tariffs />} />
          <Route path="/education" element={null} />
          <Route path="/updates" element={<Updates />} />
        </Route>

          <Route element={<PanelLayout />}>
            <Route path="/panel/*" element={<Panel />} />
          </Route>
      </Routes>
    </>
  );
}
