import React, { useEffect, useState } from 'react';
import './home.css';

export default function Home() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch candidate data from the Flask backend
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/candidates')
      .then((response) => response.json())
      .then((data) => {
        setCandidates(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setError('Failed to load candidates.');
        setLoading(false);
      });
  }, []);

  const handleVote = (candidateId) => {
    fetch('http://127.0.0.1:5000/api/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ candidate_id: candidateId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Vote counted") {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Failed to count vote. Please try again.');
      });
  };

  return (
    <div className="votingSection">
      {loading ? (
        <p>Loading candidates...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        candidates.map((candidate) => (
          <div className="vote" key={candidate.id}>
            <div className="info">
              <div className="text">
                <p>Name: {candidate.name}</p>
                <p>Party: {candidate.party}</p>
              </div>
              <img src={candidate.photo_url || ''} alt="Candidate Profile" className="candidate-photo" />
            </div>
            <button className="vote-button" onClick={() => handleVote(candidate.id)}>Vote Now</button>
          </div>
        ))
      )}
    </div>
  );
}
