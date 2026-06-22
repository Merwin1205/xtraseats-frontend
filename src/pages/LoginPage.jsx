import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [isRegistering, setIsRegistering] = useState(false);
    const [form, setForm] = useState({ username: '', password: '', name: '' });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
cd 
    const showToast = (message, type = 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setFieldErrors({ ...fieldErrors, [e.target.name]: null }); // clear error as user types
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setFieldErrors({});

        const endpoint = isRegistering ? '/auth/register' : '/auth/login';
        const payload = isRegistering
            ? form
            : { username: form.username, password: form.password };

        API.post(endpoint, payload)
            .then(res => {
                login(res.data.userId, res.data.username, res.data.name, res.data.isSubscribed);
                showToast(res.data.message, 'success');
                setTimeout(() => navigate('/'), 1000);
            })
            .catch(err => {
                // Backend validation errors (e.g. username too short) come as a fieldName -> message map
                if (err.response?.status === 400 && err.response?.data?.errors) {
                    setFieldErrors(err.response.data.errors);
                    showToast('Please fix the highlighted fields.', 'error');
                } else {
                    showToast(err.response?.data?.message || 'Something went wrong.', 'error');
                }
                setLoading(false);
            });
    };

    const inputStyle = {
        width: '100%', padding: '11px', borderRadius: '6px',
        border: '1px solid #ccc', fontSize: '14px',
        marginTop: '5px', boxSizing: 'border-box'
    };
    const labelStyle = {
        display: 'block', marginBottom: '14px',
        fontSize: '14px', fontWeight: '600', color: '#444'
    };
    const errorTextStyle = { color: '#cc0000', fontSize: '12px', fontWeight: 'normal', margin: '4px 0 0' };

    return (
        <div style={{ maxWidth: '420px', margin: '60px auto', padding: '0 20px' }}>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: '12px', padding: '32px' }}>
                <h2 style={{ textAlign: 'center', color: '#008080', marginTop: 0 }}>
                    {isRegistering ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p style={{ textAlign: 'center', color: '#888', marginBottom: '24px', fontSize: '14px' }}>
                    {isRegistering ? 'Sign up to browse and subscribe' : 'Log in to continue'}
                </p>

                <form onSubmit={handleSubmit}>
                    {isRegistering && (
                        <label style={labelStyle}>
                            Full Name
                            <input style={inputStyle} name="name" value={form.name} onChange={handleChange} />
                            {fieldErrors.name && <p style={errorTextStyle}>{fieldErrors.name}</p>}
                        </label>
                    )}

                    <label style={labelStyle}>
                        Username
                        <input style={inputStyle} name="username" value={form.username} onChange={handleChange}
                            placeholder="e.g. priya_s" />
                        {fieldErrors.username && <p style={errorTextStyle}>{fieldErrors.username}</p>}
                    </label>

                    <label style={labelStyle}>
                        Password
                        <input style={inputStyle} type="password" name="password" value={form.password} onChange={handleChange} />
                        {fieldErrors.password && <p style={errorTextStyle}>{fieldErrors.password}</p>}
                    </label>

                    <button type="submit" disabled={loading} style={{
                        width: '100%', background: loading ? '#aaa' : '#008080', color: 'white',
                        border: 'none', padding: '13px', borderRadius: '8px',
                        fontSize: '15px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer',
                        marginTop: '6px'
                    }}>
                        {loading ? 'Please wait...' : (isRegistering ? 'Create Account' : 'Log In')}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' }}>
                    {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <span
                        onClick={() => { setIsRegistering(!isRegistering); setFieldErrors({}); }}
                        style={{ color: '#008080', fontWeight: 'bold', cursor: 'pointer' }}>
                        {isRegistering ? 'Log In' : 'Sign Up'}
                    </span>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;