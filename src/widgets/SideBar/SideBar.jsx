import React from "react"
import "./SideBar.scss"
import { Link, useLocation } from "react-router"
import { useThemeStore } from "../../app/store/themeStore"

const SideBar = () => {
  const location = useLocation()
  const { theme, toggleTheme } = useThemeStore() 
  const getActiveItem = () => {
    if (location.pathname.includes("/panel/project")) return "project"
    if (location.pathname.includes("/panel/board")) return "board"
    if (location.pathname.includes("/panel/tasks")) return "task"
    if (location.pathname.includes("/panel/menu")) return "panel"
    if (location.pathname.includes("/panel/market")) return "market"
    return ""
  }

  const activeItem = getActiveItem()

  return (
    <aside className="sideBar">
      <ul>
        <Link>
          <li className="mb-5">
            <img src="/image/LogoIcon.svg" alt="Logo" />
          </li>
        </Link>
        <Link to="/panel/menu">
          <li className={`sideBar-item ${activeItem === "panel" ? "active" : ""}`}>
            <img src="/image/PanelIcon.svg" alt="Menu" />
          </li>
        </Link>
        <Link to="/panel/project">
          <li className={`sideBar-item ${activeItem === "project" ? "active" : ""}`}>
            <img src="/image/ProjectIcon.svg" alt="Project" />
          </li>
        </Link>
        <Link to="/panel/board">
          <li className={`sideBar-item ${activeItem === "board" ? "active" : ""}`}>
            <img src="/image/BoardIcon.svg" alt="Boards" />
          </li>
        </Link>
        <Link to="/panel/tasks">
          <li className={`sideBar-item ${activeItem === "task" ? "active" : ""}`}>
            <img src="/image/TaskIcon.svg" alt="Tasks" />
          </li>
        </Link>
        <Link to="/panel/market">
          <li className={`sideBar-item my-1 ${activeItem === "market" ? "active" : ""}`}>
            <img src="/image/MarketIcon.svg" alt="Market" />
          </li>
        </Link>

        {/* ТЕМА — ПЕРЕКЛЮЧАТЕЛЬ */}
        <li className="sideBar-item p-2 cursor-pointer" onClick={toggleTheme}>
          <img
            src={
              theme === "dark"
                ? "/image/ThemeIconBlack.svg"
                : "/image/ThemeIcon.svg"
            }
            alt="Theme Toggle"
          />
        </li>
      </ul>

      <Link>
        <div className={`sideBar-item ${activeItem === "setting" ? "active" : ""}`}>
          <img src="/image/SettingICon.svg" alt="Setting" />
        </div>
      </Link>
    </aside>
  )
}

export default SideBar
