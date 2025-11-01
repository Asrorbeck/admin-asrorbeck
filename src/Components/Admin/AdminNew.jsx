import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { blogService } from "../../services/blogService";
import "./AdminNew.css";

const AdminNew = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  // Auto-generate slug from title
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    // Generate slug from title
    const newSlug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setSlug(newSlug);
  };

  const handleSave = async () => {
    if (!title || !slug || !content) {
      alert("Iltimos, barcha maydonlarni to'ldiring!");
      return;
    }

    setSaving(true);

    const newPost = {
      title,
      slug,
      excerpt: excerpt || null,
      content,
      date: new Date().toISOString().split("T")[0],
      author: "Asrorbek Tursunpulatov",
    };

    const { data, error } = await blogService.create(newPost);

    if (error) {
      alert("Xatolik: " + error.message);
      setSaving(false);
    } else {
      alert("Blog post muvaffaqiyatli saqlandi!");
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
    <div className="admin-new">
      <div className="admin-new__wrapper">
          <div className="admin-new__header">
            <h1 className="admin-new__title">Yangi Blog Qo'shish</h1>
            <button
              onClick={() => navigate("/admin")}
              className="admin-new__back-btn"
            >
              ← Orqaga
            </button>
          </div>

          <div className="admin-new__form">
            <div className="admin-new__field">
              <label className="admin-new__label">Sarlavha *</label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                className="admin-new__input"
                placeholder="Blog post sarlavhasi"
              />
            </div>

            <div className="admin-new__field">
              <label className="admin-new__label">Slug *</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="admin-new__input"
                placeholder="blog-post-slug"
              />
            </div>

            <div className="admin-new__field">
              <label className="admin-new__label">Qisqa Tavsif</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="admin-new__textarea"
                placeholder="Blog post qisqa tavsifi"
                rows="3"
              />
            </div>

            <div className="admin-new__field">
              <label className="admin-new__label">Kontent *</label>
              <div className="admin-new__editor-wrapper">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={quillModules}
                  className="admin-new__editor"
                />
              </div>
            </div>

            <div className="admin-new__actions">
              <button
                onClick={() => navigate("/admin")}
                className="admin-new__btn admin-new__btn--cancel"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="admin-new__btn admin-new__btn--save"
              >
                {saving ? "Saqlanmoqda..." : "Saqlash"}
              </button>
            </div>
          </div>
        </div>
    </div>
  );
};

export default AdminNew;

