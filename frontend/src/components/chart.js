

import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts'; 
import ChartDB from '../data/chart.js';
import './chart.css';
import lodash from 'lodash';

function Linechart({ partyNames, electionId, electionData, electionName }) {
    const [timeVSVote, setTimeVSVote] = useState([]);
    const [timeStamp, setTimeStamp] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (partyNames.length === 0) {
                    setLoading(false);
                    return; 
                }

                const { timeVSVote, timeStamp } = await ChartDB(partyNames, electionId, electionData);
                console.log('Timestamp for', electionId, timeStamp);
                console.log('TimeVsVote', electionId, timeVSVote);

                setTimeVSVote(timeVSVote);
                setTimeStamp(timeStamp);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err); // Handle error
            } finally {
                setLoading(false); // Set loading to false regardless of success or failure
            }
        };

        fetchData();
    }, [partyNames, electionId, electionData]); 

    if (loading) {
        return <div>Loading...</div>; 
    }

    if (error) {
        return <div>Error occurred: {error.message}</div>; 
    }

    if (timeStamp.length === 0 || timeVSVote.length === 0) {
        return <div>No data available for {electionName}.</div>;
    }

    return (
        <React.Fragment>
            <div className='graph'>
                <Chart
                    className="line-chart"
                    type='line'
                    width={1200}
                    height={420}
                    series={timeVSVote}
                    // margin={ top:10, bottom:30, left:10, right:10  }
                    options={{
                        title: { text: electionName },
                        xaxis: {
                            title: { text: "Time of Voting" },
                            categories: timeStamp,
                            offsetY:0
                        },
                        yaxis: {
                            title: { text: "Votes" },
                            offsetX:0
                        },
                        stroke: {
                            width: 3,
                            curve: 'smooth',
                        },
                        grid: {
                            padding: {
                                top: 10,
                                bottom: 25,
                                left: 75,
                                right: 5,
                            },
                        },
                        chart: {
                            selection: {
                                enabled: false,
                            },
                            margin:{
                                top:10,
                                bottom:30,
                                left:10,
                                right:10
                            }
                        },
                        legend: {
                            position: 'right',
                        },
                    }}
                />
                <div className='vote_column'>
                    {console.log(timeVSVote)}
                {timeVSVote.map((individual)=>{                    
                   return(
                     <section className="individual-section">
                        <h3>{individual.name}</h3>
                        <p>{lodash.sum(individual.data)}</p>
                    </section>
                   )
                })}
            </div>
            </div>
           
        </React.Fragment>
    );
}

export default Linechart;









