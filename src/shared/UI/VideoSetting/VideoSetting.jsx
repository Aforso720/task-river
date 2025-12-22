import React from 'react'
import "./VideoHome.scss"

const VideoSetting = () => {
  return (
    <section className='video flex flex-col justify-center items-center gap-5 
    w-full
    sm:h-[424px] sm:px-5
    md:h-[624px] md:px-5
    lg:h-[724px]
    xl:h-[824px]
    '>
        <h2>Как пользоваться?</h2>
        {/* <img src="image/HomePagePhoto.png" alt="Временное фото" /> */}
        <video src="/video/chrome_nHCQGeUbgp.mp4" autoPlay loop className='
        w-full
        sm:h-[224px] 
        md:h-[324px] 
        lg:h-[424px]
        xl:h-[524px]
        '></video>
    </section>
  )
}

export default VideoSetting
