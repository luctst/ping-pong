/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Redirect } from "react-router-dom";
import Loader from "../components/Loader";
import talkToApi from "../utils/TalkToApi";
import "../addGame.css";

export default function AddGame(props) {
  const player1 = React.useRef(null);
  const player2 = React.useRef(null);
  const score1 = React.useRef(null);
  const score2 = React.useRef(null);
  const [state, setState] = React.useState({
    player1: "",
    player2: "",
    score: "",
    apiPassed: false,
    submitApi: false,
    errorMessage: "",
  });

  React.useEffect(function () {
    if (props.location.state) {
      return setState({
        ...state,
        player1: player1.current.value,
        player2: player2.current.value,
        score: `${score1.current.value}-${score2.current.value}`,
        btnDisabled: true
      });
    }
  }, []);

  function populateData(e) {
    const newState = {...state};

    if (
      player1.current.value.length !== 0 &&
      player2.current.value.length !== 0 &&
      score1.current.value.length !== 0 &&
      score2.current.value.length !== 0
    ) {
      newState.btnDisabled = false
    } else {
      newState.btnDisabled = true;
    }

    if (e.target.id === "player1" || e.target.id === 'player2') {
      newState[e.target.id] = e.target.value;
      return setState(newState);
    }

    if (e.target.id === 'score_joueur1' || e.target.id === 'score_joueur2') {
      newState.score = `${score1.current.value}-${score2.current.value}`;
      return setState(newState);
    }
  }

  async function submitGame(e) {
    e.preventDefault();
    setState({
      ...state,
      submitApi: true,
    });

    const body = {
      players: {},
      score: state.score,
    };

    props.location.state.forEach(function (player) {
      if (player.name === state.player1)
        return (body.players.winner = player._id);
      if (player.name === state.player2)
        return (body.players.looser = player._id);
    });

    const res = await talkToApi("/player/add", "post", {
      body,
    });

    if (res.error) {
      return setState({
        ...state,
        submitApi: false,
        errorMessage: res.message,
      });
    }

    return setState({
      ...state,
      apiPassed: true,
    });
  }

  if (state.apiPassed) return <Redirect to="/" />;
  if (state.submitApi) return <Loader />;

  return (
    <>
      <section className="container-fluid">
        <div className="row">
          <div className="col-12">
            <h4 className="text-center">Ajouter un match</h4>
          </div>
        </div>
      </section>
      <form className="container mt-4" onSubmit={submitGame}>
        <section className="row">
          {state.errorMessage.length > 0 && (
            <small className="text-danger">{state.errorMessage}</small>
          )}
          <div className="col-12 form-group">
            <label className="p1">Player 1</label>
            <select
              className="form-control"
              id="player1"
              onChange={populateData}
              ref={player1}
            >
              {props.location.state.map(function (i, y) {
                return (
                  <option key={y} className="p1">
                    {i.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="col-12 form-group">
            <label className="p1">Player 2</label>
            <select
              className="form-control"
              id="player2"
              onChange={populateData}
              ref={player2}
            >
              {props.location.state.map(function (i, y) {
                return (
                  <option key={y} className="p1">
                    {i.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="col-12 form-group input_score">
            <input
              type="number"
              id="score_joueur1"
              name="Score Joueur 1"
              placeholder="Score J1"
              min="0"
              max="100"
              ref={score1}
              onChange={populateData}
            />
            <input
              type="number"
              id="score_joueur2"
              name="Score Joueur 2"
              placeholder="Score J2"
              min="0"
              max="100"
              ref={score2}
              onChange={populateData}
            />
          </div>
          <button className="btn btn-success btn_send" type="submit" disabled={state.btnDisabled}>
            Valider
          </button>
        </section>
      </form>
    </>
  );
}
