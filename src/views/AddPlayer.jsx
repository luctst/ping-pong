import React from 'react';
import { Redirect } from 'react-router-dom';
import'../AddPlayer.css';
import Loader from '../components/Loader';
import talkToApi from '../utils/TalkToApi';

export default function AddPlayer () {
    const input = React.useRef(null);
    const [redirectAfterCallApi, setRedirect] = React.useState(false);
    const [submitApi, setSubmitApi] = React.useState(false);
    const [errorApi, setErrorApi] = React.useState('');
    const [btnDisabled, setBtnDisabled] = React.useState(true);

    function check(e) {
        if (e.target.value.length === 0) {
            if (btnDisabled) return;
            return setBtnDisabled(true)
        }

        return setBtnDisabled(false);
    }

    async function submit(e) {
        e.preventDefault();
        setSubmitApi(true);

        const res = await talkToApi('/player/add/player', 'post', {
            body: {
                playerName: input.current.value
            }
        });

        if (res.error) {
            setSubmitApi(false);
            return setErrorApi(res.message);
        }
        
        return setRedirect(true);
    }

    if (redirectAfterCallApi) return <Redirect to='/'/>
    if (submitApi) return <Loader />;

    return (
        <>
            <header className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <h1 className="text-center h1">Ajouter un player</h1>
                    </div>
                </div>
            </header>
            <form className="container-fluid" onSubmit={submit}>
                <div className="form-group">
                    <label>Joueur</label>
                    <input type="text" className="form-control" onChange={check} ref={input}/>
                    {
                        errorApi.length !== 0 && <small className="text-danger">{errorApi}</small>
                    }
                </div>
                <div className="form-group">
                    <button className="btn btn_send" disabled={btnDisabled}>Valider</button>
                </div>
            </form>
        </>
    );
}