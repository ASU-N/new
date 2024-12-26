import '../css/styles.css';
export default function guidelines()
{
    return(

        <div className="content">
            <h2>Online Voting System Guidelines</h2>
            <div className='guidelines'>
                <ol>
                    <li>
                        <strong>Eligibility & Registration</strong>
                        <ul className='point'>
                            <li>
                            Voters must be registered and verified through personal details and OTP/email.
                            </li>
                        </ul>
                    </li>
                    <li><strong>Secure Voting Process</strong></li>
                    <ul className='point'>
                            <li>
                            Log in securely, select your candidate, and confirm your vote. Votes are anonymous and final once submitted.
                            </li>
                        </ul>
                    <li><strong>Security & Privacy</strong></li>
                    <ul className='point'>
                            <li>
                            Keep login credentials confidential and avoid using public/shared devices for voting.
                            </li>
                        </ul>
                    <li><strong>Timeline & Support</strong></li>
                    <ul className='point'>
                            <li>
                            Ensure to vote within the provided timeframe. Contact support for any technical issues or disputes.
                            </li>
                        </ul>
                </ol>
            </div>
        </div>
    
)

}