import "./ConfirmDialog.css";

const ConfirmDialog = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-dialog__overlay" onClick={onClose}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <p className="confirm-dialog__message">{message}</p>
        <div className="confirm-dialog__actions">
          <button
            onClick={onClose}
            className="confirm-dialog__btn confirm-dialog__btn--cancel"
          >
            Bekor qilish
          </button>
          <button
            onClick={onConfirm}
            className="confirm-dialog__btn confirm-dialog__btn--confirm"
          >
            Tasdiqlash
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

