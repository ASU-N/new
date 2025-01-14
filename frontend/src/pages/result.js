import { useParams } from "react-router-dom"

export default function Result()
{
    const params=useParams();
    const electionId=params.electionId;

    const DisplayResult=(eId)=>{
        
    }
    
    
    
    const CallAllPastElection=async ()=>{
        const electionArray=await fetch('http://localhost:5000/PastElection', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        });
        
        <div className="button_column">
            {electionArray.map((individual)=>{
                <button  className="ElectionType" onClick={()=>{DisplayResult(individual.id)}}>{individual.name}</button>
            })}
        </div>
    }


    if(!electionId)
    {
        
        return(
            <h1>Election With Empty Params</h1>
        )
    }

    else{
            console.log(electionId);
           return( <h1> Election with Params</h1>)
    }



    
}