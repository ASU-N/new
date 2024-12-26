import {Link} from 'react-router-dom';
import './RootLayout.css';
import votingImage from '../assets/login.png';
import {useState,useEffect} from 'react';
import Logout from '../pages/logout';



export default function RootLayout(){
    
    const [votingId,setVotingId]=useState('');
    
//    useEffect(({target})=>{
//         setVotingId(target.value);
//    },[votingInput]);

   const handleSubmission=(event)=>{

    event.preventDefault();

    console.log(votingId);        

   }




    return (
        <div>
            <div className='login-container'>
                <div className="container">
                    <div className="image-section">
                        <img src={votingImage} alt="Voting Illustration" />
                    </div>
                    <form className="form-section" >
                        <h2>Enter Your Voting ID</h2>
                        <input type="text" placeholder="Enter your ID here" value={votingId} onChange={({target})=>{setVotingId(target.value)}} />
                        <div className="button-container">
                            <button onClick={handleSubmission}>Continue</button>
                        </div>
                    </form>
                
                </div>
            </div>
        
        </div>
      );
}
