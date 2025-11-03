import React, { useEffect } from "react";
import { Link, useLocation } from "react-router";

const AdminHeader = () => {
  const [listNavActiveHead, setListNavActiveHead] = React.useState(1);
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/admin/blog") {
      setListNavActiveHead(1);
    } else if (location.pathname === "/admin/tariff") {
      setListNavActiveHead(2);
    } else if (location.pathname === "/admin/users") {
      setListNavActiveHead(3);
    }
  }, [location.pathname]);
  return (
    <header className="pl-5 pt-2 flex items-center justify-center gap-10 relative">
      <Link to={"/"}>
        <img
          className="h-18 cursor-pointer absolute top-10 left-5"
          src="/image/LogoAdmin.png"
          alt="Логотип админки"
        />
        {/* <h1><b></b>TaskRiver.admin</h1> */}
      </Link>
      {location.pathname !== "/admin" ? (
        <div>
          <ul className="listsNavUpdates flex justify-center items-center gap-6 font-bold ">
            <Link to={"/admin/blog"}>
              <li
                className={
                  (listNavActiveHead == 1 ? "activeListNav " : "") +
                  "listNavUpdates text-2xl"
                }
                onClick={() => setListNavActiveHead(1)}
              >
                Управление блогом
              </li>
            </Link>
            <Link to={"/admin/tariff"}>
              <li
                className={
                  (listNavActiveHead == 2 ? "activeListNav " : "") +
                  "listNavUpdates text-2xl"
                }
                onClick={() => setListNavActiveHead(2)}
              >
                Настройки тарифов
              </li>
            </Link>
            <Link to={"/admin/users"}>
              <li
                className={
                  (listNavActiveHead == 3 ? "activeListNav " : "") +
                  "listNavUpdates text-2xl"
                }
                onClick={() => setListNavActiveHead(3)}
              >
                Управление пользователями
              </li>
            </Link>
          </ul>
        </div>
      ) : null}
    </header>
  );
};

export default AdminHeader;
