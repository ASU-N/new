import { useParams } from "react-router-dom"
import axios from 'axios'
import Linechart from '../components/chart.js';
import { useNavigate } from "react-router";

export default  function Result()
{
    const navigate=useNavigate();
    const params=useParams();
    const electionId=params.electionId;

    const allPastElection=fetch('http://localhost:5000/PastElection', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    
    const CallAllPastElection=async ()=>{
        
        <div className="button_column">
            {allPastElection.map((individual)=>
            {<button  className="ElectionType" onClick={navigate(`/home/result/${individual.electionId}`)}>{individual.electionName}</button>}
            )}
        </div>
    }


    if(electionId)
    {
       const electionArray=allPastElection.filter((individual)=>individual.electionId===electionId)
       
       
        return(
            <>
            <CallAllPastElection/>
            <Linechart electionData={electionArray} id={electionId} />
            </>
        )
    }
    
    else{
        return(
            <>
            <CallAllPastElection/>
            <div className="linechart-varied">
            {allPastElection.map((individual)=>{
                <Linechart electionData={individual.candidates} id={individual.electionId}/>
            })}
            </div>
            </>
        )
    }


    
}