import './election.css';
import {useState,useEffect} from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';



export default   function Election()
{

    const Navigate=useNavigate();
    const [candidate,setCandidate]=useState([]);
    const [electionId,setElectionId]=useState();
    

    
    useEffect(()=>{
        const fetchData=async()=>{
            try {
                const response=await axios.get('http://localhost:5000/api/candidates/list');
                console.log(response);

                    const data=await response.data;
                    console.log(data);

                   const id=sessionStorage.getItem('electionId')
                    const correct_data=data[id];
                    
                    // const correct_data=data[decryptedId];
                    
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
                    const secretKey='anujacodes'
                    const encryptedId=sessionStorage.getItem('votingId');
                    console.log(encryptedId);

                    const bytes = CryptoJS.AES.decrypt(encryptedId, secretKey);
                    // console.log(bytes);
                    const decryptedId=bytes.toString(CryptoJS.enc.Utf8);
                    console.log('Encryted Id',decryptedId)

        const json={timeStamp:currentTime.toISOString(),partyName:partyName, electionId:id, voter_id:decryptedId}
        console.log(json);

        const response=await fetch('http://localhost:5000/api/check_vote_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(json)
        });

        const response_data=await response.json();
        console.log(response_data);

        console.log(response_data);
        if(response.status===400)
        {
            alert(response_data.error);
            Navigate('/home');
        }
        else
        {
            alert(response_data.message);
            Navigate('/home');
        }
        

    
    }

   
    const votingId=sessionStorage.getItem('votingId')
    if(votingId)
    {
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

  else
  {
    window.alert("VotingId has expired. You have to Login again.");
    Navigate('/'); 
  }
    


}