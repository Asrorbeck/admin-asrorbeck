import { useState, useEffect } from "react";
import { navigationService } from "../../services/navigationService";
import ConfirmDialog from "./ConfirmDialog";
import "./AdminNavigation.css";

const AdminNavigation = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    label: "",
    url: "",
    target_blank: false,
    is_external: true,
    order_index: 0,
    is_active: true,
  });
  const [showForm, setShowForm] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    itemId: null,
  });

  useEffect(() => {
    fetchItems();
    document.title = "Navigation - Admin";
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await navigationService.getAllForAdmin();
    if (error) {
      console.error("Error fetching navigation items:", error);
      alert("Navigation itemlarni yuklashda xatolik!");
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      label: "",
      url: "",
      target_blank: false,
      is_external: true,
      order_index: items.length + 1,
      is_active: true,
    });
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      label: item.label,
      url: item.url,
      target_blank: item.target_blank || false,
      is_external: item.is_external !== false,
      order_index: item.order_index || 0,
      is_active: item.is_active !== false,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.label.trim() || !formData.url.trim()) {
      alert("Iltimos, Label va URL ni to'ldiring!");
      return;
    }

    if (editingId) {
      const { error } = await navigationService.update(editingId, {
        ...formData,
        order_index: parseInt(formData.order_index),
      });
      if (error) {
        alert("Xatolik: " + error.message);
      } else {
        alert("Muvaffaqiyatli yangilandi!");
        setShowForm(false);
        fetchItems();
      }
    } else {
      const { error } = await navigationService.create({
        ...formData,
        order_index: parseInt(formData.order_index),
      });
      if (error) {
        alert("Xatolik: " + error.message);
      } else {
        alert("Muvaffaqiyatli qo'shildi!");
        setShowForm(false);
        fetchItems();
      }
    }
  };

  const handleDeleteClick = (id) => {
    setConfirmDialog({ isOpen: true, itemId: id });
  };

  const handleDeleteConfirm = async () => {
    if (confirmDialog.itemId) {
      const { error } = await navigationService.delete(confirmDialog.itemId);
      if (error) {
        alert("O'chirishda xatolik: " + error.message);
      } else {
        await fetchItems();
      }
      setConfirmDialog({ isOpen: false, itemId: null });
    }
  };

  const handleDeleteCancel = () => {
    setConfirmDialog({ isOpen: false, itemId: null });
  };

  const EditIcon = () => (
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
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );

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
    <div className="admin-navigation">
      <div className="admin-navigation__wrapper">
        <div className="admin-navigation__header">
          <h1 className="admin-navigation__title">Navigation Menu</h1>
          <button onClick={handleAddNew} className="admin-navigation__new-btn">
            + Yangi Item
          </button>
        </div>

        {showForm && (
          <div className="admin-navigation__form">
            <h2 className="admin-navigation__form-title">
              {editingId ? "Tahrirlash" : "Yangi Item"}
            </h2>
            <div className="admin-navigation__field">
              <label className="admin-navigation__label">Label *</label>
              <input
                type="text"
                name="label"
                value={formData.label}
                onChange={handleChange}
                className="admin-navigation__input"
                placeholder="Masalan: Blog, About, Home"
              />
            </div>
            <div className="admin-navigation__field">
              <label className="admin-navigation__label">URL *</label>
              <input
                type="text"
                name="url"
                value={formData.url}
                onChange={handleChange}
                className="admin-navigation__input"
                placeholder="/blog yoki https://example.com"
              />
            </div>
            <div className="admin-navigation__field">
              <label className="admin-navigation__label">Tartib raqami</label>
              <input
                type="number"
                name="order_index"
                value={formData.order_index}
                onChange={handleChange}
                className="admin-navigation__input"
                placeholder="0"
              />
            </div>
            <div className="admin-navigation__field">
              <label className="admin-navigation__checkbox-label">
                <input
                  type="checkbox"
                  name="is_external"
                  checked={formData.is_external}
                  onChange={handleChange}
                  className="admin-navigation__checkbox"
                />
                <span>Tashqi link (external)</span>
              </label>
            </div>
            <div className="admin-navigation__field">
              <label className="admin-navigation__checkbox-label">
                <input
                  type="checkbox"
                  name="target_blank"
                  checked={formData.target_blank}
                  onChange={handleChange}
                  className="admin-navigation__checkbox"
                />
                <span>Yangi tabda ochish</span>
              </label>
            </div>
            <div className="admin-navigation__field">
              <label className="admin-navigation__checkbox-label">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="admin-navigation__checkbox"
                />
                <span>Faol (ko'rsatish)</span>
              </label>
            </div>
            <div className="admin-navigation__form-actions">
              <button
                onClick={() => setShowForm(false)}
                className="admin-navigation__btn admin-navigation__btn--cancel"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSave}
                className="admin-navigation__btn admin-navigation__btn--save"
              >
                {editingId ? "Yangilash" : "Qo'shish"}
              </button>
            </div>
          </div>
        )}

        <div className="admin-navigation__list">
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              Yuklanmoqda...
            </div>
          ) : items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              Hozircha navigation itemlar yo'q
            </div>
          ) : (
            <table className="admin-navigation__table">
              <thead>
                <tr>
                  <th>Label</th>
                  <th>URL</th>
                  <th>Tartib</th>
                  <th>Holat</th>
                  <th className="admin-navigation__actions-header">Harakatlar</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="admin-navigation__label-cell">{item.label}</td>
                    <td className="admin-navigation__url-cell">{item.url}</td>
                    <td className="admin-navigation__order-cell">{item.order_index}</td>
                    <td className="admin-navigation__status-cell">
                      <span
                        className={`admin-navigation__status ${
                          item.is_active
                            ? "admin-navigation__status--active"
                            : "admin-navigation__status--inactive"
                        }`}
                      >
                        {item.is_active ? "Faol" : "Nofaol"}
                      </span>
                    </td>
                    <td className="admin-navigation__actions">
                      <button
                        onClick={() => handleEdit(item)}
                        className="admin-navigation__action-btn admin-navigation__action-btn--edit"
                        title="Tahrirlash"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item.id)}
                        className="admin-navigation__action-btn admin-navigation__action-btn--delete"
                        title="O'chirish"
                      >
                        <DeleteIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        message="Bu navigation itemni o'chirmoqchimisiz?"
      />
    </div>
  );
};

export default AdminNavigation;

