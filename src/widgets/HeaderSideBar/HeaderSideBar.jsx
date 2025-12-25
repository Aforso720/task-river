import React from "react";
import "./HeaderSideBar.scss";
import { useUserData } from "./useUserData";
import { useFullVerse } from "@/features/Kanban/store/useFullVerse";
import { CSSTransition } from "react-transition-group";

const HeaderSideBar = () => {
  const { userData, loading } = useUserData();
  const { isFull } = useFullVerse();

  // React.useEffect(() => {
  //   getUserData();
  // }, [getUserData]);

  const firstInitial = (userData?.firstName || "").slice(0, 1);
  const lastInitial = (userData?.lastName || "").slice(0, 1);
  const initials = (firstInitial + lastInitial).toUpperCase();

  return (
    <CSSTransition
      in={!isFull}
      timeout={300}
      classNames="full-transition"
      unmountOnExit
    >
      <header className="HeaderSideBar">
        <section className="BlockSearchPanel">
          <img src="/image/Search.png" alt="Search" />
          <input
            className="inputSearch text-xs"
            type="text"
            placeholder="Поиск"
          />
        </section>

        <section className="profilePanel gap-3">
          <div className="iconArr gap-2">
            <img src="/image/MailIcon.png" alt="Mail" />
            <img src="/image/СallIcon.png" alt="Call" />
          </div>

          <div className="AvatarHeader">
            {initials || "?"}
          </div>

          <p className="text-2xl text-[#22333B] font-bold">
            {loading ? "Загрузка..." : userData?.username || ""}
          </p>
        </section>
      </header>
    </CSSTransition>
  );
};

export default HeaderSideBar;
