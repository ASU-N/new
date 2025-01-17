// import { useParams } from "react-router-dom"
// import axios, { all } from 'axios'
// import Linechart from '../components/chart.js';
// import { useNavigate } from "react-router";

// export default  function Result()
// {
//     const navigate=useNavigate();
//     const params=useParams();
//     const electionId=params.electionId;

//     const response=fetch('http://localhost:5000/PastElection', {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     });
//     const allPastElection=response.data;
//     console.log(allPastElection);
    
//     const CallAllPastElection=async ()=>{
        
//         <div className="button_column">
//             {allPastElection.map((individual)=>
//             {<button  className="ElectionType" onClick={navigate(`/home/result/${individual.electionId}`)}>{individual.electionName}</button>}
//             )}
//         </div>
//     }


//     if(electionId)
//     {
//        const electionArray=allPastElection.filter((individual)=>individual.electionId===electionId)
       
       
//         return(
//             <>
//             <CallAllPastElection/>
//             <Linechart electionData={electionArray.party_names} id={electionId} />
//             </>
//         )
//     }
    
//     else{
//         return(
//             <>
//             <CallAllPastElection/>
//             <div className="linechart-varied">
//             {allPastElection.map((individual)=>{
//                 <Linechart electionData={individual.party_names} id={individual.electionId}/>
//             })}
//             </div>
//             </>
//         )
//     }


    
// }

import { useParams } from "react-router-dom";
import Linechart from '../components/chart.js';
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

export default function Result() {
    const navigate = useNavigate();
    const params = useParams();
    const electionId = params.electionId;
    const [allPastElection, setAllPastElection] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch past elections data
    const fetchPastElections = async () => {
        try {
            const response = await fetch('http://localhost:5000/PastElection', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setAllPastElection(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // Use effect to fetch data on component mount
    useEffect(() => {
        fetchPastElections();
    }, []);

    // Handle loading state
    if (loading) return <div>Loading...</div>;
    
    // Handle error state
    if (error) return <div>Error fetching past elections: {error.message}</div>;

    // Function to render buttons for all past elections
    const CallAllPastElection = () => (
        <div className="button_column">
            {allPastElection.map((individual) => (
                <button 
                    key={individual.electionId} 
                    className="ElectionType" 
                    onClick={() => navigate(`/home/result/${individual.electionId}`)}
                >
                    {individual.electionName}
                </button>
            ))}
        </div>
    );

    // Filter election based on electionId
    const electionArray = electionId ? allPastElection.filter(individual => individual.electionId === electionId) : [];

    return (
        <>
            <CallAllPastElection />
            <div className="linechart-varied">
                {(electionId ? electionArray : allPastElection).map((individual) => (
                    <Linechart key={individual.electionId} electionData={individual.party_names} id={individual.electionId}  data={individual}/>
                ))}
            </div>
        </>
    );
}
