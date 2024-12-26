import React, { useState } from 'react';
import './toggleButton.css'; // Import the CSS file

const ToggleButton = ({onToggle}) => {
    const [isChecked, setIsChecked] = useState(false);

    const handleToggle = () => {
        

        setIsChecked(!isChecked);
        onToggle(isChecked?'Register':'Login');
        
        console.log(isChecked);
    };

    return (
        <div className="toggle">
            <input 
                type="checkbox" 
                id="toggle" 
                className="toggleCheckbox" 
                checked={isChecked} 
                onChange={handleToggle} 
            />
            <label htmlFor="toggle" className="toggleContainer">
                <div>Register</div>
                <div>Login</div>
            </label>
        </div>
    );
};

export default ToggleButton;
