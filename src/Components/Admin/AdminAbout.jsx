import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { aboutService } from "../../services/aboutService";
import "./AdminAbout.css";

const AdminAbout = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      const { data, error } = await aboutService.get();
      if (error) {
        console.error("Error fetching about:", error);
        setContent("<p>Men haqimda ma'lumotlar...</p>");
      } else {
        setContent(data?.content || "<p>Men haqimda ma'lumotlar...</p>");
      }
      setLoading(false);
      document.title = "Men Haqimda Tahrirlash - Admin";
    };
    fetchAbout();
  }, []);

  const handleSave = async () => {
    if (!content.trim()) {
      alert("Iltimos, kontent kiriting!");
      return;
    }

    setSaving(true);

    const { error } = await aboutService.update(content);

    if (error) {
      alert("Xatolik: " + error.message);
      setSaving(false);
    } else {
      alert("Muvaffaqiyatli saqlandi!");
      navigate("/admin");
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      ["link", "image"],
      ["blockquote", "code-block"],
      [{ align: [] }],
      ["clean"],
    ],
  };

  return (
    <div className="admin-about">
      <div className="admin-about__wrapper">
        <div className="admin-about__header">
          <h1 className="admin-about__title">Men Haqimda Tahrirlash</h1>
          <button
            onClick={() => navigate("/admin")}
            className="admin-about__back-btn"
          >
            ← Orqaga
          </button>
        </div>

          <div className="admin-about__form">
            {loading ? (
              <div style={{ textAlign: "center", padding: "100px 20px" }}>
                Yuklanmoqda...
              </div>
            ) : (
              <div className="admin-about__field">
                <label className="admin-about__label">Kontent *</label>
                <div className="admin-about__editor-wrapper">
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={quillModules}
                    className="admin-about__editor"
                  />
                </div>
              </div>
            )}

            {!loading && (
              <div className="admin-about__actions">
                <button
                  onClick={() => navigate("/admin")}
                  className="admin-about__btn admin-about__btn--cancel"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="admin-about__btn admin-about__btn--save"
                >
                  {saving ? "Saqlanmoqda..." : "Saqlash"}
                </button>
              </div>
            )}
          </div>
      </div>
    </div>
  );
};

export default AdminAbout;

