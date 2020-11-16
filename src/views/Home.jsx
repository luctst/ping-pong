import React from 'react';
import Loader from '../components/Loader';

export default function Home () {
    const [dataFetched, setDataFetched] = React.useState(false);
    const [data, setData] = React.useState([
        {
            playerName: 'Thomas'
        },
        {
            playerName: 'Antoine'
        },
        {
            playerName: 'Léo'
        },
        {
            playerName: 'Lucas'
        }
    ]);

    React.useEffect(function () {
        setDataFetched(!dataFetched);
    }, []);

    if  (!dataFetched) {
        return  <Loader />;
    }

    return (
        <main className="container mt-4">
            <div className="row">
                {
                    data.map(function (playerData, index) {
                        return (
                            <section className={`col-3 ${index ? 'border-left' : ''}`} key={index}>
                                <header>
                                    <h1>{playerData.playerName}</h1>
                                </header>
                                <hr/>
                            </section>
                        );
                    })
                }
            </div>
        </main>
    );
} 