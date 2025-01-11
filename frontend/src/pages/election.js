import './election.css';
import {useState,useEffect} from 'react';
import axios from 'axios';

export default   function Election()
{


    const [candidate,setCandidate]=useState([]);
    const [electionId,setElectionId]=useState();

    const [hours,setHours]=useState(0);
    const [minutes,setMinutes]=useState(0);
    const [seconds,setSeconds]=useState(0);
       
    
    useEffect(()=>{
        const fetchData=async()=>{
            try {
                const response=await axios.get('http://localhost:5000/api/candidates/list');
                const array=response.data;
                // const data=array[0];
                // setCandidate(data.candidate);
                // setElectionId(data.electionId);
                
            } catch (error) {
                console.log(error);

            }
        }

        fetchData();

    },[])


    // function conversion(time)
    // {
    //     setHours( Math.floor(time/(1000*60*60)));   
    //     setMinutes(Math.floor((time/1000/60)%60));
    //     setSeconds(Math.floor(((time/1000)%60)));
    //     const time_stamp=hours+":"+minutes+":"+seconds;
    //     console.log(time);
    //     return time_stamp;

        
    // }

    const clickButton=async(partyName,id)=>{

        const currentTime= new Date();
        const hrs=currentTime.getHours();
        const min=currentTime.getMinutes();
        const sec=currentTime.getSeconds();


        console.log(`${hrs}:${min}:${sec}`);
        

     
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
                        <img src={individual.photo_url} alt="Candidate Profile"/>    
                        </div>    
                        <div className="button-container"><button onClick={()=>{clickButton(individual.party,electionId)}}>Vote Now</button></div>
                    </div>
                )
            })}
    
            
       </div>


    )


}