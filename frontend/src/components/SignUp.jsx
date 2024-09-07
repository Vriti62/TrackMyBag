import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/signup.css';
import profileImage from './REGISTER.jpg'; // Adjust the path as necessary

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('User registered successfully!');
                setError('');
                setUsername('');
                setEmail('');
                setPassword('');
                navigate('/login'); // Redirect to login page after successful registration
            } else {
                setError(data.error || 'An error occurred.');
            }
        } catch (error) {
            setError('Failed to connect to the server.');
        }
    };

    return (
        <div className="main">
            <img src={profileImage} alt="Profile" className="side-image" />

            <div className="signup-form">
                <h1 className="heading">Join Us Today!</h1>

                <form className="inputs" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        className="boxes"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="boxes"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="boxes"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <div className="checkbox">
                        <label>
                            <input type="checkbox" id="terms" className="checkbox-text" required /> I agree to the <a href="#">privacy policy</a> and <a href="#">terms</a>.
                        </label>
                    </div>

                    {error && <p className="error">{error}</p>}
                    {success && <p className="success">{success}</p>}

                    <button type="submit" className="signup-button">Sign up</button>
                </form>

                <div className="redirect">
                    <button onClick={() => navigate('/login')} className="login_">Log in</button>
                </div>
            </div>
        </div>
    );
};

export default SignUp;