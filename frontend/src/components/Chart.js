import React from 'react';
import Chart from 'react-apexcharts'
import {timeStamp,timeVSVote}from '../data/chart';

console.log(timeVSVote);
console.log(timeStamp);

function Linechart(){
        
    return(
        <React.Fragment>
          <div className='graph'>
                {/* <h2>Line Chart Using Apex-Chart using React</h2> */}
                <Chart 
                type='line' 
                width={1000} 
                height={420}
                series={timeVSVote}
                options={{
                        title:{text:"Onlilne Voting-2024"},
                        xaxis:{
                            title:{text:"Time of Voting"},
                            categories:timeStamp
                        },
                        yaxis:{
                            title:{text:"Votes"}
                        },
                        stroke: {
                            width: 3, 
                            curve: 'smooth' 
                        },
                        grid: {
                            padding: {
                                top: 5,
                                bottom:10,
                                left:30,
                                right:5
                            }
                        },
                        chart: {
                        selection: {
                            enabled: false
                        }
                        },
                        legend:{
                            position:'right'
                        }
                        }}

                >
                </Chart>
          </div>
        </React.Fragment>
    )
};

export default Linechart;