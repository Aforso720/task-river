import React from "react";
import { useForm } from "react-hook-form";
import useAuthModalStore from "../store/authModal";
import "./AuthModal.scss";
import useRegisterRequest from "../api/registerRequest";

// Проверка сложности пароля
const validatePassword = (password) => {
  const requirements = {
    hasLower: /[a-z]/.test(password),
    hasUpper: /[A-Z]/.test(password),
    hasDigit: /\d/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    minLength: password.length >= 6,
    maxLength: password.length <= 64,
  };

  const isValid = Object.values(requirements).every(Boolean);
  const message = !isValid ? "Пароль не соответствует требованиям" : "";

  return { isValid, requirements, message };
};

const RegistrModal = () => {
  const modalRef = React.useRef(null);

  const {
    modalAuthRegistr,
    closeModalAuthRegistr,
    openModalAuthLogin,
    prefillEmail,
    flowSource,
  } = useAuthModalStore();

  const { registerRequest, loading, error, success, reset } = useRegisterRequest();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting, touchedFields },
    reset: resetForm,
    setValue,
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      password_confirmation: "",
      firstName: "",
      lastName: "",
      middleName: "",
      phoneNumber: "",
      termsAccepted: false,
      roles: ["user"], // По умолчанию обычный пользователь
    },
  });

  const [passwordFocused, setPasswordFocused] = React.useState(false);
  const passwordValue = watch("password");
  const phoneValue = watch("phoneNumber");
  const termsAccepted = watch("termsAccepted");

  // Форматирование телефона
  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length === 0) return "";
    if (numbers.length <= 1) return `+${numbers}`;
    if (numbers.length <= 4) return `+${numbers.slice(0, 1)} ${numbers.slice(1)}`;
    if (numbers.length <= 7) return `+${numbers.slice(0, 1)} ${numbers.slice(1, 4)} ${numbers.slice(4)}`;
    return `+${numbers.slice(0, 1)} ${numbers.slice(1, 4)} ${numbers.slice(4, 7)}-${numbers.slice(7, 9)}-${numbers.slice(9, 11)}`;
  };

  // Обработчик изменения телефона
  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setValue("phoneNumber", formatted, { shouldValidate: true });
  };

  // Проверка пароля
  const passwordValidation = validatePassword(passwordValue);

  // Клик вне модалки — закрыть
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

  // Успех регистрации — закрыть
  React.useEffect(() => {
    if (success && modalAuthRegistr) {
      setTimeout(() => {
        reset();
        resetForm();
        closeModalAuthRegistr();
      }, 2000);
    }
  }, [success, modalAuthRegistr, closeModalAuthRegistr, reset, resetForm]);

  // Автоподстановка email
  React.useEffect(() => {
    if (modalAuthRegistr && prefillEmail) {
      setValue("email", prefillEmail, { shouldValidate: true });
    }
  }, [modalAuthRegistr, prefillEmail, setValue]);

  const onSubmit = async (values) => {
    // Подготавливаем данные для бэкенда
    const payload = {
      ...values,
      phoneNumber: values.phoneNumber.replace(/\D/g, ""), // Убираем форматирование
      middleName: values.middleName || undefined, // Отправляем только если есть
    };
    await registerRequest(payload);
  };

  const onBack = () => {
    if (flowSource === "home") {
      reset();
      resetForm();
      closeModalAuthRegistr();
      return;
    }
    reset();
    resetForm();
    closeModalAuthRegistr();
    openModalAuthLogin();
  };

  if (!modalAuthRegistr) return null;

  return (
    <article className="authModalOverlay flex items-center justify-center">
      <div className="authModal p-10 relative max-h-[90vh] overflow-y-auto" ref={modalRef}>
        <button
          className="absolute top-4 left-4 text-white font-bold text-xl hover:text-[#8C6D51] transition-colors"
          onClick={onBack}
          type="button"
        >
          {"< Назад"}
        </button>

        <img
          src="/LogoHead.svg"
          alt="Логотип сайта"
          className="w-40 h-40 rounded-xl mt-4 mb-3 mx-auto"
        />

        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Регистрация аккаунта
        </h2>

        <form
          className="space-y-6 mx-auto w-[500px] flex flex-col justify-center"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {/* Личная информация */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-white">
                Фамилия *
              </label>
              <input
                id="lastName"
                type="text"
                className={`px-2 py-3 mt-1 block w-full rounded-md border ${
                  errors.lastName ? "border-red-400" : "border-gray-300"
                } shadow-sm focus:border-[#8C6D51] focus:outline-none focus:ring-[#8C6D51] sm:text-sm`}
                {...register("lastName", {
                  required: "Введите фамилию",
                  pattern: {
                    value: /^[А-ЯЁа-яё\s-]+$/,
                    message: "Только кириллица, пробелы и дефисы",
                  },
                })}
              />
              {errors.lastName && (
                <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-white">
                Имя *
              </label>
              <input
                id="firstName"
                type="text"
                className={`px-2 py-3 mt-1 block w-full rounded-md border ${
                  errors.firstName ? "border-red-400" : "border-gray-300"
                } shadow-sm focus:border-[#8C6D51] focus:outline-none focus:ring-[#8C6D51] sm:text-sm`}
                {...register("firstName", {
                  required: "Введите имя",
                  pattern: {
                    value: /^[А-ЯЁа-яё\s-]+$/,
                    message: "Только кириллица, пробелы и дефисы",
                  },
                })}
              />
              {errors.firstName && (
                <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="middleName" className="block text-sm font-medium text-white">
              Отчество
            </label>
            <input
              id="middleName"
              type="text"
              className={`px-2 py-3 mt-1 block w-full rounded-md border ${
                errors.middleName ? "border-red-400" : "border-gray-300"
              } shadow-sm focus:border-[#8C6D51] focus:outline-none focus:ring-[#8C6D51] sm:text-sm`}
              {...register("middleName", {
                pattern: {
                  value: /^[А-ЯЁа-яё\s-]*$/,
                  message: "Только кириллица и пробелы",
                },
              })}
            />
            {errors.middleName && (
              <p className="text-red-400 text-xs mt-1">{errors.middleName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-white">
              Телефон *
            </label>
            <div className="phone-input-container">
              <input
                id="phoneNumber"
                type="tel"
                className={`phone-input px-2 py-3 mt-1 block w-full rounded-md border ${
                  errors.phoneNumber ? "border-red-400" : "border-gray-300"
                } shadow-sm focus:border-[#8C6D51] focus:outline-none focus:ring-[#8C6D51] sm:text-sm`}
                value={phoneValue}
                onChange={handlePhoneChange}
                // placeholder="+7 999 999-99-99"
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-red-400 text-xs mt-1">
                {errors.phoneNumber.message || "Введите корректный номер телефона"}
              </p>
            )}
          </div>

          {/* Учетные данные */}
          <div className="pt-4 border-t border-gray-700">
            <h3 className="text-lg font-medium text-white mb-4">Учетные данные</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-white">
                  Логин *
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
                  Email *
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
                  Пароль *
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
                    validate: {
                      complexity: (value) => validatePassword(value).isValid || "Пароль не соответствует требованиям",
                    },
                  })}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
                
                {/* Подсказки для пароля */}
                {(passwordFocused || touchedFields.password) && (
                  <div className="password-hint mt-2">
                    <ul className="space-y-1">
                      <li>
                        <span className={passwordValidation.requirements.hasLower ? "valid" : "invalid"}>
                          {passwordValidation.requirements.hasLower ? "✓" : "○"}
                        </span>
                        <span>Одна строчная буква (a-z)</span>
                      </li>
                      <li>
                        <span className={passwordValidation.requirements.hasUpper ? "valid" : "invalid"}>
                          {passwordValidation.requirements.hasUpper ? "✓" : "○"}
                        </span>
                        <span>Одна заглавная буква (A-Z)</span>
                      </li>
                      <li>
                        <span className={passwordValidation.requirements.hasDigit ? "valid" : "invalid"}>
                          {passwordValidation.requirements.hasDigit ? "✓" : "○"}
                        </span>
                        <span>Одна цифра (0-9)</span>
                      </li>
                      <li>
                        <span className={passwordValidation.requirements.hasSpecial ? "valid" : "invalid"}>
                          {passwordValidation.requirements.hasSpecial ? "✓" : "○"}
                        </span>
                        <span>Один специальный символ (!@#$%^&* и т.д.)</span>
                      </li>
                      <li>
                        <span className={passwordValidation.requirements.minLength ? "valid" : "invalid"}>
                          {passwordValidation.requirements.minLength ? "✓" : "○"}
                        </span>
                        <span>Минимум 6 символов</span>
                      </li>
                    </ul>
                  </div>
                )}
                
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-white">
                  Повторите пароль *
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
            </div>
          </div>

          {/* Соглашение */}
          <div className="pt-4">
            <div className="flex items-start">
              <input
                id="termsAccepted"
                type="checkbox"
                className="h-4 w-4 mt-1 rounded border-gray-300 text-[#8C6D51] focus:ring-[#8C6D51] focus:ring-offset-0"
                {...register("termsAccepted", {
                  required: "Необходимо принять условия использования",
                })}
              />
              <label htmlFor="termsAccepted" className="ml-2 block text-sm text-white">
                Я принимаю{" "}
                <a href="/terms" className="text-[#8C6D51] hover:underline">
                  условия использования
                </a>{" "}
                и{" "}
                <a href="/privacy" className="text-[#8C6D51] hover:underline">
                  политику конфиденциальности
                </a>{" "}
                *
              </label>
            </div>
            {errors.termsAccepted && (
              <p className="text-red-400 text-xs mt-1">{errors.termsAccepted.message}</p>
            )}
          </div>

          {/* Сообщения об ошибках и успехе */}
          {error && (
            <div className="error-message" role="alert">
              <strong className="font-semibold">Ошибка регистрации:</strong>
              <p className="mt-1">
                {error.includes("уже существует") 
                  ? "Пользователь с такими данными уже существует. Попробуйте другой email или логин."
                  : error.includes("email") || error.includes("Email")
                  ? "Некорректный email адрес. Проверьте правильность ввода."
                  : error.includes("password") || error.includes("Пароль")
                  ? "Пароль не соответствует требованиям безопасности."
                  : "Не удалось зарегистрироваться. Проверьте введенные данные."}
              </p>
            </div>
          )}

          {success && (
            <div className="success-message" role="alert">
              <strong className="font-semibold">Успешно!</strong>
              <p className="mt-1">Регистрация прошла успешно. Модальное окно закроется через 2 секунды.</p>
            </div>
          )}

          {/* Кнопка отправки */}
          <div>
            <button
              type="submit"
              disabled={loading || isSubmitting || !isValid || !termsAccepted}
              className={`flex w-full justify-center rounded-md border border-transparent py-2 px-4 text-xl font-bold text-white shadow-sm hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-[#8C6D51] focus:ring-offset-2 ${
                loading || isSubmitting || !isValid || !termsAccepted
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-[#22333B] cursor-pointer hover:bg-[#1a282f]"
              }`}
            >
              {loading || isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Регистрируем...
                </span>
              ) : (
                "Зарегистрироваться"
              )}
            </button>
            
            <p className="text-sm text-gray-400 mt-2 text-center">
              Уже есть аккаунт?{" "}
              <button
                type="button"
                className="text-[#8C6D51] hover:underline font-medium"
                onClick={() => {
                  reset();
                  resetForm();
                  closeModalAuthRegistr();
                  openModalAuthLogin();
                }}
              >
                Войти
              </button>
            </p>
          </div>
        </form>
      </div>
    </article>
  );
};

export default RegistrModal;