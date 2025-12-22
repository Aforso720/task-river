import React from 'react';
import { Helmet } from 'react-helmet-async';
import './About.scss';
import InfoPage from '../../shared/UI/InfoPage/InfoPage';
import SliderAbout from '../../widgets/SliderAbout/SliderAbout';
import VideoSetting from '@/shared/UI/VideoSetting/VideoSetting';

const About = () => {
  return (
    <section className='AboutPage'>
      <Helmet>
        <title>О TaskRiver — команда и ценности</title>
        <meta
          name="description"
          content="TaskRiver — сервис для управления задачами и проектами. Узнайте больше о наших ценностях, команде и подходе к созданию удобных инструментов для работы."
        />
      </Helmet>

      <InfoPage
        texth2={'О TaskRiver'}
        texth3={'Создаём понятный инструмент для сложных процессов'}
      />

      <SliderAbout  />

      {/* Блок про ценности и продукт */}
      <section className='blocksTextAbout'>
        <h3 className='text-[#22333B] text-5xl font-bold'>Ценности TaskRiver</h3>
        <div className='infoCompanyAbout'>
          <div className='blockFirst'>
            <h4 className='text-3xl font-bold'>Что отличает TaskRiver</h4>
            <ul>
              <li className='text-xl font-normal'>
                Простой и наглядный интерфейс для работы с задачами и проектами
              </li>
              <li className='text-xl font-normal'>
                Канбан-доски, которые помогают видеть весь процесс от идеи до результата
              </li>
              <li className='text-xl font-normal'>
                Фокус на реальных сценариях: учебные проекты, команды и личные задачи
              </li>
              <li className='text-xl font-normal'>
                Постепенное развитие сервиса на основе обратной связи пользователей
              </li>
              <li className='text-xl font-normal'>
                Внимание к деталям интерфейса: скелетоны, адаптивность, аккуратный дизайн
              </li>
            </ul>
          </div>

          <div className='blockTwo'>
            <h4 className='text-3xl font-bold'>Как появился проект</h4>
            <p className='text-xl'>
              TaskRiver вырос из идеи сделать учебный и рабочий инструмент,
              который ощущается как современный продукт: без лишней сложности,
              с понятной структурой и удобной панелью управления.
            </p>
            <span className='text-2xl font-bold'>Проект развивается с 2024 года</span>
          </div>

          <div className='blockThree'>
            <h4 className='text-3xl font-bold'>TaskRiver в цифрах</h4>
            <p className='text-2xl font-bold'>
              50+ досок
              <span className='block text-base font-normal'>
                для проектов, задач и учебных кейсов
              </span>
            </p>
            <p className='text-2xl font-bold'>
              1000+ задач
              <span className='block text-base font-normal'>
                прошли через карточки и колонки TaskRiver
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Блок про команду и формат проекта */}
      <section className='blocksTextAbout'>
        <h3 className='text-[#22333B] text-5xl font-bold'>Команда проекта</h3>
        <p className='my-5 text-[#8B6D51] text-2xl font-normal'>
          Небольшая команда разработчиков и дизайнеров, которая шаг за шагом развивает TaskRiver.
        </p>

        <div className='infoTeamAbout'>
          <div className='blockFirst'>
            <img src="image/LogoFoot.png" alt="Логотип проекта" />
            <ul>
              <li className='text-2xl font-bold'>Команда TaskRiver</li>
              <li className='text-xl font-semibold'>Дизайн, продукт и разработка</li>
              <li className='text-xs font-normal'>
                Работаем над тем, чтобы управление задачами было понятным и приятным даже тем,
                кто только знакомится с IT-инструментами.
              </li>
              <li className='text-xs font-normal'>
                По вопросам и предложениям — свяжитесь с нами через форму обратной связи внутри сервиса.
              </li>
            </ul>
          </div>

          <div className='blockTwo'>
            <h4 className='text-3xl font-bold'>Как мы строим продукт</h4>
            <ul>
              <li className='text-xl font-normal'>
                Сначала — понятная логика: проекты, доски, задачи, статусы и роли
              </li>
              <li className='text-xl font-normal'>
                Затем — аккуратная реализация: плавные состояния, скелетоны и адаптив
              </li>
              <li className='text-xl font-normal'>
                И только потом — расширение возможностей: тарифы, статьи, мероприятия, админ-панель
              </li>
            </ul>
          </div>

          <div className='blockThree'>
            <h4 className='text-3xl font-bold'>Для кого TaskRiver</h4>
            <ul>
              <li className='text-xl font-normal'>
                Небольшие команды и студии, которым важна прозрачность задач
              </li>
              <li className='text-xl font-normal'>
                Студенты и начинающие разработчики, которые хотят почувствовать работу с реальным инструментом
              </li>
              <li className='text-xl font-normal'>
                Личные проекты, пет-проекты и эксперименты с организацией своего времени
              </li>
            </ul>
          </div>
        </div>
      </section>
    </section>
  );
};

export default About;
