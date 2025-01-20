import { useParams } from "react-router-dom";
import Linechart from '../components/chart.js';
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import './result.css'

export default function Result() {
    const navigate = useNavigate();
    const params = useParams();
    const electionId = params.electionId;
    const [allPastElection, setAllPastElection] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            // console.log(response.json());
            // console.log(response.data);
            const data = await response.json();
            // console.log(data);
            setAllPastElection(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchPastElections();
    }, []);

    if (loading) return <div>Loading...</div>;
    
    if (error) return <div>Error fetching past elections: {error.message}</div>;

    // Function to render buttons for all past elections
    const CallAllPastElection = () => (
        <div className="option_column">
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

    const electionArray = electionId ? allPastElection.filter(individual => individual.electionId === electionId) : [];
    // console.log(electionArray);

    return (
        <div className="result-page">
            <CallAllPastElection />
            <div className="linechart-varied">
                {(electionId ? electionArray : allPastElection).map((individual) => {
                   
                    return(<Linechart key={individual.electionId} partyNames={individual.party_names} electionId={individual.electionId} electionData={individual} electionName={individual.electionName}/>)
                })}
            </div>
        </div>
    );
}
