import { useNavigate } from 'react-router-dom';

function TicketCard({ ticket }) {
    const navigate = useNavigate();

    return (
        <div style={{
            background: 'white', borderRadius: '12px', overflow: 'hidden',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)', border: '1px solid #e8e8e8',
            transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer'
        }}
        onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
        }}
        onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)';
        }}
        >
            <div style={{ background: '#008080', height: '7px' }} />

            <div style={{ padding: '16px' }}>
                <span style={{
                    background: '#e0f7f7', color: '#008080',
                    padding: '3px 10px', borderRadius: '12px',
                    fontSize: '11px', fontWeight: 'bold'
                }}>
                    🎬 MOVIE
                </span>

                <h3 style={{ margin: '10px 0 6px', fontSize: '17px', color: '#111' }}>
                    {ticket.movieName}
                </h3>

                {/* ★ NEW — city shown right under the title */}
                <p style={{ margin: '3px 0', color: '#008080', fontSize: '13px', fontWeight: '600' }}>
                    📍 {ticket.city}
                </p>

                <p style={{ margin: '3px 0', color: '#666', fontSize: '13px' }}>
                    🏛 {ticket.theatreName}
                </p>
                <p style={{ margin: '3px 0', color: '#666', fontSize: '13px' }}>
                    🗣 {ticket.language} &nbsp;|&nbsp; 📽 {ticket.screenFormat}
                </p>
                <p style={{ margin: '3px 0', color: '#666', fontSize: '13px' }}>
                    📅 {ticket.showDate} · {ticket.showTime}
                </p>
                <p style={{ margin: '3px 0', color: '#666', fontSize: '13px' }}>
                    💺 {ticket.seatNumbers} &nbsp;({ticket.ticketCount} seat/s)
                </p>

                <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginTop: '14px'
                }}>
                    <span style={{
                        background: '#008080', color: 'white',
                        padding: '5px 12px', borderRadius: '6px',
                        fontWeight: 'bold', fontSize: '14px'
                    }}>
                        Rs. {ticket.pricePerSeat}/seat
                    </span>

                    <button
                        onClick={() => navigate(`/tickets/${ticket.id}`)}
                        style={{
                            background: 'transparent', color: '#008080',
                            border: '2px solid #008080', padding: '5px 14px',
                            borderRadius: '6px', cursor: 'pointer',
                            fontWeight: 'bold', fontSize: '13px'
                        }}
                    >
                        View →
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TicketCard;