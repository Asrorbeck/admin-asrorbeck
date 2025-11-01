import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { blogService } from "../../services/blogService";
import ConfirmDialog from "./ConfirmDialog";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    postId: null,
  });

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await blogService.getAll();
    if (error) {
      console.error("Error fetching posts:", error);
      alert("Blog postlarni yuklashda xatolik!");
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
    document.title = "Admin Dashboard - Asrorbek's Blog";
  }, []);

  const handleDeleteClick = (id) => {
    setConfirmDialog({ isOpen: true, postId: id });
  };

  const handleDeleteConfirm = async () => {
    if (confirmDialog.postId) {
      const { error } = await blogService.delete(confirmDialog.postId);
      if (error) {
        alert("O'chirishda xatolik: " + error.message);
      } else {
        await fetchPosts();
      }
      setConfirmDialog({ isOpen: false, postId: null });
    }
  };

  const handleDeleteCancel = () => {
    setConfirmDialog({ isOpen: false, postId: null });
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
    <div className="admin-dashboard">
      <div className="admin-dashboard__wrapper">
        <div className="admin-dashboard__header">
          <h1 className="admin-dashboard__title">Blog Postlar</h1>
          <Link to="/admin/new" className="admin-dashboard__new-btn">
            + Yangi Post
          </Link>
        </div>

        <div className="admin-dashboard__info">
          <span className="admin-dashboard__count">{posts.length} ta post</span>
        </div>

        <div className="admin-dashboard__table-wrapper">
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              Yuklanmoqda...
            </div>
          ) : (
            <table className="admin-dashboard__table">
              <thead>
                <tr>
                  <th>Sarlavha</th>
                  <th>Sana</th>
                  <th className="admin-dashboard__actions-header">Harakatlar</th>
                </tr>
              </thead>
              <tbody>
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center", padding: "40px" }}>
                      Hozircha blog postlar yo'q
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                <tr key={post.id}>
                  <td className="admin-dashboard__title-cell">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="admin-dashboard__title-link"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="admin-dashboard__date-cell">{post.date}</td>
                  <td className="admin-dashboard__actions">
                    <Link
                      to={`/admin/edit/${post.id}`}
                      className="admin-dashboard__action-btn admin-dashboard__action-btn--edit"
                      title="Tahrirlash"
                    >
                      <EditIcon />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(post.id)}
                      className="admin-dashboard__action-btn admin-dashboard__action-btn--delete"
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
        message="Bu blog postni o'chirmoqchimisiz?"
      />
    </div>
  );
};

export default AdminDashboard;
