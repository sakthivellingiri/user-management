import React, { useState } from 'react';
import { login } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../../services/toastService';
import { useNavigate } from 'react-router-dom';


const Login = () => {
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
            const response = await login(email, password);
            loginUser(response.data.token);
            showToast('Login successful', 'success');
            navigate('/dashboard');
        } catch (error) {
            showToast('Login failed, please try again', 'error');
        }
    };

    return (
        <div className="card">
            <h2>Login</h2>
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
                <button type="submit">Login</button>
                <button 
                    type="button" 
                    className="register-btn" 
                    onClick={() => navigate('/register')}>
                    New Register
                </button>
            </form>
        </div>
    );
};

export default Login;

