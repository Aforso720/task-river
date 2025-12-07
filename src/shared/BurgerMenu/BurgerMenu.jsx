import React from "react";
import { Link, useLocation } from "react-router";
import { navItems } from "../router/navItems";
import { useBurgerMenu } from "@/features/Adaptive/store/useBurgerMenu";
import "./BurgerMenu.scss";

const BurgerMenu = () => {
  const location = useLocation();
  const { isOpen, close } = useBurgerMenu();

  if (!isOpen) return null;

  return (
    <div className="BurgerMenuOverlay" onClick={close}>
      <article
        className="BurgerMenu"
        onClick={(e) => e.stopPropagation()} 
      >
        <header className="BurgerMenu__header">
          <span className="BurgerMenu__title">Меню</span>
          <button
            type="button"
            className="BurgerMenu__close"
            onClick={close}
            aria-label="Закрыть меню"
          >
            ✕
          </button>
        </header>

        <nav className="BurgerMenu__nav">
          <ul className="BurgerMenu__navList">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li
                  key={item.path}
                  className={
                    "BurgerMenu__navItem" +
                    (isActive ? " BurgerMenu__navItem--active" : "")
                  }
                >
                  <Link
                    to={item.path}
                    onClick={close}
                    className="BurgerMenu__link"
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </article>
    </div>
  );
};

export default BurgerMenu;
