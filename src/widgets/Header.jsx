import React from "react";
import { Link, useLocation } from "react-router";
import useAuthModalStore from "../features/Auth/store/authModal";
import { navItems } from "@/shared/router/navItems";
import BurgerMenu from "@/shared/BurgerMenu/BurgerMenu";
import { useBurgerMenu } from "@/features/Adaptive/store/useBurgerMenu";
import { useIsMobile } from "@/features/Adaptive/hooks/useIsMobile";

const Header = () => {
  const location = useLocation();
  const { openModalAuthState } = useAuthModalStore();
  const { toggle } = useBurgerMenu();
  const isMobile = useIsMobile(900);

  return (
    <header className="Header flex justify-between items-center px-8 py-2 w-[1140px]">
      <Link to="/admin">
        <img src="/LogoHead.svg" alt="Logotip" className="cursor-pointer" />
      </Link>
      
      {!isMobile && (
        <>
          <nav>
            <ul className="navHeader flex justify-center items-center gap-4">
              {navItems.map((item, index) => (
                <li
                  key={index}
                  className={
                    location.pathname === item.path ? "activeNav" : ""
                  }
                >
                  <Link to={item.path}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <h2>
            <img
              src="image/user.svg"
              alt="User"
              onClick={openModalAuthState}
              className="cursor-pointer"
            />
          </h2>
        </>
      )}
      {isMobile && (
        <div className="HeaderMobileRight">
          <button
            type="button"
            className="Header__userButton"
            onClick={openModalAuthState}
          >
            <img src="image/user.svg" alt="User" />
          </button>

          <button
            type="button"
            className="Header__burgerButton"
            onClick={toggle}
            aria-label="Открыть меню"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      )}
      <BurgerMenu />
    </header>
  );
};

export default Header;
