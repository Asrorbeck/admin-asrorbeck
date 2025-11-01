import { useState, useEffect } from "react";
import { transcriptionService } from "../../services/transcriptionService";
import ConfirmDialog from "./ConfirmDialog";
import "./AdminTranscriptionHistory.css";

const AdminTranscriptionHistory = () => {
  const [transcriptions, setTranscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    id: null,
  });

  const fetchTranscriptions = async () => {
    setLoading(true);
    const { data, error } = await transcriptionService.getAll();
    if (error) {
      console.error("Error fetching transcriptions:", error);
      alert("Transkriptiya tarixini yuklashda xatolik!");
    } else {
      setTranscriptions(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTranscriptions();
    document.title = "Transkriptiya Tarixi - Admin Panel";
  }, []);

  const handleDeleteClick = (id) => {
    setConfirmDialog({ isOpen: true, id });
  };

  const handleDeleteConfirm = async () => {
    if (confirmDialog.id) {
      const { error } = await transcriptionService.delete(confirmDialog.id);
      if (error) {
        alert("O'chirishda xatolik: " + error.message);
      } else {
        await fetchTranscriptions();
      }
      setConfirmDialog({ isOpen: false, id: null });
    }
  };

  const handleDeleteCancel = () => {
    setConfirmDialog({ isOpen: false, id: null });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "-";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getLanguageLabel = (lang) => {
    if (!lang) return "-";
    const labels = {
      uz: "🇺🇿 O'zbek",
      ru: "🇷🇺 Rus",
      en: "🇬🇧 English",
    };
    return labels[lang] || lang.toUpperCase();
  };

  const getPreviewText = (text) => {
    if (!text) return "";
    if (text.length <= 100) return text;
    return text.substring(0, 100) + "...";
  };

  const DeleteIcon = () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );

  return (
    <div className="admin-transcription-history">
      <div className="admin-transcription-history__wrapper">
        <div className="admin-transcription-history__header">
          <h1 className="admin-transcription-history__title">
            Transkriptiya Tarixi
          </h1>
          <div className="admin-transcription-history__info">
            <span className="admin-transcription-history__count">
              {transcriptions.length} ta transkriptiya
            </span>
          </div>
        </div>

        <div className="admin-transcription-history__table-wrapper">
          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: "#666",
              }}
            >
              Yuklanmoqda...
            </div>
          ) : (
            <table className="admin-transcription-history__table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Matn</th>
                  <th>Til</th>
                  <th>Fayl</th>
                  <th>O'lcham</th>
                  <th>Sana</th>
                  <th className="admin-transcription-history__actions-header">
                    Harakatlar
                  </th>
                </tr>
              </thead>
              <tbody>
                {transcriptions.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      style={{ textAlign: "center", padding: "40px" }}
                    >
                      Hozircha transkriptiya tarixi yo'q
                    </td>
                  </tr>
                ) : (
                  transcriptions.map((item) => (
                    <tr key={item.id}>
                      <td className="admin-transcription-history__id-cell">
                        #{item.id}
                      </td>
                      <td className="admin-transcription-history__text-cell">
                        <div className="admin-transcription-history__text-preview">
                          {getPreviewText(item.transcription_text)}
                        </div>
                      </td>
                      <td className="admin-transcription-history__lang-cell">
                        <span className="admin-transcription-history__lang-badge">
                          {getLanguageLabel(item.detected_language)}
                        </span>
                      </td>
                      <td className="admin-transcription-history__file-cell">
                        {item.file_name}
                      </td>
                      <td className="admin-transcription-history__size-cell">
                        {formatFileSize(item.file_size)}
                      </td>
                      <td className="admin-transcription-history__date-cell">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="admin-transcription-history__actions">
                        <button
                          onClick={() => handleDeleteClick(item.id)}
                          className="admin-transcription-history__action-btn admin-transcription-history__action-btn--delete"
                          title="O'chirish"
                        >
                          <DeleteIcon />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        message="Bu transkriptiyani o'chirmoqchimisiz?"
      />
    </div>
  );
};

export default AdminTranscriptionHistory;

