import React from 'react'
import './About.scss'
import InfoPage from '../../shared/UI/InfoPage/InfoPage'
import SliderAbout from '../../widgets/SliderAbout/SliderAbout'

const About = () => {
  return (
    <section className='AboutPage'>
      <InfoPage texth2={'О TaskRiver'} texth3={'Создаем инструмент , который упрощает сложное'}/>
      <SliderAbout/>

      <section className='blocksTextAbout'>
        <h3 className='text-[#22333B] text-5xl font-bold' >Company Values</h3>
        <div className='infoCompanyAbout'>
          <div className='blockFirst'>
            <h4 className='text-3xl font-bold'>Company Qualities</h4>
            <ul>
              <li className='text-xl font-normal'>Advanced task automation capabilities</li>
              <li className='text-xl font-normal'>Real-time collaboration features</li>
              <li className='text-xl font-normal'>Industry-leading security measures</li>
              <li className='text-xl font-normal'>Regular feature updates based on user feedback</li>
              <li className='text-xl font-normal'>Seamless integration with popular tools</li>
            </ul>
          </div>
          <div className='blockTwo'>
            <h4 className='text-3xl font-bold'>Company Founding</h4>
            <p className='text-xl'>Started with a vision to transform team collaboration</p>
            <span className='text-2xl font-bold'>Est. 2020</span>
          </div>
          <div className='blockThree'>
            <h4 className='text-3xl font-bold'>Company Achievements</h4>
            <p className='text-2xl font-bold'>
              50K+
            </p>
            <p className='text-2xl font-bold'>
              1000+
            </p>
          </div>
        </div>
      </section>

       <section className='blocksTextAbout'>
        <h3 className='text-[#22333B] text-5xl font-bold'>Project Team</h3>
        <p className=' my-5 text-[#8B6D51] text-2xl font-normal'>The team keeping the project alive</p>
        <div className='infoTeamAbout'>
          <div className='blockFirst'>
            <img src="image/LogoFoot.png" alt="Фото автора" />
            <ul>
              <li className='text-2xl font-bold'>Deni Smith </li>
              <li className='text-xl font-semibold'>CEO & Founder</li>
              <li className='text-xs font-normal'>Visionary leader with 10+ years in software development</li>
              <li className='text-xs font-normal'>email@taskriver.com   +1 (555) 123-4567</li>
            </ul>
          </div>
          <div className='blockTwo'>
            <h4 className='text-3xl font-bold'>Company Data</h4>
            <ul>
              <li className='text-xl font-normal'>Advanced task automation capabilities</li>
              <li className='text-xl font-normal'>Real-time collaboration features</li>
              <li className='text-xl font-normal'>Industry-leading security measures</li>
            </ul>
          </div>
          <div className='blockThree'>
            <h4 className='text-3xl font-bold'>Partnerships</h4>
            <ul>
              <li className='text-xl font-normal'>Advanced task automation capabilities</li>
              <li className='text-xl font-normal'>Real-time collaboration features</li>
            </ul>
          </div>
        </div>
      </section>
      
    </section>
  )
}

export default About
