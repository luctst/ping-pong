import React from "react";
import Bg from "../asset/BG-splashScreen.png";
import chevron from "../asset/Chevron.png";
import pingpong from "../asset/LaBalleDuPingPong.png";
import talkToApi from "../utils/TalkToApi";
import "../reset.css";
import "../index.css";
import { Link } from "react-router-dom";

export default function Home() {
  const [data, setData] = React.useState([]);
  const [showPlayerScore, setPlayerScore] = React.useState(false);
  const [playercoreIndex, setPlayerScoreIndex] = React.useState(0);

  React.useEffect(function () {
    talkToApi("/player").then(function (res) {
      setData([...res]);
    });
  }, []);

  function showScores(i) {
    if (playercoreIndex === i) {
      if (!showPlayerScore) {
        setPlayerScore(true);
        return setPlayerScoreIndex(i);
      }

      setPlayerScore(false);
      return setPlayerScoreIndex(i);
    }

    setPlayerScore(i);
    setPlayerScoreIndex(!playercoreIndex);
  }

  if (!data.length) {
    return <img src={Bg} alt="Splash Screen" />;
  }

  return (
    <main className="container">
      <div className="row">
        {data.map(function (playerData, index) {
          return (
            <section className={"col-sm-12"} key={index}>
              <header className="LiName" onClick={() => showScores(index)}>
                <h1 className="h1">{playerData.name}</h1>
                <div className="LiNameChevron">
                  <p className="p2"></p>
                  <div className="contentChevron">
                    <img src={chevron} alt="Chevron" />
                  </div>
                </div>
              </header>
              <main>
                <ul className="contentScore">
                  {Object.keys(playerData.scores).map(function (
                    player,
                    iindex
                  ) {
                    return (
                      <li key={iindex}>
                        <p className="p1">{player} - </p>
                        <span
                          className={
                            playerData.scores[player].loose >
                              playerData.scores[player].win
                              ? "text-danger"
                              : ""
                          }
                        >
                          {playerData.scores[player].loose}
                        </span>
                          /
                        <span
                          className={
                            playerData.scores[player].loose <
                              playerData.scores[player].win
                              ? "text-success p1-1"
                              : ""
                          }
                        >
                          {playerData.scores[player].win}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </main>
            </section>
          );
        })}
      </div>
      <div className="row">
        <div id="AddMatch">
          <Link to={{ pathname: "/add", state: [...data] }}>
            <img src={pingpong} alt="ping-pong balle" />
          </Link>
        </div>
      </div>
    </main>
  );
}
