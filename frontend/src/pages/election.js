import './election.css';
import {useState,useEffect} from 'react';
import axios from 'axios';

export default   function Election()
{


    const [candidate,setCandidate]=useState([]);
    const [electionId,setElectionId]=useState();
    const[electionName,setElectinName]=useState();    
    
    useEffect(()=>{
        const fetchData=async()=>{
            try {
                const response=await axios.get('http://localhost:5000/api/candidates/list');
                const array=response.data;
                const data=array[0];
                setCandidate(data.candidate);
                setElectionId(data.electionId);
                setElectinName(data.electionName);
                
            } catch (error) {
                console.log(error);

            }
        }

        fetchData();

    },[])

    const clickButton=(partyName,id)=>{
       console.log('To Send',partyName,id); 
    }

   
    return(
       <div className="votingSection">
            {candidate.map((individual)=>{
                
                return(
                    <div className="vote">
                        <div className="info">
                        <div className="text">
                            <p>Name:{individual.name}</p>
                            <p>Party:{individual.party}</p>
                        </div>
                        <img src="" alt="Candidate Profile"/>    
                        </div>    
                        <div className="button-container"><button onClick={()=>{clickButton(individual.party,electionId)}}>Vote Now</button></div>
                    </div>
                )
            })}
    
            
       </div>


    )


}