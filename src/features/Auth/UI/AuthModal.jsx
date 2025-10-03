import React from "react";
import "./AuthModal.scss";
import useAuthModalStore from "../store/authModal";

const AuthModal = () => {
  const { modalAuthLogin } = useAuthModalStore();

  if (!modalAuthLogin) return null;

  return (
    <article className="authModalOverlay flex items-center justify-center">
      <div className="authModal h-3/5 w-1/3 rounded-2xl border-[white]">
        <img
          src="image/LogoHead.svg"
          alt="Логотип сайта"
          className="w-40 h-40 rounded-xl mt-12 mb-3 mx-auto"
        />
        <section>
          <form class="space-y-6 mt-4" action="#" method="POST">
            <div>
              <label
                for="password"
                class="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div class="mt-1">
                <input
                  name="email"
                  type="email-address"
                  autocomplete="email-address"
                  required
                  class="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                for="password"
                class="block text-sm font-medium text-gray-700"
              >
                Пароль
              </label>
              <div class="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autocomplete="password"
                  required
                  class="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                class="flex w-full justify-center rounded-md border border-transparent bg-sky-400 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
              >
                Войти
              </button>
            </div>
          </form>
        </section>
      </div>
    </article>
  );
};

export default AuthModal;
