import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { userId, name, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav style={{
            background: '#008080', padding: '14px 28px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)', position: 'sticky', top: 0, zIndex: 100
        }}>
            <Link to="/" style={{ color: 'white', fontSize: '22px', fontWeight: 'bold' }}>
                🎬 XtraSeats
            </Link>

            <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
                <Link to="/" style={{ color: 'white', fontSize: '15px' }}>Browse</Link>

                <Link to="/post" style={{
                    background: 'white', color: '#008080', padding: '7px 16px',
                    borderRadius: '6px', fontWeight: 'bold', fontSize: '14px'
                }}>
                    Post a Ticket
                </Link>

                {userId ? (
                    <>
                        <span style={{ color: 'white', fontSize: '14px' }}>Hi, {name}</span>
                        <button onClick={handleLogout} style={{
                            background: 'transparent', color: 'white',
                            border: '1px solid white', padding: '6px 14px',
                            borderRadius: '6px', cursor: 'pointer', fontSize: '13px'
                        }}>
                            Logout
                        </button>
                    </>
                ) : (
                    <Link to="/login" style={{
                        color: 'white', fontSize: '15px',
                        border: '1px solid white', padding: '6px 14px', borderRadius: '6px'
                    }}>
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;