import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

function SubscribePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { userId, name, updateSubscription } = useAuth();
    const ticketId = location.state?.ticketId;

    const [upiId, setUpiId] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    // Not logged in? Send to login first — they'll come back and click Unlock again.
    useEffect(() => {
        if (!userId) {
            navigate('/login');
        }
    }, [userId, navigate]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        API.post('/payment', { userId: parseInt(userId), amount: 30.0, upiId })
            .then(() => {
                updateSubscription(true);
                showToast('Payment successful! Contacts unlocked.', 'success');
                setTimeout(() => {
                    if (ticketId) navigate(`/tickets/${ticketId}`);
                    else navigate('/');
                }, 1500);
            })
            .catch(err => {
                const message = err.response?.data?.message || 'Payment failed. Please try again.';
                showToast(message, 'error');
                setLoading(false);
            });
    };

    if (!userId) return null; // brief flash before the redirect effect above kicks in

    const inputStyle = {
        width: '100%', padding: '10px', borderRadius: '6px',
        border: '1px solid #ccc', fontSize: '14px',
        marginTop: '5px', boxSizing: 'border-box'
    };

    return (
        <div style={{ maxWidth: '820px', margin: '40px auto', padding: '0 20px' }}>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>

                <div style={{ padding: '10px 0' }}>
                    <span style={{
                        background: '#e0f7f7', color: '#008080',
                        padding: '4px 12px', borderRadius: '12px',
                        fontSize: '12px', fontWeight: 'bold'
                    }}>ONE-TIME ACCESS</span>

                    <h2 style={{ margin: '18px 0 8px', fontSize: '26px', lineHeight: 1.3 }}>
                        Unlock every seller.<br />Pay once. Done.
                    </h2>
                    <p style={{ color: '#666', marginBottom: '10px' }}>
                        Hi {name}! Rs.30 is all it takes. No monthly plan.
                    </p>

                    <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
                        {[
                            'Direct call / WhatsApp sellers',
                            'All listings, all movies',
                            'Valid forever — no renewal',
                            'Pay once — access forever'
                        ].map(item => (
                            <li key={item} style={{ padding: '10px 0', borderBottom: '1px solid #eee', color: '#333', fontSize: '15px' }}>
                                ✅ &nbsp;{item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: '12px', padding: '26px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '22px' }}>
                        <p style={{ color: '#888', fontSize: '12px', margin: '0 0 4px' }}>ONE-TIME FEE</p>
                        <h2 style={{ margin: 0, fontSize: '40px', color: '#008080' }}>Rs. 30</h2>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <label style={{ display: 'block', marginBottom: '18px', fontSize: '14px', fontWeight: '600', color: '#444' }}>
                            UPI ID
                            <input style={inputStyle} type="text" value={upiId}
                                onChange={e => setUpiId(e.target.value)}
                                placeholder="yourname@okaxis" required />
                        </label>

                        <button type="submit" disabled={loading} style={{
                            width: '100%', background: loading ? '#aaa' : '#5b2d8e', color: 'white',
                            border: 'none', padding: '13px', borderRadius: '8px',
                            fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer'
                        }}>
                            {loading ? 'Processing...' : 'Pay Rs.30 and unlock contacts'}
                        </button>

                        <p style={{ textAlign: 'center', fontSize: '12px', color: '#aaa', marginTop: '10px' }}>
                            🔒 Mock payment — internship demo only
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SubscribePage;