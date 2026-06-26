export default function Modal({ titulo, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <h5>{titulo}</h5>
          <button className="modal-close" onClick={onClose}>
            <i className="bi bi-x"></i>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
