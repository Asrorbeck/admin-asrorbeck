import { useState, useEffect } from "react";
import { settingsService } from "../../services/settingsService";
import "./AdminSettings.css";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    site_name: "Asrorbek's Blog",
    hero_body_text: "Exploring life's wonders, one story at a time.",
    author_name: "Asrorbek Tursunpulatov",
    job_title: "Software Engineer",
    email: "asrorbek@example.com",
    youtube_url: "https://www.youtube.com/@asrorbektursunpulatov9833",
    github_url: "https://github.com/Asrorbeck",
    linkedin_url: "https://www.linkedin.com/in/asrorbek-tursunpulatov/",
    telegram_url: "https://t.me/Asrorbek_10",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await settingsService.get();
      if (error) {
        console.error("Error fetching settings:", error);
      } else if (data) {
        setSettings({
          site_name: data.site_name || "Asrorbek's Blog",
          hero_body_text:
            data.hero_body_text ||
            "Exploring life's wonders, one story at a time.",
          author_name: data.author_name || "Asrorbek Tursunpulatov",
          job_title: data.job_title || "Software Engineer",
          email: data.email || "asrorbek@example.com",
          youtube_url:
            data.youtube_url ||
            "https://www.youtube.com/@asrorbektursunpulatov9833",
          github_url: data.github_url || "https://github.com/Asrorbeck",
          linkedin_url:
            data.linkedin_url ||
            "https://www.linkedin.com/in/asrorbek-tursunpulatov/",
          telegram_url: data.telegram_url || "https://t.me/Asrorbek_10",
        });
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const { error } = await settingsService.update(settings);
    if (error) {
      alert("Xatolik: " + error.message);
    } else {
      alert("Sozlamalar muvaffaqiyatli saqlandi!");
    }
  };

  return (
    <div className="admin-settings">
      <div className="admin-settings__wrapper">
        <div className="admin-settings__header">
          <h1 className="admin-settings__title">Sozlamalar</h1>
        </div>

        <div className="admin-settings__content">
          <div className="admin-settings__section">
            <h2 className="admin-settings__section-title">Sayt Ma'lumotlari</h2>

            <div className="admin-settings__field">
              <label className="admin-settings__label">Sayt Nomi</label>
              <input
                type="text"
                name="site_name"
                value={settings.site_name}
                onChange={handleChange}
                className="admin-settings__input"
              />
            </div>

            <div className="admin-settings__field">
              <label className="admin-settings__label">Sayt Matni</label>
              <textarea
                name="hero_body_text"
                value={settings.hero_body_text}
                onChange={handleChange}
                className="admin-settings__textarea"
                rows="3"
                placeholder="Hero sahifasidagi asosiy matn"
              />
            </div>
          </div>

          <div className="admin-settings__section">
            <h2 className="admin-settings__section-title">
              Muallif Ma'lumotlari
            </h2>

            <div className="admin-settings__field">
              <label className="admin-settings__label">Muallif Ismi</label>
              <input
                type="text"
                name="author_name"
                value={settings.author_name}
                onChange={handleChange}
                className="admin-settings__input"
                placeholder="Asrorbek Tursunpulatov"
              />
            </div>

            <div className="admin-settings__field">
              <label className="admin-settings__label">Lavozim</label>
              <input
                type="text"
                name="job_title"
                value={settings.job_title}
                onChange={handleChange}
                className="admin-settings__input"
                placeholder="Software Engineer"
              />
            </div>
          </div>

          <div className="admin-settings__section">
            <h2 className="admin-settings__section-title">
              Ijtimoiy Tarmoqlar
            </h2>

            <div className="admin-settings__field">
              <label className="admin-settings__label">YouTube URL</label>
              <input
                type="url"
                name="youtube_url"
                value={settings.youtube_url}
                onChange={handleChange}
                className="admin-settings__input"
                placeholder="https://www.youtube.com/@..."
              />
            </div>

            <div className="admin-settings__field">
              <label className="admin-settings__label">GitHub URL</label>
              <input
                type="url"
                name="github_url"
                value={settings.github_url}
                onChange={handleChange}
                className="admin-settings__input"
                placeholder="https://github.com/..."
              />
            </div>

            <div className="admin-settings__field">
              <label className="admin-settings__label">LinkedIn URL</label>
              <input
                type="url"
                name="linkedin_url"
                value={settings.linkedin_url}
                onChange={handleChange}
                className="admin-settings__input"
                placeholder="https://www.linkedin.com/in/..."
              />
            </div>

            <div className="admin-settings__field">
              <label className="admin-settings__label">Telegram URL</label>
              <input
                type="url"
                name="telegram_url"
                value={settings.telegram_url}
                onChange={handleChange}
                className="admin-settings__input"
                placeholder="https://t.me/..."
              />
            </div>
          </div>

          {!loading && (
            <div className="admin-settings__actions">
              <button onClick={handleSave} className="admin-settings__save-btn">
                Saqlash
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
