import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

const ElectionCard = ({ election, type }) => {
  const navigate = useNavigate();
  const [remainingTime, setRemainingTime] = useState("");

  useEffect(() => {
    const calculateRemainingTime = () => {
      const endTime = new Date(election.end_datetime);
      const currentTime = new Date();
      const remainingSeconds = Math.max((endTime - currentTime) / 1000, 0);
      const hours = Math.floor(remainingSeconds / 3600);
      const minutes = Math.floor((remainingSeconds % 3600) / 60);
      const seconds = Math.floor(remainingSeconds % 60);
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

  
    setRemainingTime(calculateRemainingTime());

  
    const interval = setInterval(() => {
      setRemainingTime(calculateRemainingTime());
    }, 1000);

    
    return () => clearInterval(interval);
  }, [election.end_datetime]);

  const handleKYCClick = () => {
    navigate(`/home/kyc/${election.id}`);
  };

  return (
    <div className={`election-card ${type}`}>
      <h3>{election.name}</h3>
      <p>
        Starts: {new Date(election.start_datetime).toLocaleString()} | Ends:{" "}
        {new Date(election.end_datetime).toLocaleString()}
      </p>
      {type === "ongoing" && (
        <>
          <p>Time Remaining: {remainingTime}</p>
          <button className="vote-now" onClick={handleKYCClick}>
            Vote Now
          </button>
        </>
      )}
      {type === "upcoming" && (
        <button className="details-here" onClick={handleKYCClick}>
          Details Here
        </button>
      )}
      {type === "past" && (
        <>
          <p>Winner: {election.winner}</p>
          <a href={election.result_link} target="_blank" rel="noreferrer">
            View Results
          </a>
        </>
      )}
    </div>
  );
};

const Home = () => {
  const [elections, setElections] = useState({
    ongoing: [],
    past: [],
    upcoming: [],
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchElections = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/elections");
      if (!response.ok) {
        throw new Error("Failed to fetch elections");
      }
      const data = await response.json();
      if (data.ongoing && data.past && data.upcoming) {
        setElections(data);
      } else {
        setError("Invalid response structure");
      }
    } catch (error) {
      setError("Error fetching elections: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  return (
    <div className="home">
      <h1>Election Dashboard</h1>
      {isLoading ? (
        <p>Loading elections...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="sections-container">
          <section>
            <h2>Ongoing Elections</h2>
            {elections.ongoing.length > 0 ? (
              elections.ongoing.map((election) => (
                <ElectionCard key={election.id} election={election} type="ongoing" />
              ))
            ) : (
              <p>No ongoing elections at the moment.</p>
            )}
          </section>

          <section>
            <h2>Upcoming Elections</h2>
            {elections.upcoming.length > 0 ? (
              elections.upcoming.map((election) => (
                <ElectionCard key={election.id} election={election} type="upcoming" />
              ))
            ) : (
              <p>No upcoming elections at the moment.</p>
            )}
          </section>

          <section>
            <h2>Past Elections</h2>
            {elections.past.length > 0 ? (
              elections.past.map((election) => (
                <ElectionCard key={election.id} election={election} type="past" />
              ))
            ) : (
              <p>No past elections available.</p>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default Home;
