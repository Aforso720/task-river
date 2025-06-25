import React from "react";
import "../app/App.scss";
import { Routes, Route } from "react-router";
import Header from "../widgets/Header";
import Footer from "../widgets/Footer";
import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Tariffs from "../pages/Tariffs/Tariffs";
import Updates from "../pages/Updates/Updates";
import Panel from "../pages/Panel/Panel";

function App() {
  
  let userActive = true;
  
  return (
    <div className="App flex justify-between flex-col items-center">
      {userActive ? (
        <Routes>
          <Route path="/panel/*" element={<Panel />} />
        </Routes>
      ) : ( 
        <>
          <Header />
          <main className="flex justify-center items-center">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/tariffs" element={<Tariffs />} />
              <Route path="/education" element={null} />
              <Route path="/updates" element={<Updates />} />
            </Routes>
          </main>
          <Footer />
        </>
      )}
      {/* <Routes>
        <Route path="/хлеб" element={<div className="w-full h-full flex m-auto justify-center text-5xl text-[#22333B]">Не найдена такая страница</div>}/>
      </Routes> */}
    </div>
  );
};

export default App;
