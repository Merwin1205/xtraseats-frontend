import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Toast from '../components/Toast';
import { CITIES } from '../constants';

function PostTicketPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});

    const [form, setForm] = useState({
        movieName: '', theatreName: '', city: '', language: '',
        showDate: '', showTime: '', seatNumbers: '',
        ticketCount: '', pricePerSeat: '', screenFormat: '2D',
        screenNumber: '', extraInfo: '', sellerName: '',
        sellerContact: '', sellerNote: ''
    });

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setFieldErrors({ ...fieldErrors, [e.target.name]: null });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setFieldErrors({});

        API.post('/tickets', {
            ...form,
            ticketCount: parseInt(form.ticketCount),
            pricePerSeat: parseFloat(form.pricePerSeat)
        })
        .then(() => {
            showToast('Ticket posted successfully!', 'success');
            setLoading(false);
            setTimeout(() => navigate('/'), 2000);
        })
        .catch(err => {
            if (err.response?.status === 400 && err.response?.data?.errors) {
                setFieldErrors(err.response.data.errors);
                showToast('Please fix the highlighted fields.', 'error');
            } else {
                showToast(err.response?.data?.message || 'Failed to post ticket.', 'error');
            }
            setLoading(false);
        });
    };

    const inputStyle = {
        width: '100%', padding: '10px', borderRadius: '6px',
        border: '1px solid #ccc', fontSize: '14px',
        marginTop: '5px', boxSizing: 'border-box'
    };
    const cardStyle = {
        background: 'white', border: '1px solid #ddd',
        borderRadius: '12px', padding: '22px', marginBottom: '20px'
    };
    const labelStyle = {
        display: 'block', fontSize: '14px',
        fontWeight: '600', color: '#444', marginBottom: '14px'
    };
    const errorTextStyle = { color: '#cc0000', fontSize: '12px', fontWeight: 'normal', margin: '4px 0 0' };

    return (
        <div style={{ maxWidth: '700px', margin: '30px auto', padding: '0 20px' }}>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <h2 style={{ color: '#008080', marginBottom: '6px' }}>Post Extra Tickets</h2>
            <p style={{ color: '#888', marginBottom: '24px' }}>Your contact is never shown publicly.</p>

            <form onSubmit={handleSubmit}>

                <div style={cardStyle}>
                    <h3 style={{ marginTop: 0, color: '#008080' }}>🎬 Movie Details</h3>

                    <label style={labelStyle}>
                        Movie Name
                        <input style={inputStyle} name="movieName" value={form.movieName} onChange={handleChange}
                            placeholder="e.g. KGF Chapter 3" />
                        {fieldErrors.movieName && <p style={errorTextStyle}>{fieldErrors.movieName}</p>}
                    </label>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        {/* ★ NEW — city dropdown */}
                        <label style={labelStyle}>
                            City
                            <select style={inputStyle} name="city" value={form.city} onChange={handleChange}>
                                <option value="">Select city</option>
                                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            {fieldErrors.city && <p style={errorTextStyle}>{fieldErrors.city}</p>}
                        </label>
                        <label style={labelStyle}>
                            Language
                            <input style={inputStyle} name="language" value={form.language} onChange={handleChange}
                                placeholder="Tamil / Hindi / English" />
                            {fieldErrors.language && <p style={errorTextStyle}>{fieldErrors.language}</p>}
                        </label>
                    </div>

                    <label style={labelStyle}>
                        Theatre Name
                        <input style={inputStyle} name="theatreName" value={form.theatreName} onChange={handleChange}
                            placeholder="e.g. AGS Cinemas" />
                        {fieldErrors.theatreName && <p style={errorTextStyle}>{fieldErrors.theatreName}</p>}
                    </label>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <label style={labelStyle}>
                            Show Date
                            <input style={inputStyle} type="date" name="showDate" value={form.showDate} onChange={handleChange} />
                            {fieldErrors.showDate && <p style={errorTextStyle}>{fieldErrors.showDate}</p>}
                        </label>
                        <label style={labelStyle}>
                            Show Time
                            <input style={inputStyle} name="showTime" value={form.showTime} onChange={handleChange}
                                placeholder="e.g. 7:30 PM" />
                            {fieldErrors.showTime && <p style={errorTextStyle}>{fieldErrors.showTime}</p>}
                        </label>
                    </div>
                </div>

                <div style={cardStyle}>
                    <h3 style={{ marginTop: 0, color: '#008080' }}>💺 Ticket Details</h3>
                    <label style={labelStyle}>
                        Seat Numbers
                        <input style={inputStyle} name="seatNumbers" value={form.seatNumbers} onChange={handleChange}
                            placeholder="e.g. F5, F6" />
                        {fieldErrors.seatNumbers && <p style={errorTextStyle}>{fieldErrors.seatNumbers}</p>}
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <label style={labelStyle}>
                            Number of Tickets
                            <input style={inputStyle} type="number" name="ticketCount" value={form.ticketCount} onChange={handleChange} />
                            {fieldErrors.ticketCount && <p style={errorTextStyle}>{fieldErrors.ticketCount}</p>}
                        </label>
                        <label style={labelStyle}>
                            Price per Seat (Rs.)
                            <input style={inputStyle} type="number" name="pricePerSeat" value={form.pricePerSeat} onChange={handleChange} />
                            {fieldErrors.pricePerSeat && <p style={errorTextStyle}>{fieldErrors.pricePerSeat}</p>}
                        </label>
                    </div>
                    <label style={labelStyle}>
                        Seller Note (optional)
                        <textarea style={{ ...inputStyle, height: '70px', resize: 'vertical' }}
                            name="sellerNote" value={form.sellerNote} onChange={handleChange}
                            placeholder="e.g. BookMyShow booking screenshot available." />
                        {fieldErrors.sellerNote && <p style={errorTextStyle}>{fieldErrors.sellerNote}</p>}
                    </label>
                </div>

                <div style={cardStyle}>
                    <h3 style={{ marginTop: 0, color: '#008080' }}>📽 Screen & Format Info</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <label style={labelStyle}>
                            Screen Format
                            <select style={inputStyle} name="screenFormat" value={form.screenFormat} onChange={handleChange}>
                                <option>2D</option><option>3D</option><option>IMAX</option>
                                <option>4DX</option><option>ICE</option><option>Dolby Atmos</option>
                            </select>
                        </label>
                        <label style={labelStyle}>
                            Screen Number (optional)
                            <input style={inputStyle} name="screenNumber" value={form.screenNumber} onChange={handleChange}
                                placeholder="e.g. Screen 2" />
                        </label>
                    </div>
                    <label style={labelStyle}>
                        Additional Info (optional)
                        <textarea style={{ ...inputStyle, height: '70px', resize: 'vertical' }}
                            name="extraInfo" value={form.extraInfo} onChange={handleChange}
                            placeholder="e.g. Recliner seats, Dolby sound..." />
                        {fieldErrors.extraInfo && <p style={errorTextStyle}>{fieldErrors.extraInfo}</p>}
                    </label>
                </div>

                <div style={{ ...cardStyle, background: '#f0fafa', border: '2px solid #008080' }}>
                    <h3 style={{ marginTop: 0, color: '#008080' }}>🔒 Your Contact (Hidden from public)</h3>
                    <p style={{ color: '#008080', fontSize: '13px', margin: '0 0 14px' }}>
                        Only subscribers who pay Rs.30 can see this
                    </p>
                    <label style={labelStyle}>
                        Your Name
                        <input style={inputStyle} name="sellerName" value={form.sellerName} onChange={handleChange} />
                        {fieldErrors.sellerName && <p style={errorTextStyle}>{fieldErrors.sellerName}</p>}
                    </label>
                    <label style={labelStyle}>
                        Your Phone Number
                        <input style={inputStyle} name="sellerContact" value={form.sellerContact} onChange={handleChange}
                            placeholder="10-digit number" />
                        {fieldErrors.sellerContact && <p style={errorTextStyle}>{fieldErrors.sellerContact}</p>}
                    </label>
                </div>

                <button type="submit" disabled={loading} style={{
                    width: '100%', background: loading ? '#aaa' : '#008080', color: 'white',
                    border: 'none', padding: '14px', borderRadius: '8px',
                    fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer',
                    marginBottom: '30px'
                }}>
                    {loading ? 'Posting...' : 'Post Ticket'}
                </button>
            </form>
        </div>
    );
}

export default PostTicketPage;