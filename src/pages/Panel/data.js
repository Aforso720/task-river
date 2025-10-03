export const data = {
  projects: [
    {
      id: "project-1",
      title: "CRM Система",
      icon: "IconProject.png",
      boardIds: ["board-1", "board-2", "board-3"]
    },
    {
      id: "project-2",
      title: "HR Платформа",
      icon: "IconWorld.png",
      boardIds: ["board-4", "board-5", "board-6"]
    },
    {
      id: "project-3",
      title: "E-commerce Магазин",
      icon: "IconBurger.png",
      boardIds: ["board-7", "board-8", "board-9"]
    },
    {
      id: "project-4",
      title: "Сайт для агентства",
      icon: "IconFinger.png",
      boardIds: ["board-10", "board-11", "board-12"]
    }
  ],

  boards: [
    // Из проекта CRM
    {
      id: "board-1",
      title: "Разработка",
      icon: "IconProject.png",
      projectId: "project-1",
      taskIds: ["task-1", "task-2", "task-3", "task-4", "task-5", "task-6"]
    },
    {
      id: "board-2",
      title: "Тестирование",
      icon: "IconProject.png",
      projectId: "project-1",
      taskIds: ["task-7", "task-8", "task-9", "task-10"]
    },
    {
      id: "board-3",
      title: "Документация",
      icon: "IconProject.png",
      projectId: "project-1",
      taskIds: ["task-11", "task-12"]
    },

    // Из проекта HR
    {
      id: "board-4",
      title: "Onboarding",
      icon: "IconWorld.png",
      projectId: "project-2",
      taskIds: ["task-13", "task-14", "task-15"]
    },
    {
      id: "board-5",
      title: "Карьера",
      icon: "IconWorld.png",
      projectId: "project-2",
      taskIds: ["task-16", "task-17", "task-18"]
    },
    {
      id: "board-6",
      title: "Оценка",
      icon: "IconWorld.png",
      projectId: "project-2",
      taskIds: ["task-19", "task-20"]
    },

    // Из проекта E-commerce
    {
      id: "board-7",
      title: "Каталог",
      icon: "IconBurger.png",
      projectId: "project-3",
      taskIds: ["task-21", "task-22", "task-23", "task-24"]
    },
    {
      id: "board-8",
      title: "Корзина и Оплата",
      icon: "IconBurger.png",
      projectId: "project-3",
      taskIds: ["task-25", "task-26", "task-27"]
    },
    {
      id: "board-9",
      title: "Доставка",
      icon: "IconBurger.png",
      projectId: "project-3",
      taskIds: ["task-28", "task-29"]
    },

    // Из проекта Агентства
    {
      id: "board-10",
      title: "Лендинг",
      icon: "IconFinger.png",
      projectId: "project-4",
      taskIds: ["task-30", "task-31", "task-32"]
    },
    {
      id: "board-11",
      title: "Контактная форма",
      icon: "IconFinger.png",
      projectId: "project-4",
      taskIds: ["task-33", "task-34", "task-35"]
    },
    {
      id: "board-12",
      title: "Портфолио",
      icon: "IconFinger.png",
      projectId: "project-4",
      taskIds: ["task-36", "task-37"]
    },

    // 📌 Независимая доска (не в проекте)
    {
      id: "board-13",
      title: "Личные задачи",
      icon: "IconProject.png",
      projectId: null,
      taskIds: ["task-38", "task-39"]
    }
  ],

  tasks: [
    // CRM
    { id: "task-1", title: "Настроить роутинг", icon: "IconProject.png", boardId: "board-1" },
    { id: "task-2", title: "Сверстать логин-страницу", icon: "IconProject.png", boardId: "board-1" },
    { id: "task-3", title: "Подключить Redux Toolkit", icon: "IconProject.png", boardId: "board-1" },
    { id: "task-4", title: "Создать страницу профиля", icon: "IconProject.png", boardId: "board-1" },
    { id: "task-5", title: "Реализовать поиск по клиентам", icon: "IconProject.png", boardId: "board-1" },
    { id: "task-6", title: "Интеграция с почтовым сервисом", icon: "IconProject.png", boardId: "board-1" },
    { id: "task-7", title: "Покрыть тестами формы", icon: "IconProject.png", boardId: "board-2" },
    { id: "task-8", title: "Проверить валидации", icon: "IconProject.png", boardId: "board-2" },
    { id: "task-9", title: "Тест login/logout", icon: "IconProject.png", boardId: "board-2" },
    { id: "task-10", title: "Проверить производительность", icon: "IconProject.png", boardId: "board-2" },
    { id: "task-11", title: "Написать API документацию", icon: "IconProject.png", boardId: "board-3" },
    { id: "task-12", title: "Создать руководство пользователя", icon: "IconProject.png", boardId: "board-3" },

    // HR и остальные – по аналогии...

    // 📌 Задачи из независимой доски
    { id: "task-38", title: "Прочитать книгу", icon: "IconPersonal.png", boardId: "board-13" },
    { id: "task-39", title: "Позвонить маме", icon: "IconPersonal.png", boardId: "board-13" },

    // 📌 Задачи вне досок и проектов (сами по себе)
    { id: "task-40", title: "Сходить в зал", icon: "IconProject.png", boardId: null },
    { id: "task-41", title: "Посмотреть туториал по Zustand", icon: "IconProject.png", boardId: null }
  ]
};
