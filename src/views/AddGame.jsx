import React from "react";
import { Redirect } from "react-router-dom";
import Loader from "../components/Loader";
import talkToApi from "../utils/TalkToApi";

export default function AddGame(props) {
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
        player1: props.location.state[0].name,
      });
    }
  }, []);

  function populateData(e) {
    if (e.target.id === "player1") {
      return setState({
        ...state,
        player1: e.target.value,
      });
    }

    if (e.target.id === "player2") {
      return setState({
        ...state,
        player2: e.target.value,
      });
    }

    setState({
      ...state,
      score: e.target.value,
    });
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
    <form className="container" onSubmit={submitGame}>
      <section className="row">
        {state.errorMessage.length > 0 && (
          <small className="text-danger">{state.errorMessage}</small>
        )}
        <div className="col-12 form-group">
          <label>Player 1</label>
          <select className="form-control" id="player1" onChange={populateData}>
            {props.location.state.map(function (i, y) {
              return <option key={y}>{i.name}</option>;
            })}
          </select>
        </div>
        <div className="col-12 form-group">
          <label>Player 1</label>
          <select className="form-control" id="player2" onChange={populateData}>
            {props.location.state.map(function (i, y) {
              return <option key={y}>{i.name}</option>;
            })}
          </select>
        </div>
        <div className="col-12 form-group">
          <label>Score - sous ce format 'player1Score-player2Score'</label>
          <input type="text" className="form-control" onChange={populateData} />
        </div>
        <button className="btn btn-success" type="submit">
          Valider
        </button>
      </section>
    </form>
  );
}
