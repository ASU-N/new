import { NavLink, Outlet } from 'react-router-dom';
import logo from '../assets/logo.png';
import './ElectionLayout.css';
import {useState,useEffect} from 'react';
import {startTime,endTime} from '../pages/home';

export default function ElectionLayout() {
    
    const [hours,setHours]=useState(0);
    const [minutes,setMinutes]=useState(0);
    const [seconds,setSeconds]=useState(0);

    // const deadline="January, 21, 2025";
    // console.log(endTime);
    // console.log(startTime);
    
    const getTime=()=>{
        const time=endTime-Date.now(); ;
        setHours( Math.floor(time/(1000*60*60)));   
        setMinutes(Math.floor((time/1000/60)%60));
        setSeconds(Math.floor(((time/1000)%60)));
    }
    

    useEffect(()=>{

        const interval=setInterval(()=>getTime(endTime),1000);
        
        return ()=>clearInterval(interval);

    },[]);
    
    
    
    return (
        <div className='election-layout'>
            <header>
                <nav className='electionNavBar'>
                    <div className='logo'>
                        <img src={logo} alt='logo' />
                        <p>OVS</p>
                    </div>
                    <NavLink to="/election" className={({ isActive }) => (isActive ? "active" : "")}>Home</NavLink>
                    <NavLink to="/election/kyc" className={({ isActive }) => (isActive ? "active" : "")}>Know Your Candidates</NavLink>
                    <NavLink to="/election/guidelines" className={({ isActive }) => (isActive ? "active" : "")}>Guidelines</NavLink>
                    <NavLink to="/home">Back</NavLink>
                </nav>
            </header>
             <main>
                <nav className='timerNavBar'>
                    <h1>Ends In:</h1>
                    <div className='countdown'>
                        <div className='hour'>
                            <div className='secondary-box'>
                            <h2>{hours}</h2>  
                            </div>
                            <p>Hours</p>
                        </div>
                        <div className='minutes'>
                            <div className='secondary-box'>
                            <h2>{minutes}</h2> 
                            </div>
                            <p>Minutes</p>  
                        </div>
                        <div className='seconds'>
                            <div className='secondary-box'>
                            <h2>{seconds}</h2>
                            </div>
                            <p>Seconds</p>
                        </div>
                    </div>

                </nav>
                <section>
                <Outlet/>
                </section>
                
            </main>
        </div>
    );
};