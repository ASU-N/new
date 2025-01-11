import { NavLink, Outlet } from 'react-router-dom';
import logo from '../assets/logo.png';
import './ElectionLayout.css';
import {useState,useEffect} from 'react';
import {startTime,endTime} from '../pages/home';

export default function ElectionLayout() {
    
    const [hours,setHours]=useState(0);
    const [minutes,setMinutes]=useState(0);
    const [seconds,setSeconds]=useState(0);



    const string_end=localStorage.getItem('endTime');
    const end=new Date(string_end);


    useEffect(()=>{
        if(startTime){
            localStorage.setItem('startTime',startTime)
        }
    },[startTime])

    useEffect(()=>{
        if(endTime){
            localStorage.setItem('endTime',endTime)
        }
    },[endTime])

    // console.log(localStorage.getItem('endTime'));



    
    const getTime=()=>{

        const time=end-Date.now(); 
        // console.log(time);
        setHours( Math.floor(time/(1000*60*60)));   
        setMinutes(Math.floor((time/1000/60)%60));
        setSeconds(Math.floor(((time/1000)%60)));
    }
    

    useEffect(()=>{

        const interval=setInterval(()=>getTime(end),1000);
        
        return ()=>clearInterval(interval);

    },[]);

    function clear()
    {
        localStorage.removeItem('startTime','endTime');
        
    }
    
    
    
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
                    <NavLink to="/home" onClick={()=>{clear()}}>Back</NavLink>
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