import React from "react";
import { useForm } from "react-hook-form";
import useAuthModalStore from "../store/authModal";
import "./AuthModal.scss";
import useRegisterRequest from "../api/registerRequest";

const RegistrModal = () => {
  const modalRef = React.useRef(null);

  const {
    modalAuthRegistr,
    closeModalAuthRegistr,
    openModalAuthLogin,     // НОВОЕ: для переключения на логин
    prefillEmail,           // НОВОЕ: email с главной
    flowSource,             // НОВОЕ: откуда открыли («home»)
  } = useAuthModalStore();

  const { registerRequest, loading, error, success, reset } = useRegisterRequest();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
    reset: resetForm,
    setValue,
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const passwordValue = watch("password");

  // клик вне модалки — закрыть
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        reset();
        resetForm();
        closeModalAuthRegistr();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeModalAuthRegistr, reset, resetForm]);

  // успех регистрации — закрыть
  React.useEffect(() => {
    if (success && modalAuthRegistr) {
      reset();
      resetForm();
      closeModalAuthRegistr();
    }
  }, [success, modalAuthRegistr, closeModalAuthRegistr, reset, resetForm]);

  // автоподстановка email, если пришёл из стора (например, со страницы Home)
  React.useEffect(() => {
    if (modalAuthRegistr && prefillEmail) {
      setValue("email", prefillEmail, { shouldValidate: true });
    }
  }, [modalAuthRegistr, prefillEmail, setValue]);

  if (!modalAuthRegistr) return null;

  const onSubmit = async (values) => {
    await registerRequest(values);
  };

  const onBack = () => {
    // если модалка регистрации открыта с главной — просто закрываем
    if (flowSource === "home") {
      reset();
      resetForm();
      closeModalAuthRegistr();
      return;
    }
    // иначе — переключаемся на логин
    reset();
    resetForm();
    closeModalAuthRegistr();
    openModalAuthLogin();
  };

  return (
    <article className="authModalOverlay flex items-center justify-center">
      <div className="authModal p-10 relative" ref={modalRef}>
        <button
          className="absolute top-4 left-4 text-white font-bold text-xl"
          onClick={onBack}
          type="button"
        >
          {"< Назад"}
        </button>

        <img
          src="image/LogoHead.svg"
          alt="Логотип сайта"
          className="w-40 h-40 rounded-xl mt-4 mb-3 mx-auto"
        />

        <form
          className="space-y-6 mx-auto w-[500px] flex flex-col justify-center"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-white">
              Логин
            </label>
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
            {errors.username && (
              <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={`px-2 py-3 mt-1 block w-full rounded-md border ${
                errors.email ? "border-red-400" : "border-gray-300"
              } shadow-sm focus:border-[#8C6D51] focus:outline-none focus:ring-[#8C6D51] sm:text-sm`}
              {...register("email", {
                required: "Введите email",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Некорректный email",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              className={`px-2 py-3 mt-1 block w-full rounded-md border ${
                errors.password ? "border-red-400" : "border-gray-300"
              } shadow-sm focus:border-[#8C6D51] focus:outline-none focus:ring-[#8C6D51] sm:text-sm`}
              {...register("password", {
                required: "Введите пароль",
                minLength: { value: 6, message: "Минимум 6 символов" },
                maxLength: { value: 64, message: "Максимум 64 символа" },
              })}
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password_confirmation" className="block text-sm font-medium text-white">
              Повторите пароль
            </label>
            <input
              id="password_confirmation"
              type="password"
              autoComplete="new-password"
              className={`px-2 py-3 mt-1 block w-full rounded-md border ${
                errors.password_confirmation ? "border-red-400" : "border-gray-300"
              } shadow-sm focus:border-[#8C6D51] focus:outline-none focus:ring-[#8C6D51] sm:text-sm`}
              {...register("password_confirmation", {
                required: "Повторите пароль",
                validate: (value) => value === passwordValue || "Пароли не совпадают",
              })}
            />
            {errors.password_confirmation && (
              <p className="text-red-400 text-xs mt-1">
                {errors.password_confirmation.message}
              </p>
            )}
          </div>

          {error && (
            <div className="text-red-400 text-sm" role="alert">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading || isSubmitting || !isValid}
              className="flex w-full justify-center rounded-md border border-transparent bg-[#22333B] py-2 px-4 text-xl font-bold text-white shadow-sm hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-[#8C6D51] focus:ring-offset-2 cursor-pointer"
            >
              {loading || isSubmitting ? "Регистрируем..." : "Зарегистрироваться"}
            </button>
          </div>
        </form>
      </div>
    </article>
  );
};

export default RegistrModal;
