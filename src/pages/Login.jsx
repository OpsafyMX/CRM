import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Mail, Lock, User } from 'lucide-react';
import Button from '../components/Common/Button';
import './Login.css';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                const result = login(formData.email, formData.password);
                if (result.success) {
                    navigate('/dashboard');
                } else {
                    setError(result.error);
                }
            } else {
                // Validation for registration
                if (formData.password !== formData.confirmPassword) {
                    setError('Las contraseñas no coinciden');
                    setLoading(false);
                    return;
                }
                if (formData.password.length < 6) {
                    setError('La contraseña debe tener al menos 6 caracteres');
                    setLoading(false);
                    return;
                }

                const result = register({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                });

                if (result.success) {
                    navigate('/dashboard');
                } else {
                    setError(result.error);
                }
            }
        } catch (err) {
            setError('Ha ocurrido un error. Por favor intenta de nuevo.');
        }

        setLoading(false);
    };

    return (
        <div className="login-container">
            <div className="login-left">
                <div className="login-illustration">
                    <div className="logo-section">
                        <div className="logo-circle">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 3L21 21M21 3L3 21" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" />
                            </svg>
                        </div>
                        <h1 className="logo-title">CRM Pro</h1>
                    </div>
                    <p className="hero-text">
                        Gestiona tus contactos, deals y tareas de manera profesional
                    </p>
                    <div className="features-list">
                        <div className="feature-item">
                            <div className="feature-icon">✓</div>
                            <span>Gestión completa de contactos</span>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">✓</div>
                            <span>Pipeline visual de ventas</span>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">✓</div>
                            <span>Analytics en tiempo real</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="login-right">
                <div className="login-card">
                    <div className="login-header">
                        <h2>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>
                        <p>
                            {isLogin
                                ? 'Ingresa tus credenciales para acceder'
                                : 'Completa tus datos para registrarte'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        {!isLogin && (
                            <div className="input-group">
                                <label className="input-label" htmlFor="name">
                                    <User size={16} />
                                    Nombre Completo
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    className="input"
                                    placeholder="Tu nombre"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required={!isLogin}
                                />
                            </div>
                        )}

                        <div className="input-group">
                            <label className="input-label" htmlFor="email">
                                <Mail size={16} />
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                className="input"
                                placeholder="tu@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label" htmlFor="password">
                                <Lock size={16} />
                                Contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                className="input"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {!isLogin && (
                            <div className="input-group">
                                <label className="input-label" htmlFor="confirmPassword">
                                    <Lock size={16} />
                                    Confirmar Contraseña
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    name="confirmPassword"
                                    className="input"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required={!isLogin}
                                />
                            </div>
                        )}

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        {isLogin && (
                            <div className="demo-credentials">
                                <strong>Credenciales de demo:</strong>
                                <br />
                                Email: admin@crm.com
                                <br />
                                Password: admin123
                            </div>
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            loading={loading}
                            icon={isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                            className="w-full"
                        >
                            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                        </Button>
                    </form>

                    <div className="login-footer">
                        <span>
                            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                        </span>
                        <button
                            type="button"
                            className="toggle-mode-btn"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                                setFormData({
                                    email: '',
                                    password: '',
                                    name: '',
                                    confirmPassword: ''
                                });
                            }}
                        >
                            {isLogin ? 'Registrarse' : 'Iniciar Sesión'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
