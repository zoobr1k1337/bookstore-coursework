import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/register', formData);
            toast.success('Реєстрація успішна! Тепер увійдіть.');
            navigate('/login');
        } catch (error) {
            toast.error('Помилка: ' + (error.response?.data?.error || "Щось пішло не так"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container fade-in">
            <div className="auth-card" style={{ maxWidth: '500px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', color: '#2c3e50' }}>
                    <UserPlus size={48} />
                </div>
                <h2 className="auth-title">Створити акаунт</h2>
                <form onSubmit={handleRegister} style={{ display: 'grid', gap: '15px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <input 
                            className="input-field"
                            name="first_name" 
                            placeholder="Ім'я" 
                            required 
                            onChange={handleChange} 
                        />
                        <input 
                            className="input-field"
                            name="last_name" 
                            placeholder="Прізвище" 
                            required 
                            onChange={handleChange} 
                        />
                    </div>
                    <input 
                        className="input-field"
                        name="email" 
                        type="email" 
                        placeholder="Email" 
                        required 
                        onChange={handleChange} 
                    />
                    <input 
                        className="input-field"
                        name="password" 
                        type="password" 
                        placeholder="Пароль (мін. 6 символів)" 
                        required 
                        onChange={handleChange} 
                    />
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: '100%', padding: '12px', marginTop: '10px' }}
                    >
                        {loading ? 'Реєстрація...' : 'Зареєструватися'}
                    </button>
                </form>
                <p className="auth-footer">
                    Вже є акаунт? <Link to="/login">Увійти в систему</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;