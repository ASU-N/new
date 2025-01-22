
import '../css/styles.css';
import {useState,useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Kyc(){   
   
    const [candidate,setCandidate]=useState([]);
      const navigate = useNavigate();

       
    
    useEffect(()=>{
        const fetchData=async()=>{
            try {
                const response=await axios.get('http://localhost:5000/api/candidates/list');

                   
                const data=await response.data;
                const id=sessionStorage.getItem('electionId')
                const correct_data=data[id];
                    
                    // setElectionId(correct_data.electionId);
                    setCandidate(correct_data.candidate);

                
                
            } catch (error) {
                console.log(error);
                alert('Error occurred while loading Candidates');

            }
        }

        fetchData();

    },[])
       
const votingId=sessionStorage.getItem('votingId');
if(votingId)
{
    return(
        <div>
            <div className="content">
                <h2>Manifesto</h2>

                <div className=''>
                    {candidate.map((candidate, index) => (
                        <div className='candidate-card'>
                            <div className='candidate-info'>
                                <div className='candidate-name'>{candidate.name}, {candidate.age} years old</div>
                                <p>  <strong>Party: </strong> {candidate.party}</p>
                                <p> <strong>Status: </strong> {candidate.status} </p>
                                <p> <strong>Education: </strong> {candidate.education}</p>

                                <div className="promises-section">
                                    <h3>My Promises to You</h3>
                                    {/* <ol>
                                        {candidate.promises.map((promise, index) => (
                                            <li key={index}>
                                                <p>{promise.title}</p>
                                                <ul>
                                                    {promise.points.map((point, idx) => (
                                                        <li key={idx}>{point}</li>
                                                    ))}
                                                </ul>
                                            </li>
                                        ))}
                                    </ol> */}
                                    <p>{candidate.manifesto}</p>
                            </div>
                            </div>
                            <div className='candidate-image'>
                                <img src={candidate.photo_url} alt="Candidate" className="candidate-image" />
                            </div>
                        </div>
                        
                    ))}
                </div>
            </div>
        </div>
        
    );
    
}

else
{
    window.alert("VotingId has expired. You have to Login again.");
    navigate('/'); 
}
   

}

export default Kyc;