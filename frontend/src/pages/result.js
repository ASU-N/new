import Linechart from "../components/Chart";
import './result.css'
import { timeVSVote } from "../data/chart";
import lodash from 'lodash';

export default function result()
{
    return(
        <div className="result-container"> 
        <div className='graph-container'>
            <Linechart/>
        </div>
        <div className="vote-count-container">
                {/* <div className="vote-box">Party A</div>
                <div className="vote-box"> Party B</div>
                <div className="vote-box"> Party C</div>
                <div className="vote-box">Party D</div>
                <div className="vote-box">Party E</div> */}
                {timeVSVote.map((e)=>{
                    return(
                    <div className="vote-box">
                        <h4>Party:{e.name}</h4>
                        <p>{lodash.sum(e.data)}</p>
                    </div>
                    )
                })}
        </div>
        </div>
    )
}