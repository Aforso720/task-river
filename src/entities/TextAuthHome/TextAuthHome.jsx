import React from "react";
import useAuthModalStore from "@/features/Auth/store/authModal";

const TextAuthHome = () => {
  const { openModalAuthRegistr } = useAuthModalStore();
  const [email, setEmail] = React.useState("");

  const openRegister = () => {
    openModalAuthRegistr({
      prefillEmail: email.trim(),
      source: "home",
    });
  };

  const openModalRegistr = () => {
    openRegister();
    setEmail("");
  };

  return (
    <section className="textAuthHome flex flex-col justify-between items-center">
      <h3 className="text-5xl align-top">
        <b>Здесь</b> будет текст
      </h3>

      <div className="footTextAuthHome gap-2">
        <p className="text-1xl">Рабочий электронный адрес</p>
        <input
          className="px-3 text-2xl"
          type="email"
          placeholder="you@mail.ru"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className="text-1x1">
          Находите коллег и разделяйте работу и личную жизнь благодаря рабочему
          адресу электронной почты.
        </p>

        <button className="text-2xl" onClick={openModalRegistr}>
          Регистрация
        </button>
      </div>
    </section>
  );
};

export default TextAuthHome;
