import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "tachyons";
import "./Home.css";
import titleImage from "../../media/title.webp";
import playImage from "../../media/play.webp";
import leftImage from "../../media/left.webp";
import rightImage from "../../media/right.webp";
import easyImage from "../../media/easy.webp";
import normalImage from "../../media/normal.webp";
import hardImage from "../../media/hard.webp";
import cheeseImage from "../../media/cheese.webp";
import ringsImage from "../../media/rings.webp";
import bankImage from "../../media/bank.webp";
import bankbg from "../../media/piggybankbg.png";
import ringsbg from "../../media/ringsbg.png";
import cheesebg from "../../media/tngbg2.png";
import bgImage from "../../media/earthfromspace.webp";

const Home = () => {
  const [currentDifficulty, setCurrentDifficulty] = useState(1);
  const [currentTheme, setCurrentTheme] = useState(1);

  const navigate = useNavigate();

  const loadit = () => {
    const diffElement = document.getElementById("diff");
    const themeElement = document.getElementById("theme");
    const menubtnimagesarr = document.getElementsByClassName("menubtnimages");

    // Hide the difficulty and theme buttons
    diffElement.style.display = "none";
    themeElement.style.display = "none";

    // Hide all the arrow buttons
    for (let a = 0; a < menubtnimagesarr.length; a++) {
      menubtnimagesarr[a].style.display = "none";
    }

    const playElement = document.getElementById("play");

    const selectedDifficulty = currentDifficulty;
    const selectedTheme = currentTheme; // Get the selected theme

    // Store the selected theme in localStorage
    localStorage.setItem("selectedDifficulty", selectedDifficulty);
    localStorage.setItem("selectedTheme", selectedTheme);

    // Animate the play element
    playElement.animate(
      {
        top: "0px",
        left: "0px",
        height: "100%",
        width: "100%",
        borderRadius: "0px",
        margin: "0px",
      },
      1000
    );

    setTimeout(() => {
      navigate(`/play?difficulty=${selectedDifficulty}&theme=${selectedTheme}`); // Navigate to the '/play' route after the animation
    }, 1000);
  };

  const handleL1Click = () => {
    if (currentDifficulty === 1) {
      setCurrentDifficulty(2);
    } else if (currentDifficulty === 2) {
      setCurrentDifficulty(3);
    } else if (currentDifficulty === 3) {
      setCurrentDifficulty(1);
    }
  };

  const handleR1Click = () => {
    if (currentDifficulty === 1) {
      setCurrentDifficulty(3);
    } else if (currentDifficulty === 2) {
      setCurrentDifficulty(1);
    } else if (currentDifficulty === 3) {
      setCurrentDifficulty(2);
    }
  };

  const handleL2Click = () => {
    if (currentTheme === 1) {
      setCurrentTheme(3);
    } else if (currentTheme === 2 || currentTheme === 3) {
      setCurrentTheme(currentTheme - 1);
    }
    cpbb();
  };

  const handleR2Click = () => {
    if (currentTheme === 3) {
      setCurrentTheme(1);
      document.getElementById("i2").src = arrofi2[currentTheme - 1];
    } else if (currentTheme === 1 || currentTheme === 2) {
      setCurrentTheme(currentTheme + 1);
      document.getElementById("i2").src = arrofi2[currentTheme - 1];
    }
    cpbb();
  };

  const cpbb = () => {
    const playElement = document.getElementById("play");
    if (currentTheme === 1) {
      playElement.style.backgroundImage = `url(${bankbg})`;
    } else if (currentTheme === 2) {
      playElement.style.backgroundImage = `url(${cheesebg})`;
    } else if (currentTheme === 3) {
      playElement.style.backgroundImage = `url(${ringsbg})`;
    }
  };

  const arrofi1 = [easyImage, normalImage, hardImage];
  const arrofi2 = [cheeseImage, ringsImage, bankImage];

  return (
    <div
      className="bg bg-center cover min-vh-100 min-vw-100"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <img src={titleImage} id="title" alt="" />
      <div
        id="play"
        className="lowerbuttons"
        onClick={loadit}
        style={{ backgroundImage: `url(${cheesebg})` }}
      >
        <img src={playImage} className="menubtnimages" alt="not working" />
      </div>
      <div id="diff" className="lowerbuttons" onClick={handleL1Click}>
        <img src={leftImage} id="l1" className="small" alt="not working" />
        <img
          src={arrofi1[currentDifficulty - 1]}
          id="i1"
          className="menubtnimages"
          alt="not working"
        />
        <img src={rightImage} id="r1" className="small" alt="not working" />
      </div>
      <div id="theme" className="lowerbuttons" onClick={handleL2Click}>
        <img src={leftImage} id="l2" className="small" alt="not working" />
        <img
          src={arrofi2[currentTheme - 1]}
          id="i2"
          className="menubtnimages"
          alt="not working"
        />
        <img src={rightImage} id="r2" className="small" alt="not working" />
      </div>
    </div>
  );
};

export default Home;
