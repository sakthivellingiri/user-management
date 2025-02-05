import React, { useState } from 'react';
import { register } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../../services/toastService';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const { loginUser } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        let formErrors = {};
        if (!email) formErrors.email = 'Email is required';
        if (!password) formErrors.password = 'Password is required';
        return formErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        try {
            const response = await register(email, password);
            loginUser(response.data.token);
            showToast('Registration successful', 'success');
            navigate('/dashboard'); 
        } catch (error) {
            showToast('Registration failed, please try again', 'error');
        }
    };

    return (
        <div className="card">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <p>{errors.email}</p>}
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && <p>{errors.password}</p>}
                </div>
                <button type="submit">Register</button>
                <button 
                    type="button" 
                    className="register-btn"
                    onClick={() => navigate('/')}> 
                    Already have an account? Login
                </button>
            </form>
        </div>
    );
};

export default Register;
