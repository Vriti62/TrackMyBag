import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/signup.css'; // Adjust the path as necessary

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    // Email validation regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    // Password validation regex (at least 8 characters, includes letters and numbers)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (!emailRegex.test(e.target.value)) {
            setEmailError('Email must be a valid @gmail.com address.');
        } else {
            setEmailError('');
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (!passwordRegex.test(e.target.value)) {
            setPasswordError(
                'Password must be at least 8 characters long and include both letters and numbers.'
            );
        } else {
            setPasswordError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // General form validation
        if (!name || !email || !password || !confirmPassword) {
            setError('Please fill in all fields.');
            return;
        }
    
        // Check if passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
    
        // Check if there are any validation errors before submitting
        if (emailError || passwordError) {
            setError('Please fix the errors before submitting.');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:3000/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: name, email, password }),
            });
    
            const data = await response.json();
    
            console.log('Server Response:', data); // Debugging: Log server response
    
            if (response.ok) {
                setSuccess('User registered successfully!');
                setError('');
                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                navigate('/login'); // Redirect to login page after successful registration
            } else {
                setError(data.error || 'An error occurred.');
            }
        } catch (error) {
            console.error('Fetch error:', error); // Debugging: Log fetch error
            setError('Failed to connect to the server.');
        }
    };
    

    return (
        <div className="signup-container">
            <h1>Create an Account</h1>
            <p>Sign up to start tracking your luggage</p>

            <form onSubmit={handleSubmit} className="form">
                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                />
                {emailError && <p className="error">{emailError}</p>}

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                />
                {passwordError && <p className="error">{passwordError}</p>}

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                <button type="submit">Sign Up</button>
            </form>

            <p>Already have an account? <span className="link" onClick={() => navigate('/login')}>Log in</span></p>
        </div>
    );
};

export default SignupPage;
