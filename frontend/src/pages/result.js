import { useParams } from "react-router-dom";
import Linechart from '../components/chart.js';
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import './result.css';


export default function Result() {
    const navigate = useNavigate();
    const params = useParams();
    const electionId = params.electionId;
    const [allPastElection, setAllPastElection] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedElection, setSelectedElection] = useState(electionId); // Track active tab

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

    useEffect(() => {
        fetchPastElections();
    }, []);

    useEffect(() => {
        if (electionId) {
            const targetSection = document.getElementById(electionId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [electionId]);

    if (loading) return <div>Loading...</div>;

    if (error) return <div>Error fetching past elections: {error.message}</div>;

    const CallAllPastElection = () => (
        <div className="option_column">
            {allPastElection.map((individual) => (
                <a
                    key={individual.electionId}
                    href={`#${individual.electionId}`}
                    className={`ElectionType ${selectedElection === individual.electionId ? 'active' : ''}`} 
                    onClick={() => setSelectedElection(individual.electionId)}
                >
                    {individual.electionName}
                </a>
            ))}
        </div>
    );

    const electionArray = electionId ? allPastElection.filter(individual => individual.electionId === electionId) : [];

    return (
        <div className="result-page">
            <CallAllPastElection />
            <div className="linechart-varied">
                {(electionId ? electionArray : allPastElection).map((individual) => (
                    <div id={individual.electionId} key={individual.electionId}>
                        <Linechart
                            partyNames={individual.party_names}
                            electionId={individual.electionId}
                            electionData={individual}
                            electionName={individual.electionName}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
