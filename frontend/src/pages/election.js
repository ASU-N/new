import './election.css';
import {useState,useEffect} from 'react';
import axios from 'axios';

export default   function Election()
{


    const [candidate,setCandidate]=useState([]);    
    
    useEffect(()=>{
        const fetchData=async()=>{
            try {
                const response=await axios.get('http://localhost:5000/api/candidates/list');
                console.log(response.data);
                setCandidate(response.data);
                // console.log('Canidate',candidate);
            } catch (error) {
                console.log(error);

            }
        }

        fetchData();

    },[])

   
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
                        <div className="button-container"><button>Vote Now</button></div>
                    </div>
                )
            })}
    
            
       </div>


    )


}