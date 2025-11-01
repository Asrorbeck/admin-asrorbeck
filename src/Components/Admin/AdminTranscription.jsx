import { useState } from "react";
import { transcriptionService } from "../../services/transcriptionService";
import "./AdminTranscription.css";

const AdminTranscription = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState("");

  // OpenAI API Key - environment variable'dan olinadi
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Faqat audio va video fayllarni qabul qilish
      const validTypes = [
        "audio/mpeg",
        "audio/mp3",
        "audio/wav",
        "audio/m4a",
        "audio/webm",
        "video/mp4",
        "video/mpeg",
        "video/webm",
        "audio/ogg",
      ];

      if (
        validTypes.includes(selectedFile.type) ||
        selectedFile.name.match(/\.(mp3|wav|m4a|mp4|webm|ogg)$/i)
      ) {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        setError("");
      } else {
        setError(
          "Iltimos, faqat audio yoki video fayl yuklang (mp3, wav, m4a, mp4, webm, ogg)"
        );
        setFile(null);
        setFileName("");
      }
    }
  };

  const handleTranscribe = async () => {
    if (!file) {
      setError("Iltimos, avval fayl yuklang");
      return;
    }

    if (!apiKey) {
      setError(
        "OpenAI API key topilmadi. Iltimos, .env faylida REACT_APP_OPENAI_API_KEY qo'shing."
      );
      return;
    }

    setLoading(true);
    setError("");
    setTranscription("");
    setDetectedLanguage("");

    try {
      // Step 1: Whisper orqali transkriptiya
      const openaiResponse = await fetch(
        "https://api.openai.com/v1/audio/transcriptions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
          body: (() => {
            const body = new FormData();
            body.append("file", file);
            body.append("model", "whisper-1");
            return body;
          })(),
        }
      );

      if (!openaiResponse.ok) {
        const errorData = await openaiResponse.json();
        throw new Error(
          errorData.error?.message || "Transkriptiya jarayonida xatolik"
        );
      }

      const whisperData = await openaiResponse.json();
      const transcribedText = whisperData.text;

      // Step 2: GPT-4o-mini orqali tilni aniqlash va to'g'rilash
      const correctionResponse = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "Sen O'zbek, Rus va Ingliz tillaridagi ovozdan transkriptsiya qilingan matnlarni to'g'rilovchi yordamchisan. Whisper modeli ba'zan O'zbekcha so'zlarni fonetik yoki boshqa tillarga o'xshash shaklda yozadi (masalan: 'Əsrar bəkdirsən, Polatıf' o'rniga 'Asrorbek Tursunpulatov'). Sening vazifang: noto'g'ri yozilgan so'zlarni to'g'ri lotin yozuvida yozish (O'zbek uchun lotin, Rus va Ingliz uchun o'z yozuvida). Ruscha yoki inglizcha so'zlar uchrasa, ularni o'z holicha qoldirish. Har qanday grammatik yoki talaffuzdagi xatolarni to'g'rilash. Matnni tilidan qat'iy nazar to'g'ri holatga keltirish. Natijani faqat to'g'rilangan matn shaklida qaytar, izohsiz va qo'shimcha ma'lumotsiz.",
              },
              {
                role: "user",
                content: `Quyidagi matnni to'g'rilab chiq: ${transcribedText}`,
              },
            ],
            temperature: 0.3,
          }),
        }
      );

      if (!correctionResponse.ok) {
        const errorData = await correctionResponse.json();
        throw new Error(errorData.error?.message || "Tilni aniqlashda xatolik");
      }

      const correctionData = await correctionResponse.json();
      const correctedText = correctionData.choices[0].message.content;

      // Step 3: Tilni aniqlash (uz, ru, en)
      const languageDetectionResponse = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "You are a language detector. Identify the language of the text and return ONLY one of these codes: 'uz' for Uzbek, 'ru' for Russian, or 'en' for English.",
              },
              {
                role: "user",
                content: `What language is this text? Return only the language code (uz, ru, or en): ${correctedText}`,
              },
            ],
            temperature: 0.1,
          }),
        }
      );

      let finalLanguage = null;
      if (languageDetectionResponse.ok) {
        const languageData = await languageDetectionResponse.json();
        const language = languageData.choices[0].message.content
          .trim()
          .toLowerCase();

        // Faqat uz, ru, en kodlarni qabul qilish
        if (language === "uz" || language === "ru" || language === "en") {
          finalLanguage = language;
          setDetectedLanguage(language);
        }
      }

      setTranscription(correctedText);

      // Step 4: DB ga saqlash
      try {
        await transcriptionService.create({
          transcription_text: correctedText,
          detected_language: finalLanguage,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
        });
      } catch (dbError) {
        console.error("Database save error:", dbError);
        // DB ga saqlashda xatolik bo'lsa ham transkriptiya natijasi ko'rsatiladi
      }
    } catch (err) {
      setError(err.message || "Transkriptiya jarayonida xatolik yuz berdi");
      console.error("Transcription error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setFileName("");
    setTranscription("");
    setError("");
    setDetectedLanguage("");
    // File input ni reset qilish
    const fileInput = document.getElementById("audio-file-input");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleCopy = () => {
    if (transcription) {
      navigator.clipboard.writeText(transcription);
      alert("Matn ko'chirildi!");
    }
  };

  return (
    <div className="admin-transcription">
      <div className="admin-transcription__header">
        <h2 className="admin-transcription__title">
          Audio/Video Transkriptiya
        </h2>
        <p className="admin-transcription__subtitle">
          Whisper AI yordamida audio va video fayllarni matnga aylantiring
        </p>
      </div>

      <div className="admin-transcription__content">
        <div className="admin-transcription__upload-section">
          <div className="admin-transcription__file-upload">
            <input
              type="file"
              id="audio-file-input"
              accept="audio/*,video/*,.mp3,.wav,.m4a,.mp4,.webm,.ogg"
              onChange={handleFileChange}
              className="admin-transcription__file-input"
            />
            <label
              htmlFor="audio-file-input"
              className="admin-transcription__file-label"
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span>{fileName || "Fayl yuklash"}</span>
              <span className="admin-transcription__file-hint">
                MP3, WAV, M4A, MP4, WEBM yoki OGG
              </span>
            </label>
          </div>

          {fileName && (
            <div className="admin-transcription__file-info">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <span>{fileName}</span>
              <button
                onClick={handleReset}
                className="admin-transcription__remove-btn"
              >
                ✕
              </button>
            </div>
          )}

          {error && <div className="admin-transcription__error">{error}</div>}

          <div className="admin-transcription__actions">
            <button
              onClick={handleTranscribe}
              disabled={!file || loading}
              className="admin-transcription__btn admin-transcription__btn--primary"
            >
              {loading ? (
                <>
                  <svg
                    className="admin-transcription__spinner"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      opacity="0.25"
                    />
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      opacity="0.75"
                    />
                  </svg>
                  Jarayon...
                </>
              ) : (
                <>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  Transkriptiya qilish
                </>
              )}
            </button>
          </div>
        </div>

        {transcription && (
          <div className="admin-transcription__result">
            <div className="admin-transcription__result-header">
              <div className="admin-transcription__result-title-section">
                <h3>Transkriptiya natijasi:</h3>
                {detectedLanguage && (
                  <span className="admin-transcription__language-badge">
                    {detectedLanguage === "uz" && "🇺🇿 O'zbek"}
                    {detectedLanguage === "ru" && "🇷🇺 Rus"}
                    {detectedLanguage === "en" && "🇬🇧 English"}
                  </span>
                )}
              </div>
              <button
                onClick={handleCopy}
                className="admin-transcription__btn admin-transcription__btn--secondary"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Ko'chirish
              </button>
            </div>
            <div className="admin-transcription__result-text">
              {transcription}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTranscription;
