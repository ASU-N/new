
import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom'; // Import useNavigate
import profile from '../assets/home_profile.jpg';
import logo from '../assets/logo.png';
import './HomeLayout.css';

export default function HomeLayout() {
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate

    const handleProfileClick = () => {
        setShowDropdown((prev) => !prev); // Toggle dropdown visibility
    };

    const handleLogout = () => {
        console.log("Logged out");
        // Perform logout logic if needed, e.g., clearing localStorage or cookies
        navigate('/'); // Redirect to login page
    };

    return (
        <div className='root-layout'>
            <header>
                <nav className='homeNavBar'>
                    <NavLink to="/home" className="logo-wrapper">
                        <div className='logo'>
                            <img src={logo} alt='logo' />
                            <p>OVS</p>
                        </div>
                    </NavLink>
                    <div className='navlink'>
                    <NavLink to="/home" className={({ isActive }) => (isActive ? "active" : "")}>Dashboard</NavLink>
                    <NavLink to="/home/result" className={({ isActive }) => (isActive ? "active" : "")}>Results</NavLink> 
                    </div>
                    <div className='profile-button'>
                        <button className='profile-image' onClick={handleProfileClick}>
                            <img src={profile} alt='Voter Profile' />
                        </button>
                        {showDropdown && (
                            <div className='dropdown'>
                                <button onClick={handleLogout}>Logout</button>
                            </div>
                        )}
                    </div>
                </nav>
            </header>
            <main className='home_main'>
                <section className='homelayout_section'>
                    <Outlet />
                </section>
            </main>
        </div>
    );
}
