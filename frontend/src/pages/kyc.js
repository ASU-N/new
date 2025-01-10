
import '../css/styles.css';
import {useState,useEffect} from 'react';
import axios from 'axios';


function Kyc(){   
   
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
        // <div>
        //     <div className="content">
        //         <h2>Manifesto</h2>

        //         <div className=''>
        //             {candidate.map((candidate, index) => (
        //                 <div className='candidate-card'>
        //                     <div className='candidate-info'>
        //                         <div className='candidate-name'>{candidate.name}, {candidate.age} years old</div>
        //                         <p>  <strong>Party: </strong> {candidate.party}</p>
        //                         <p> <strong>Status: </strong> {candidate.status} </p>
        //                         <p> <strong>Education: </strong> {candidate.education}</p>

        //                         <div className="promises-section">
        //                             <h3>My Promises to You</h3>
        //                             {/* <ol>
        //                                 {candidate.promises.map((promise, index) => (
        //                                     <li key={index}>
        //                                         <p>{promise.title}</p>
        //                                         <ul>
        //                                             {promise.points.map((point, idx) => (
        //                                                 <li key={idx}>{point}</li>
        //                                             ))}
        //                                         </ul>
        //                                     </li>
        //                                 ))}
        //                             </ol> */}
        //                     </div>
        //                     </div>
        //                     <div className='candidate-image'>
        //                         <img src={candidate.imageUrl} alt="Candidate" className="candidate-image" />
        //                     </div>
        //                 </div>
                        
        //             ))}
        //         </div>
        //     </div>
        // </div>
        <div>Election Page</div>
    );
}

export default Kyc;