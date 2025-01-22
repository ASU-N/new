import { useParams ,Link} from "react-router-dom";
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
    const [selectedElection, setSelectedElection] = useState(electionId); 
    console.log(params);

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
            console.log('Respnse data',data);
            setAllPastElection(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPastElections();
    }, [electionId]);

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
            <Link
            to={`/home/result`} 
            className={`ElectionType ${!electionId ? 'active' : ''}`}
            onClick={() => setSelectedElection(null)}
            >
            All
        </Link>
            {allPastElection.map((individual) => (
            <Link
                key={individual.electionId}
                to={`/home/result/${individual.electionId}`} 
                className={`ElectionType ${selectedElection === individual.electionId ? 'active' : ''}`} 
                onClick={() => setSelectedElection(individual.electionId)} 
            >{individual.electionName}</Link>
            ))}
        </div>
    );

    console.log(electionId);
    console.log('All Past Elections',allPastElection);
    const electionArray = electionId ? allPastElection.filter(individual => String(individual.electionId) === String(electionId)) : [];


    console.log('ElectionArray',electionArray);

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
