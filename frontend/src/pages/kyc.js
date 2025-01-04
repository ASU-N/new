import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './kyc.css';

const KycPage = () => {
  const { electionId } = useParams();
  const [electionData, setElectionData] = useState(null);
  const [remainingHours, setRemainingHours] = useState('');
  const [remainingMinutes, setRemainingMinutes] = useState('');
  const [remainingSeconds, setRemainingSeconds] = useState('');

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/election/${electionId}/candidates`)
      .then((response) => response.json())
      .then((data) => {
        setElectionData(data);
        calculateRemainingTime(data);
      })
      .catch((error) => console.error('Error fetching election data:', error));
  }, [electionId]);

  const calculateRemainingTime = (data) => {
    const endDate = new Date(`${data.end_date}T${data.end_time}`);
    const currentTime = new Date();
    const timeDifference = endDate - currentTime;

    if (timeDifference <= 0) {
      setRemainingHours('0');
      setRemainingMinutes('0');
      setRemainingSeconds('0');
      return;
    }

    const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
    const seconds = Math.floor((timeDifference / 1000) % 60);

    setRemainingHours(hours);
    setRemainingMinutes(minutes);
    setRemainingSeconds(seconds);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (electionData) {
        calculateRemainingTime(electionData);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [electionData]);

  return (
    <div className="kyc-container">
      <h2>Election: {electionData ? electionData.election_name : 'Loading...'}</h2>

      <div className="content">
        <div className="left-side">
          {electionData ? (
            <div>
              {electionData.candidates.map((candidate) => (
                <div key={candidate.id} className="candidate-card">
                  <div className="candidate-info">
                    <h3>{candidate.name}</h3>
                    <p>{candidate.age} years old</p>
                    <p>Status: {candidate.status || 'No status'}</p>
                    <p>Education: {candidate.education || 'No education info'}</p>
                    <p>My Promises to You: {candidate.manifesto}</p>
                    <button>Vote</button>
                  </div>
                  <div className="candidate-image">
                    <img src={candidate.photo_url || "https://via.placeholder.com/150"} alt={candidate.name} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Loading candidates...</p>
          )}
        </div>
        <div className="right-side">
          <div className="timer-container">
            <div className="ends">
          <h3>Ends in:</h3>
          </div>
            <div className="time-block">
              <p className="time-value">{remainingHours}</p>
              <p className="time-label">Hours</p>
            </div>
            <div className="time-block">
              <p className="time-value">{remainingMinutes}</p>
              <p className="time-label">Minutes</p>
            </div>
            <div className="time-block">
              <p className="time-value">{remainingSeconds}</p>
              <p className="time-label">Seconds</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KycPage;
