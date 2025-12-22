import React from 'react'
import "./VideoHome.scss"

const VideoSetting = () => {
  return (
    <section className='video'>
      <h2>Как пользоваться?</h2>
      
      <div className='video-container'>
        <video 
          src="/video/chrome_hxA6wGESEK.mp4" 
          autoPlay 
          loop 
          muted
          playsInline
        ></video>
      </div>
    </section>
  )
}

export default VideoSetting