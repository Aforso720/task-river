import React from "react";
import "./AuthModal.scss";
import useAuthModalStore from "../store/authModal";
import useLoginRequest from "../api/loginRequest";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

const AuthModal = () => {
  const { modalAuthLogin, closeModalAuthState, openModalAuthRegistr } = useAuthModalStore();
  const { loginRequest, loading, error, sessionToken } = useLoginRequest();

  const modalRef = React.useRef(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm({
    mode: "onTouched",
    defaultValues: { username: "", password: "" },
  });

  const fromRaw = location.state && location.state.from;
  const from =
    typeof fromRaw === "string"
      ? fromRaw
      : (fromRaw && fromRaw.pathname ? fromRaw.pathname + (fromRaw.search || "") : "/panel/menu");

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        reset();
        closeModalAuthState();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeModalAuthState, reset]);

  React.useEffect(() => {
    if (sessionToken) {
      reset();
      closeModalAuthState();
      window.scrollTo(0, 0);
    }
  }, [sessionToken, closeModalAuthState, reset, from]);

  if (!modalAuthLogin) return null;

  const onSubmit = async (values) => {
  const result = await loginRequest(values);
  if (result.success) {
    navigate('panel/menu');
  }
};

  const goToRegister = () => {
    reset();
    openModalAuthRegistr();
  };

  return (
    <article className="authModalOverlay flex items-center justify-center">
      <div className="authModal p-10" ref={modalRef}>
        <img
          src="/LogoHead.svg"
          alt="Логотип сайта"
          className="w-40 h-40 rounded-xl mt-12 mb-3 mx-auto"
        />

        <form
          className="space-y-6 mt-10 mx-auto w-[500px] flex flex-col justify-center"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-white">
              Логин
            </label>
            <div className="mt-1">
              <input
                id="username"
                type="text"
                autoComplete="username"
                className={`px-2 py-3 mt-1 block w-full rounded-md border ${
                  errors.username ? "border-red-400" : "border-gray-300"
                } shadow-sm focus:border-[#8C6D51] focus:outline-none focus:ring-[#8C6D51] sm:text-sm`}
                {...register("username", {
                  required: "Введите логин",
                  minLength: { value: 3, message: "Минимум 3 символа" },
                  maxLength: { value: 32, message: "Максимум 32 символа" },
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+$/,
                    message: "Допустимы латиница, цифры, . _ -",
                  },
                })}
              />
            </div>
            {errors.username && (
              <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white">
              Пароль
            </label>
            <div className="mt-1">
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className={`px-2 py-3 mt-1 block w-full rounded-md border ${
                  errors.password ? "border-red-400" : "border-gray-300"
                } shadow-sm focus:border-[#8C6D51] focus:outline-none focus:ring-[#8C6D51] sm:text-sm`}
                {...register("password", {
                  required: "Введите пароль",
                  minLength: { value: 6, message: "Минимум 6 символов" },
                  maxLength: { value: 64, message: "Максимум 64 символа" },
                })}
              />
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {error && (
            <div className="text-red-400 text-sm -mb-2" role="alert">
              {error.message !== 'Bad credentials' && 'Неверный логин или пароль'}
            </div>
          )}

          <div className="textInAuthModal text-white font-normal text-xs">
            <span className="cursor-pointer hover:underline">Забыли пароль?</span>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || isSubmitting || !isValid}
              className="flex w-full justify-center rounded-md border border-transparent bg-[#22333B] py-2 px-4 text-xl font-bold text-white shadow-sm hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-[#8C6D51] focus:ring-offset-2 disabled:opacity-60"
            >
              {loading || isSubmitting ? "Входим..." : "Войти"}
            </button>
            <div className="textInAuthModal mt-4 text-white font-normal text-xs flex items-center justify-center">
              <span className="cursor-pointer hover:underline" onClick={goToRegister}>
                У вас еще нет учетной записи? Зарегистрироваться бесплатно
              </span>
            </div>
          </div>
        </form>
      </div>
    </article>
  );
};

export default AuthModal;
