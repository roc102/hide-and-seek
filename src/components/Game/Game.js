import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../Home/Home.css";

import cheeseImage from "../../media/cheese2.png";
import piggyBankImage from "../../media/piggybank.png";
import bombImage from "../../media/bomb2.png";
import jerryImage from "../../media/jerry.png";
import openImage from "../../media/open.png";
import coinsImage from "../../media/coins.png";
import emptyImage from "../../media/empty.png";
import closedImage from "../../media/closed.png";
import restartImage from "../../media/restart.webp";
import movesImage from "../../media/moves.webp";
import winningImage1 from "../../media/youwon.webp";
import losingImage1 from "../../media/youlost.png";
import bgImage1 from "../../media/tngbg2.webp";
import bgImage2 from "../../media/ringsbg.webp";
import bgImage3 from "../../media/piggybankbg.webp";
import sound1Audio from "../../media/sound3.ogg";
import giftFoundAudio from "../../media/giftfound.mp3";
import giftMissedAudio from "../../media/giftmissed.mp3";
import gameLoseAudio from "../../media/losingsound.mp3";
import gameWinAudio from "../../media/winningsound.mp3";

const Game = () => {
  const [movecount, setMovecount] = useState(0);
  const [score, setScore] = useState(0);
  const [gridSize, setGridSize] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState(1);
  const [found, setFound] = useState(0);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [z, setZ] = useState(0);
  const [b, setB] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [foundGifts, setFoundGifts] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [clickedImages, setClickedImages] = useState([]);
  const [isBackgroundReady, setBackgroundReady] = useState(false);

  // Get the selected difficulty and theme from the URL parameters and initialize game settings
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedDifficulty = urlParams.get("difficulty");
    const selectedThemeFromUrl = urlParams.get("theme");

    setMovecount(0);
    const gridSizeValue = parseInt(selectedDifficulty) + 2;
    setGridSize(gridSizeValue);

    setSelectedTheme(parseInt(selectedThemeFromUrl));

    // Generate random values for x, y, z, and b within the range of available gifts
    const totalGifts = gridSizeValue * gridSizeValue;
    const availableGifts = Array.from(
      { length: totalGifts },
      (_, index) => index + 1
    );

    const getRandomValue = () => {
      const randomIndex = Math.floor(Math.random() * availableGifts.length);
      const randomValue = availableGifts.splice(randomIndex, 1)[0];
      return randomValue;
    };

    setX(getRandomValue());
    setY(getRandomValue());
    setZ(getRandomValue());
    setB(getRandomValue());
  }, []);

  // Update background image based on the selected theme
  useEffect(() => {
    const bgElement = document.getElementById("bg2");
    if (selectedTheme === 1) {
      bgElement.style.backgroundImage = `url(${bgImage1})`;
    } else if (selectedTheme === 2) {
      bgElement.style.backgroundImage = `url(${bgImage2})`;
    } else if (selectedTheme === 3) {
      bgElement.style.backgroundImage = `url(${bgImage3})`;
    }
    setBackgroundReady(true);
  }, [selectedTheme]);

  // Code to hide the results section when the component mounts
  useEffect(() => {
    setShowResults(false);
  }, []);

  // Restart the game
  useEffect(() => {
    const restartButton = document.getElementById("re1");
    restartButton.addEventListener("click", restart);

    return () => {
      restartButton.removeEventListener("click", restart);
    };
  }, []);

  const restart = () => {
    window.location.reload();
  };

  const navigate = useNavigate();

  function goback() {
    navigate("/");
  }

  //for creating loop in table and fitting image and sound in them
  const generateTable = () => {
    const table = [];
    console.log([gridSize]);
    for (let t = 0; t < gridSize; t++) {
      const row = [];
      for (let i = 0; i < gridSize; i++) {
        const number = t * gridSize + i + 1;
        let imageSrc = "";
        if (selectedTheme === 1) {
          imageSrc = cheeseImage;
        } else if (selectedTheme === 2) {
          imageSrc = closedImage;
        } else if (selectedTheme === 3) {
          imageSrc = piggyBankImage;
        }
        row.push(
          <td key={number}>
            <img
              className="images"
              id={number}
              src={imageSrc}
              alt=""
              style={{ width: "100px", height: "100px", opacity: 0.75 }}
              onClick={clicked}
              onMouseOver={sound1}
              onMouseOut={opback}
            />
          </td>
        );
      }
      table.push(<tr key={t}>{row}</tr>);
    }
    return <tbody>{table}</tbody>;
  };

  //opacity chaning functions
  const opchange = (e) => {
    e.target.style.opacity = 1;
  };

  const opback = (e) => {
    e.target.style.opacity = 0.75;
  };

  const opstop = (no) => {
    const clickedImage = document.getElementById(no.toString());
    clickedImage.removeEventListener("mouseover", opchange);
    clickedImage.removeEventListener("mouseout", opback);
  };

  //for checking if the clicked image has gift
  const clicked = (e) => {
    if (gameEnded || found === 3) return; // Ignore click if game has ended or all gifts found
    const clickedId = parseInt(e.target.id);

    if (foundGifts.includes(clickedId) || clickedImages.includes(clickedId)) {
      return;
    }
    setMovecount((prevMovecount) => prevMovecount + 1);

    if (clickedId === b) {
      e.target.src = bombImage;
      endofthegame();
      document.getElementById("gamelose").play();
      setTimeout(losing, 2000);
    } else if (clickedId === x || clickedId === y || clickedId === z) {
      opstop(clickedId);
      if (foundGifts.includes(clickedId)) {
        return;
      } else {
        // New gift found
        giftfound(clickedId);
        setFound((prevFound) => prevFound + 1);
        setFoundGifts((prevGifts) => [...prevGifts, clickedId]);
        setScore((prevScore) => prevScore + 1000);
        if (found + 1 === 3) {
          endofthegame();
          document.getElementById("gamewin").play();
          setTimeout(() => {
            winning();
          }, 2000);
        }
      }
    } else {
      giftmissed(clickedId);
      setScore((prevScore) => prevScore - 100);
    }
    setClickedImages((prevClickedImages) => [...prevClickedImages, clickedId]);
  };

  //for changing the image after clicked
  const giftfound = (no) => {
    if (selectedTheme === 1) {
      document.getElementById(no).src = jerryImage;
    } else if (selectedTheme === 2) {
      document.getElementById(no).src = openImage;
    } else if (selectedTheme === 3) {
      document.getElementById(no).src = coinsImage;
    }

    document.getElementById("giftfound").play();
  };

  const giftmissed = (no) => {
    if (selectedTheme === 1) {
      document.getElementById(no).style.visibility = "hidden";
    } else if (selectedTheme === 2) {
      document.getElementById(no).src = emptyImage;
    } else if (selectedTheme === 3) {
      document.getElementById(no).style.visibility = "hidden";
    }

    document.getElementById("giftmissed").play();
  };

  const winning = () => {
    try {
      document.getElementById("final").style.display = "block";
      document.getElementById("bg2").style.filter = "blur(8px)";
      document.getElementById("bg2").style.opacity = "o.7";
      document.getElementById("yeimg").src = winningImage1;
    } catch (error) {
      console.error("An error occurred during winning logic:", error);
    }
  };

  const losing = () => {
    try {
      document.getElementById("final").style.display = "block";
      document.getElementById("bg2").style.filter = "blur(8px)";
      document.getElementById("bg2").style.opacity = "o.7";
      document.getElementById("yeimg").src = losingImage1;
    } catch (error) {
      console.error("An error occurred during losing logic:", error);
    }
  };

  const sound1 = () => {
    try {
      const audioElement = document.getElementById("sound1");
      const playPromise = audioElement.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Audio playback started successfully
            console.log("Audio playback started.");
          })
          .catch((error) => {
            console.error("An error occurred during audio playback:", error);
          });
      }
    } catch (error) {
      console.error("An error occurred in sound1():", error);
    }
  };

  // to stop clicking after 3 gifts found
  const endofthegame = () => {
    const images = document.getElementsByClassName("images");
    for (let i = 0; i < images.length; i++) {
      images[i].removeEventListener("click", clicked);
    }
    setGameEnded(true); // Set gameEnded to true to disable further clicks
  };

  return (
    <div id="wonorlost">
      <div
        className="bg"
        id="bg2"
        style={{ visibility: isBackgroundReady ? "visible" : "hidden" }}
      >
        <div id="restart" align="center">
          <img className="lowertext" src={restartImage} alt="" />
        </div>
        <table align="center" id="ekdoteen">
          {generateTable()}
        </table>
        <div id="lower" align="center">
          <img className="lowertext" src={movesImage} alt="" />
          <h1 id="moves">{movecount}</h1>
        </div>

        <audio id="sound1">
          <source src={sound1Audio} type="audio/mpeg" />
        </audio>
        <audio id="giftfound">
          <source src={giftFoundAudio} type="audio/mpeg" />
        </audio>
        <audio id="giftmissed">
          <source src={giftMissedAudio} type="audio/mpeg" />
        </audio>
        <audio id="gamelose">
          <source src={gameLoseAudio} type="audio/mpeg" />
        </audio>
        <audio id="gamewin">
          <source src={gameWinAudio} type="audio/mpeg" />
        </audio>
      </div>
      <div
        id="final"
        align="center"
        style={{ display: showResults ? "block" : "none", cursor: "pointer" }}
      >
        <img id="yeimg" src={winningImage1} alt="" />
        <h1 id="h1">Score: {score}</h1>
        <div id="outernew">
          <div className="re" id="re1">
            Restart
          </div>
          <Link
            to="/"
            className="re"
            id="re2"
            onClick={goback}
            style={{ textDecoration: "none" }}
          >
            Start New
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Game;
