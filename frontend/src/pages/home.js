import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./home.css";

var endTime=null,startTime=null;



const changeTime=(date,time)=>{

const get_date=new Date(date+'T00:00:00');
const ms_date=get_date.getTime();
const [hours,minutes,seconds]=time.split(":").map(Number);
const ms_Time=(hours*3600000)+(minutes*60000)+(seconds*1000);
const total_ms=ms_Time+ms_date;
const changed_time=new Date(total_ms);
return changed_time;

}


const ElectionCard = ({ election, type }) => {

  const navigate = useNavigate();

const end =changeTime(election.end_date,election.end_time);
const start=changeTime(election.start_date,election.start_time);




const handleClickOnGoing = async (data) => {
  
    localStorage.setItem('endTime',end);
    localStorage.setItem('startTime',start);
  
  
  
  try {

    const Json_input={
      candidate:data.candidates,
      electionName:data.name,
      electionId:data.id

    }


    const response=await fetch('http://localhost:5000/api/candidates/list', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(Json_input)
    });

    if(!response.ok){
      console.log(response);
      alert('Error occur on fetching');
    }
    else
    {
      sessionStorage.setItem("electionId", data.id);
       navigate('/election');
    }


   } catch (error){
    alert(error.message)
   }

   


};

  return (
    <div className={`election-card ${type}`}>
      <h3>{election.name}</h3>
      <p>
        {type === "ongoing" ? (
          <>Ends In {end.toString()}</>
        ) : type === "upcoming" ? (
          <>Start In {start.toString()} </>
        ) : (
          <>Started In {start.toString()} | Ended In {end.toString()}</>
        )}
      </p>

      
      {type === "ongoing" && (
        <>
          <button className="vote-now" onClick={()=>{
            handleClickOnGoing(election);
            startTime=start;
            endTime=end;
              
          }}>
            Vote Now
          </button>
        </>
      )}
      {type === "past" && (
        <>
          <p>Winner: {election.winner}</p>
          {/* <a href={} target="_blank" rel="noreferrer">
            View Results
          </a> */}

          <Link to={`/home/result/${election.id}`}>View Result</Link>
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
      // console.log(data);
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

  // console.log()

  // return (
    
  //   <div className="home">
  //     <h1>Election Dashboard</h1>
  //     {isLoading ? (
  //       <p>Loading elections...</p>
  //     ) : error ? (
  //       <p className="error-message">{error}</p>
  //     ) : (
  //       <div className="sections-container">
  //       <div className="section_ongoing">
  //                   <section className="home_section">
  //                   <h2>Ongoing Elections</h2>
  //                   {elections.ongoing.length > 0 ? (
  //                     elections.ongoing.map((election) => (
  //                       <ElectionCard key={election.id} election={election} type="ongoing"  />
  //                     ))
  //                   ) : (
  //                     <p>No ongoing elections at the moment.</p>
  //                   )}
  //                 </section>
  //       </div>

  //          <div className="upcoming_past">
  //             <section className="home_section">
  //                       <h2>Upcoming Elections</h2>
  //                       {elections.upcoming.length > 0 ? (
  //                         elections.upcoming.map((election) => (
  //                           <ElectionCard key={election.id} election={election} type="upcoming" />
  //                         ))
  //                       ) : (
  //                         <p>No upcoming elections at the moment.</p>
  //                       )}
  //             </section>

  //         <section className="home_section">
  //           <h2>Past Elections</h2>
  //           {elections.past.length > 0 ? (
  //             elections.past.map((election) => (
  //               <ElectionCard key={election.id} election={election} type="past" />
  //             ))
  //           ) : (
  //             <p>No past elections available.</p>
  //           )}
  //         </section>  
  //         </div>   
  //       </div>
  //     )}
  //   </div>
  // );

  return(
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

