// Toast.jsx
// Props:
//   message — text to show
//   type    — 'success' (green) or 'error' (red)
//   onClose — function to call when dismissed

function Toast({ message, type, onClose }) {

    const bgColor = type === 'success' ? '#00994d' : '#cc0000';

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: bgColor,
            color: 'white',
            padding: '14px 20px',
            borderRadius: '8px',
            zIndex: 9999,
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            fontSize: '15px',
            maxWidth: '340px'
        }}>
            <span>{type === 'success' ? '✅' : '❌'} {message}</span>
            <button
                onClick={onClose}
                style={{
                    background: 'none', border: 'none',
                    color: 'white', cursor: 'pointer',
                    fontSize: '18px', lineHeight: 1,
                    padding: 0
                }}>
                
            </button>
        </div>
    );
}

export default Toast;