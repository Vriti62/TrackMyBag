import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaLockOpen } from 'react-icons/fa'; // Import icons
import { AlertCircle, CheckCircle } from 'lucide-react'; // Import additional icons
import '../styles/signup.css';

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
        if (!e.target.value) {
            setEmailError('Please enter your email address');
        } else if (!emailRegex.test(e.target.value)) {
            setEmailError('Please use a valid Gmail address (example@gmail.com)');
        } else {
            setEmailError('');
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (!e.target.value) {
            setPasswordError('Please enter a password');
        } else if (!passwordRegex.test(e.target.value)) {
            setPasswordError(
                'Password requirements:\n' +
                '• At least 8 characters long\n' +
                '• Must include letters and numbers'
            );
        } else {
            setPasswordError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // General form validation
        if (!name || !email || !password || !confirmPassword) {
            setError('Please fill in all required fields');
            return;
        }
    
        // Check if passwords match
        if (password !== confirmPassword) {
            setError('The passwords you entered do not match');
            return;
        }
    
        // Check if there are any validation errors before submitting
        if (emailError || passwordError) {
            setError('Please fix the errors before submitting');
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
            setError('Unable to create account. Please try again later.');
        }
    };
    

    return (
        <div className="signup-container">
            <h1>Create an Account</h1>
            <p>Sign up to start tracking your luggage</p>

            <form onSubmit={handleSubmit} className="form">
                <div className="input-field-container">
                    <FaUser className="input-icon" />
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="input-field-container">
                    <FaEnvelope className="input-icon" />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                </div>
                {emailError && (
                    <p className="error">
                        <AlertCircle className="error-icon" />
                        {emailError}
                    </p>
                )}

                <div className="input-field-container">
                    <FaLock className="input-icon" />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />
                </div>
                {passwordError && (
                    <p className="error">
                        <AlertCircle className="error-icon" />
                        {passwordError}
                    </p>
                )}

                <div className="input-field-container">
                    <FaLockOpen className="input-icon" />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                {error && (
                    <p className="error">
                        <AlertCircle className="error-icon" />
                        {error}
                    </p>
                )}
                {success && (
                    <p className="success">
                        <CheckCircle className="success-icon" />
                        {success}
                    </p>
                )}

                <button type="submit">Sign Up</button>
            </form>

            <p>Already have an account? <span className="link" onClick={() => navigate('/login')}>Log in</span></p>
        </div>
    );
};

export default SignupPage;
