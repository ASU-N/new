//  function Kyc()
// {
//     return(
//         <h1>It is Kyc Page</h1>
//     )
// }
import '../css/styles.css';
// import Navbar from './components/navbar';
import candidates from '../data/candidate';


function Kyc(){   
    return(
        <div>
            {/* <Navbar/> */}
            <div className="content">
                <h2>Manifesto</h2>

                <div className=''>
                    {/* This is array of candidates */}
                    {candidates.map((candidate, index) => (
                        <div className='candidate-card'>
                            <div className='candidate-info'>
                                <div className='candidate-name'>{candidate.name}, {candidate.age} years old</div>
                                <p>  <strong>Party: </strong> {candidate.party}</p>
                                <p> <strong>Status: </strong> {candidate.status} </p>
                                <p> <strong>Education: </strong> {candidate.education}</p>

                                <div className="promises-section">
                                    <h3>My Promises to You</h3>
                                    <ol>
                                        {candidate.promises.map((promise, index) => (
                                            <li key={index}>
                                                <p>{promise.title}</p>
                                                <ul>
                                                    {promise.points.map((point, idx) => (
                                                        <li key={idx}>{point}</li>
                                                    ))}
                                                </ul>
                                            </li>
                                        ))}
                                    </ol>
                            </div>
                            </div>
                            <div className='candidate-image'>
                                <img src={candidate.imageUrl} alt="Candidate" className="candidate-image" />
                            </div>
                        </div>
                        
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Kyc;