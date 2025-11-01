import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { blogService } from "../../services/blogService";
import "./AdminEdit.css";

const AdminEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await blogService.getById(parseInt(id));
      if (error || !data) {
        alert("Blog post topilmadi!");
        navigate("/admin");
        return;
      }

      setTitle(data.title);
      setSlug(data.slug);
      setExcerpt(data.excerpt || "");
      setContent(data.content || "");
      document.title = `Tahrirlash: ${data.title} - Admin`;
      setLoading(false);
    };
    fetchPost();
  }, [id, navigate]);

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    // Auto-generate slug if slug is empty or same as original
    if (!slug) {
      const newSlug = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSlug(newSlug);
    }
  };

  const handleSave = async () => {
    if (!title || !slug || !content) {
      alert("Iltimos, barcha maydonlarni to'ldiring!");
      return;
    }

    setSaving(true);

    const updates = {
      title,
      slug,
      excerpt: excerpt || null,
      content,
    };

    const { error } = await blogService.update(parseInt(id), updates);

    if (error) {
      alert("Xatolik: " + error.message);
      setSaving(false);
    } else {
      alert("Blog post muvaffaqiyatli yangilandi!");
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

  if (loading) {
    return (
      <div className="admin-edit">
        <div className="admin-edit__loading">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="admin-edit">
      <div className="admin-edit__wrapper">
          <div className="admin-edit__header">
            <h1 className="admin-edit__title">Blog Postni Tahrirlash</h1>
            <button
              onClick={() => navigate("/admin")}
              className="admin-edit__back-btn"
            >
              ← Orqaga
            </button>
          </div>

          <div className="admin-edit__form">
            <div className="admin-edit__field">
              <label className="admin-edit__label">Sarlavha *</label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                className="admin-edit__input"
                placeholder="Blog post sarlavhasi"
              />
            </div>

            <div className="admin-edit__field">
              <label className="admin-edit__label">Slug *</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="admin-edit__input"
                placeholder="blog-post-slug"
              />
            </div>

            <div className="admin-edit__field">
              <label className="admin-edit__label">Qisqa Tavsif</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="admin-edit__textarea"
                placeholder="Blog post qisqa tavsifi"
                rows="3"
              />
            </div>

            <div className="admin-edit__field">
              <label className="admin-edit__label">Kontent *</label>
              <div className="admin-edit__editor-wrapper">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={quillModules}
                  className="admin-edit__editor"
                />
              </div>
            </div>

            <div className="admin-edit__actions">
              <button
                onClick={() => navigate("/admin")}
                className="admin-edit__btn admin-edit__btn--cancel"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="admin-edit__btn admin-edit__btn--save"
              >
                {saving ? "Yangilanmoqda..." : "Yangilash"}
              </button>
            </div>
          </div>
        </div>
    </div>
  );
};

export default AdminEdit;

