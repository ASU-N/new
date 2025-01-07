import './election.css';
import { useLocation } from 'react-router-dom';

export default function Election()
{
   const location=useLocation();
   const data=location.state;

   console.log(data);

   console.log('Election Data'+data);

   const candidate=data.candidates;
   console.log(candidate);
   
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