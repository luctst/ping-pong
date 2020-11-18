import React from "react";
import Bg from "../asset/BG-splashScreen.png";
import talkToApi from "../utils/TalkToApi";

export default function Home() {
  const [data, setData] = React.useState([]);

  React.useEffect(function () {
    talkToApi("/player").then(function (res) {
      setData([...res]);
    });
  }, []);

  if (!data.length) {
    return <img src={Bg} alt="Splash Screen" />;
  }

  return (
    <main className="container mt-4">
      <div className="row">
        {data.map(function (playerData, index) {
          return (
            <section
              className={`col-sm-12 ${index ? "border-left" : ""}`}
              key={index}
            >
              <header>
                <h1>{playerData.name}</h1>
              </header>
              <main>
                <ul>
                  {Object.keys(playerData.scores).map(function (player, index) {
                    return (
                      <li key={index}>
                        {player} -{" "}
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
                              ? "text-success"
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
    </main>
  );
}
