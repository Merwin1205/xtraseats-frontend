import { useState, useEffect } from 'react';
import API from '../api/axios';
import TicketCard from '../components/TicketCard';
import { CITIES } from '../constants';

function HomePage() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCity, setSelectedCity] = useState('');

    useEffect(() => {
        setLoading(true);
        const url = selectedCity ? `/tickets?city=${selectedCity}` : '/tickets';
        API.get(url)
            .then(res => {
                setTickets(res.data);
                setLoading(false);
            })
            .catch(err => {
                const message = err.response?.data?.message
                    || 'Could not load tickets. Is Spring Boot running?';
                setError(message);
                setLoading(false);
            });
    }, [selectedCity]); // re-fetches whenever the dropdown changes

    const selectStyle = {
        padding: '9px 14px', borderRadius: '8px',
        border: '1px solid #ccc', fontSize: '14px',
        background: 'white', cursor: 'pointer'
    };

    if (loading) return <p style={{ textAlign: 'center', padding: '80px', color: '#888' }}>Loading tickets...</p>;

    if (error) return (
        <div style={{
            maxWidth: '500px', margin: '80px auto', textAlign: 'center',
            background: '#fff5f5', border: '1px solid #ffcccc',
            borderRadius: '10px', padding: '30px'
        }}>
            <p style={{ fontSize: '32px' }}>⚠️</p>
            <p style={{ color: '#cc0000', fontWeight: '600' }}>{error}</p>
        </div>
    );

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '30px 20px' }}>

            <div style={{
                background: 'linear-gradient(135deg, #008080, #005f5f)',
                color: 'white', padding: '48px 32px',
                borderRadius: '14px', marginBottom: '24px', textAlign: 'center'
            }}>
                <h1 style={{ fontSize: '32px', margin: '0 0 10px' }}>Find Movie Tickets Near You</h1>
                <p style={{ opacity: 0.85, margin: 0, fontSize: '16px' }}>
                    Real people selling extra tickets — browse for free
                </p>
            </div>

            {/* City filter row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>
                    {tickets.length} listing{tickets.length !== 1 ? 's' : ''}
                    {selectedCity ? ` in ${selectedCity}` : ''}
                </p>

                <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)} style={selectStyle}>
                    <option value="">📍 All Cities</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            {tickets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
                    <p style={{ fontSize: '48px' }}>🎬</p>
                    <p style={{ fontSize: '18px' }}>
                        No tickets {selectedCity ? `in ${selectedCity}` : 'listed yet'}.
                    </p>
                    <p>Be the first to post!</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '22px'
                }}>
                    {tickets.map(ticket => (
                        <TicketCard key={ticket.id} ticket={ticket} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default HomePage;