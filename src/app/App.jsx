import React, { Suspense, lazy } from "react";
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
import Forbidden from "@/pages/Forbidden";
import { RequireAuth, RequireRole } from "@/shared/router/guards";
import AdminBlog from "@/features/Admin/UI/AdminBlog/AdminBlog";
import AdminTariff from "@/features/Admin/UI/AdminTariff/AdminTariff";
import AdminUsers from "@/features/Admin/UI/AdminUsers/AdminUsers";

const AdminLayout = lazy(() => import("./route/AdminLayout"));
const AdminCard    = lazy(() => import("@/widgets/AdminCard/AdminCard"));

export default function App() {
  return (
    <>
      <AuthModal />
      <RegistrModal />

      <Suspense fallback={<div style={{ padding: 24 }}>Загрузка…</div>}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/tariffs" element={<Tariffs />} />
            <Route path="/education" element={null} />
            <Route path="/updates" element={<Updates />} />
            <Route path="/403" element={<Forbidden />} />
          </Route>

          <Route element={<PanelLayout />}>
            <Route path="/panel/*" element={<Panel />} />
          </Route>

          <Route
            path="/admin/*"
            element={
              <RequireAuth>
                <RequireRole roles={["ROLE_ADMIN"]}>
                  <AdminLayout />
                </RequireRole>
              </RequireAuth>
            }
          >
            <Route index element={<AdminCard />} />

            <Route path="blog" element={<AdminBlog/>} />
            <Route path="tariff" element={<AdminTariff/>} />
            <Route path="users" element={<AdminUsers/>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}
