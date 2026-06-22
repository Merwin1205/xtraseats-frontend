import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

function TicketDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userId, isSubscribed } = useAuth();

    const [ticket, setTicket] = useState(null);
    const [contact, setContact] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        API.get(`/tickets/${id}`)
            .then(res => { setTicket(res.data); setLoading(false); })
            .catch(err => {
                if (err.response?.status === 404) setNotFound(true);
                else showToast(err.response?.data?.message || 'Failed to load ticket.', 'error');
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        if (isSubscribed && userId && ticket) {
            API.get(`/tickets/${id}/contact?userId=${userId}`)
                .then(res => setContact(res.data))
                .catch(err => {
                    if (err.response?.status !== 403) {
                        showToast(err.response?.data?.message || 'Could not load contact.', 'error');
                    }
                });
        }
    }, [isSubscribed, userId, ticket]);

    // ★ NEW — checks login before deciding where to send the person
    const handleUnlockClick = () => {
        if (!userId) {
            navigate('/login');
        } else {
            navigate('/subscribe', { state: { ticketId: id } });
        }
    };

    if (loading) return <p style={{ textAlign: 'center', padding: '60px', color: '#888' }}>Loading...</p>;

    if (notFound) return (
        <div style={{
            maxWidth: '400px', margin: '80px auto', textAlign: 'center',
            background: '#fff5f5', border: '1px solid #ffcccc',
            borderRadius: '10px', padding: '40px'
        }}>
            <p style={{ fontSize: '40px' }}>🎬</p>
            <h3 style={{ color: '#cc0000' }}>Ticket Not Found</h3>
            <p style={{ color: '#888' }}>This listing may have been removed.</p>
            <button onClick={() => navigate('/')} style={{
                marginTop: '16px', background: '#008080', color: 'white',
                border: 'none', padding: '10px 20px', borderRadius: '6px',
                cursor: 'pointer', fontWeight: 'bold'
            }}>
                Back to Browse
            </button>
        </div>
    );

    if (!ticket) return null;

    return (
        <div style={{ maxWidth: '960px', margin: '30px auto', padding: '0 20px' }}>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <p style={{ color: '#888', fontSize: '14px', marginBottom: '16px' }}>
                <span onClick={() => navigate('/')} style={{ color: '#008080', cursor: 'pointer' }}>
                    Browse
                </span>
                {' > '}{ticket.movieName}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '24px' }}>

                <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: '12px', padding: '26px' }}>
                    <span style={{
                        background: '#e0f7f7', color: '#008080',
                        padding: '4px 12px', borderRadius: '12px',
                        fontSize: '12px', fontWeight: 'bold'
                    }}>
                        🎬 MOVIE
                    </span>

                    <h2 style={{ margin: '12px 0 20px', fontSize: '26px' }}>{ticket.movieName}</h2>

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                            {[
                                ['📍 City', ticket.city],   /* ★ NEW */
                                ['📅 Date & Time', `${ticket.showDate} · ${ticket.showTime}`],
                                ['🏛 Theatre', ticket.theatreName],
                                ['🗣 Language', ticket.language],
                                ['💺 Seats', `${ticket.seatNumbers} · ${ticket.ticketCount} seat(s)`],
                                ['📽 Format', `${ticket.screenFormat}${ticket.screenNumber ? ` · ${ticket.screenNumber}` : ''}`],
                                ['💰 Price', `Rs. ${ticket.pricePerSeat} / seat`],
                            ].map(([label, value]) => (
                                <tr key={label} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                    <td style={{ padding: '11px 0', color: '#888', fontSize: '14px', width: '38%' }}>{label}</td>
                                    <td style={{ padding: '11px 0', fontWeight: '500', fontSize: '15px' }}>{value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {ticket.extraInfo && (
                        <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '12px', marginTop: '18px' }}>
                            <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>📝 {ticket.extraInfo}</p>
                        </div>
                    )}

                    {ticket.sellerNote && (
                        <blockquote style={{
                            borderLeft: '3px solid #008080', margin: '16px 0 0',
                            paddingLeft: '14px', color: '#666', fontStyle: 'italic', fontSize: '14px'
                        }}>
                            "{ticket.sellerNote}" — {ticket.sellerName}
                        </blockquote>
                    )}
                </div>

                <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: '12px', padding: '24px', height: 'fit-content' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '18px' }}>Contact Seller</h3>

                    {contact ? (
                        <div>
                            <div style={{
                                background: '#e6f9f0', border: '1px solid #00bb77',
                                borderRadius: '8px', padding: '6px 14px',
                                display: 'inline-block', marginBottom: '18px'
                            }}>
                                <span style={{ color: '#00994d', fontWeight: 'bold', fontSize: '13px' }}>✅ Contact Unlocked</span>
                            </div>
                            <p style={{ fontWeight: '600', fontSize: '16px', margin: '0 0 6px' }}>{contact.sellerName}</p>
                            <p style={{ fontSize: '22px', color: '#008080', fontWeight: 'bold', margin: '0 0 20px' }}>
                                {contact.sellerContact}
                            </p>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <a href={`tel:${contact.sellerContact}`} style={{
                                    flex: 1, textAlign: 'center', padding: '11px',
                                    border: '2px solid #008080', color: '#008080',
                                    borderRadius: '8px', fontWeight: 'bold', fontSize: '14px'
                                }}>📞 Call</a>
                                <a href={`https://wa.me/91${contact.sellerContact}`} target="_blank" rel="noreferrer" style={{
                                    flex: 1, textAlign: 'center', padding: '11px',
                                    border: '2px solid #25D366', color: '#25D366',
                                    borderRadius: '8px', fontWeight: 'bold', fontSize: '14px'
                                }}>💬 WhatsApp</a>
                            </div>
                            <p style={{ fontSize: '12px', color: '#888', marginTop: '14px', textAlign: 'center' }}>
                                Agree on meeting point before paying the seller.
                            </p>
                        </div>
                    ) : (
                        <div>
                            <div style={{ marginBottom: '18px' }}>
                                {['75%', '50%', '90%'].map((w, i) => (
                                    <div key={i} style={{
                                        height: '14px', background: '#ddd', borderRadius: '4px',
                                        marginBottom: '9px', width: w, filter: 'blur(4px)'
                                    }} />
                                ))}
                            </div>
                            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                                <span style={{ fontSize: '36px' }}>🔒</span>
                                <p style={{ color: '#555', fontSize: '14px', margin: '8px 0 0' }}>
                                    Subscribe to see seller's contact
                                </p>
                            </div>

                            {/* ★ UPDATED — onClick now goes through the login check */}
                            <button onClick={handleUnlockClick} style={{
                                width: '100%', background: '#5b2d8e', color: 'white',
                                border: 'none', padding: '13px', borderRadius: '8px',
                                fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '14px'
                            }}>
                                Unlock for Rs.30 (one time)
                            </button>

                            <ul style={{ fontSize: '13px', color: '#666', paddingLeft: '18px', margin: 0, lineHeight: 2 }}>
                                <li>All seller contacts, forever</li>
                                <li>No per-ticket charge</li>
                                <li>Works on all listings</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TicketDetailPage;