import React, { useEffect, useState } from 'react';
import './candidates.css';

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Fetch candidates data
    fetch('/api/candidates')
      .then(response => response.json())
      .then(data => {
        setCandidates(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching candidates:', error);
        setError(true);
        setLoading(false);
      });
  }, []);

  const handleVote = (candidateId) => {
    // Handle voting logic (POST request to backend)
    fetch('/api/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ candidate_id: candidateId }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Vote counted') {
          console.log(`Voted for candidate with ID: ${candidateId}`);
          // You can update the state or UI here to reflect the vote
        } else {
          console.log('Vote failed:', data.message);
        }
      })
      .catch(error => console.error('Error voting:', error));
  };

  const handleManifesto = (candidateId) => {
    // Redirect to a detailed manifesto page or open modal
    console.log(`Viewing manifesto for candidate with ID: ${candidateId}`);
    // You could navigate to a new page or show a modal here
  };

  if (loading) return <div className="loading">Loading candidates...</div>;
  if (error) return <div className="error">Failed to load candidates.</div>;

  return (
    <div className="candidates-container">
      <h2>Candidates</h2>
      <div className="candidates-list">
        {candidates.map(candidate => (
          <div key={candidate.id} className="candidate-card">
            <p>{candidate.name}</p>
            <button onClick={() => handleVote(candidate.id)} className="vote-button">Vote</button>
            <button onClick={() => handleManifesto(candidate.id)} className="manifesto-button">Manifesto</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Candidates;
