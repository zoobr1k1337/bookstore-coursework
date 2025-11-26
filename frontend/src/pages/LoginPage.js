import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { LogIn } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', response.data.user);
            localStorage.setItem('role', response.data.role);
            localStorage.setItem('first_name', response.data.first_name);
            localStorage.setItem('last_name', response.data.last_name);
            toast.success(`Вітаємо, ${response.data.user}!`);
            navigate('/'); 
        } catch (error) {
            toast.error('Помилка входу: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container fade-in">
            <div className="auth-card">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', color: '#2c3e50' }}>
                    <LogIn size={48} />
                </div>
                <h2 className="auth-title">Вхід</h2>
                <form onSubmit={handleLogin} style={{ display: 'grid', gap: '15px' }}>
                    <input
                        className="input-field"
                        type="email" 
                        placeholder="Email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                    />
                    <input
                        className="input-field"
                        type="password" 
                        placeholder="Пароль" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                    />
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: '100%', padding: '12px', justifyContent: 'center' }}
                    >
                        {loading ? 'Вхід...' : 'Увійти'}
                    </button>
                </form>
                <p className="auth-footer">
                    Немає акаунту? <Link to="/register">Зареєструватися</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;