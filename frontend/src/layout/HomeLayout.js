import {NavLink,Outlet} from 'react-router-dom';
import {useState,useEffect} from 'react';
import profile from '../assets/home_profile.jpg';
import logo from '../assets/logo.png';
import './HomeLayout.css'

export default function HomeLayout(){
    
    const [hours,setHours]=useState(0);
    const [minutes,setMinutes]=useState(0);
    const [seconds,setSeconds]=useState(0);

    const deadline="January, 1, 2025";

    const getTime=()=>{
        const time=Date.parse(deadline)-Date.now();
        const standardTime=time/1000;
        setHours( Math.floor(time/(1000*60*60)));   
        setMinutes(Math.floor((time/1000/60)%60));
        setSeconds(Math.floor(((time/1000)%60)));
    }
    

    useEffect(()=>{

        const interval=setInterval(()=>getTime(deadline),1000);
        
        return ()=>clearInterval(interval);

    },[]);

    
    return(
        <div className='root-layout'>
            <header>
                <nav className='homeNavBar'>
                    <div className='logo'>
                        <img src={logo} alt='logo'/>
                        <p>OVS</p>
                    </div>
                    <NavLink to="/home" className={({isActive})=>(isActive?"active":"")}>Home</NavLink>
                    <NavLink to="/home/kyc" className={({isActive})=>(isActive?"active":"")}>Know Your Candidates</NavLink>
                    <NavLink to="/home/result" className={({isActive})=>(isActive?"active":"")}>Results</NavLink>
                    <NavLink to="/home/guidelines" className={({isActive})=>(isActive?"active":"")}>Guidelines</NavLink>
                    <button><img src={profile} alt='Voters Profile'/></button>
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
    )
};