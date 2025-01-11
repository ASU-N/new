import './election.css';
import {useState,useEffect} from 'react';
import axios from 'axios';
// import { useLocation } from 'react-router-dom';

export default   function Election()
{

    const [candidate,setCandidate]=useState([]);
    const [electionId,setElectionId]=useState();


    // const location=useLocation();
    // console.log('Election Id after Clicking',location.state);
       
    
    useEffect(()=>{
        const fetchData=async()=>{
            try {
                const response=await axios.get('http://localhost:5000/api/candidates/list');

                    const data=await response.data;
                    const id=sessionStorage.getItem('electionId')
                    const correct_data=data[id];
                    
                    setElectionId(correct_data.electionId);
                    setCandidate(correct_data.candidate);

                
                
            } catch (error) {
                console.log(error);
                alert('Error occurred while loading Candidates');

            }
        }

        fetchData();

    },[])



    const clickButton=async(partyName,id)=>{

        const currentTime= new Date();

        const json={timeStamp:currentTime.toISOString(),partyName, electionId:id}
        console.log(json);
        

    
    }

   
    return(
       <div className="votingSection">
            {candidate.map((individual)=>{
                console.log(individual);
                return(
                    <div className="vote">
                        <div className="info">
                        <div className="text">
                            <p>Name:{individual.name}</p>
                            <p>Party:{individual.party}</p>
                        </div>
                        <img src={individual.photo_url} alt="Candidate Profile"/>    
                        </div>    
                        <div className="button-container"><button onClick={()=>{clickButton(individual.party,electionId)}}>Vote Now</button></div>
                    </div>
                )
            })}
    
            
       </div>


    )


}