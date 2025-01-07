import { NavLink, Outlet } from 'react-router-dom';
import profile from '../assets/home_profile.jpg';
import logo from '../assets/logo.png';
import './HomeLayout.css';

export default function HomeLayout() {
    return (
        <div className='root-layout'>
            <header>
                <nav className='homeNavBar'>
                    <div className='logo'>
                        <img src={logo} alt='logo' />
                        <p>OVS</p>
                    </div>
                    <NavLink to="/home" className={({ isActive }) => (isActive ? "active" : "")}>Home</NavLink>
                    <NavLink to="/home/result" className={({ isActive }) => (isActive ? "active" : "")}>Results</NavLink>
                    <button><img src={profile} alt='Voter Profile' /></button>
                </nav>
            </header>
            <main>
                <section>
                    <Outlet />
                </section>
            </main>
        </div>
    );
};
