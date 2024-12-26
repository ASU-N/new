import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import './login.css';
import votingImage from '../assets/login.png';
import ToggleButton from '../components/toggleButton';

const Login = () => {
    const [videoStream, setVideoStream] = useState(null);
    const [votingId, setVotingId] = useState('');
    const [action, setAction] = useState('register');
    const videoRef = useRef(null);
    const navigate = useNavigate();  // Initialize useNavigate

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                setVideoStream(stream);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch(err => console.error("Error accessing webcam: ", err));
    }, []);

    const captureFrame = () => {
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg');
    };

    const sendFrameToBackend = (frame, action) => {
        axios.post(`http://localhost:5000/${action}`, { frame, voter_id: votingId })
            .then(response => {
                console.log("Response: ", response.data);
                alert(response.data.message); // Display success/failure message
                if (response.data.message.includes('successful')) {
                    navigate('/home');  // Navigate to /home if successful
                }
            })
            .catch(error => console.error("Error: ", error));
    };

    const handleToggle = (text) => {
        setAction(text.toLowerCase());
        console.log('Action: ' + text);
    };

    const handleSubmission = (event) => {
        event.preventDefault();
        const frame = captureFrame();
        sendFrameToBackend(frame, action);
    };

    return (
        <div className='login-container'>
            <div className="container">
                <div className="image-section">
                    <img src={votingImage} alt="Voting Illustration" />
                </div>
                <form className="form-section" onSubmit={handleSubmission} method="post">
                    <div className='toggle-button'>
                        <ToggleButton onToggle={handleToggle} />
                    </div>
                    <div className='form-info'>
                        <h2>Enter Your Voting ID</h2>
                        <input type="text" placeholder="Enter your Voting ID here" value={votingId} onChange={({ target }) => setVotingId(target.value)} required />
                        <video ref={videoRef} autoPlay className="webcam-video" />
                        <div className="button-container">
                            <button type="submit">Continue</button>  
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
