import '../css/styles.css';
// import Navbar from './components/navbar';

function About() {
    return (
        <div className="about-page">
            {/* <Navbar/> */}
            
            <main className="content">
                <section className="mission">
                    <h2>Our mission is to simplify voting process making accessible to everyone with just a few clicks!</h2>
                </section>
                
                <section className="how-it-works">
                    <h3>How it works?</h3>
                    <ol>
                        <li>Register: Login using your credentials and face recognition.</li>
                        <li>Explore Elections: Get information about ongoing, past, and upcoming elections.</li>
                        <li>Vote Casting: Choose candidate and submit vote with confidence.</li>
                        <li>View Results: After election closes, check the results to see outcome.</li>
                        <li>Manifesto reading: Click in the vote now in the election section to view candidates' manifesto.</li>
                        <li>Manifesto editing: Verify with face recognition to enable editing.</li>
                    </ol>
                </section>
                
                <section className="security">
                    <h3>Security First</h3>
                    <ul>
                        <li>Data Encryption: Your personal information and voting choices are securely encrypted.</li>
                        <li>Face Recognition Technology: Ensures only you can access your account.</li>
                        <li>Privacy Assurance: We are committed to maintaining your privacy.</li>
                    </ul>
                </section>
                
                <footer className="contact">
                    <p>Contact us</p>
                    <p>Email: commonemail@gmail.com</p>
                    <p>We aim to respond to all inquiries within 24 hours.</p>
                </footer>
            </main>
        </div>
    );
}

export default About;