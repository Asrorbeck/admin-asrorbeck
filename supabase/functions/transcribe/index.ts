import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

interface TranscriptionRequest {
  audioData: string; // base64 encoded audio file
  fileName: string;
  fileType: string;
}

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
  };

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
      status: 200,
    });
  }

  try {
    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }

    let requestData: TranscriptionRequest;
    try {
      requestData = await req.json();
    } catch (parseError) {
      throw new Error("Invalid JSON request: " + (parseError as Error).message);
    }

    const { audioData, fileName, fileType } = requestData;

    if (!audioData) {
      throw new Error("Audio data is required");
    }

    if (!fileName) {
      throw new Error("File name is required");
    }

    if (!fileType) {
      throw new Error("File type is required");
    }

    // Step 1: Whisper orqali transkriptiya
    // Base64 ni Uint8Array ga o'girish
    let binaryString: string;
    try {
      binaryString = atob(audioData);
    } catch (decodeError) {
      throw new Error(
        "Invalid base64 audio data: " + (decodeError as Error).message
      );
    }

    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const audioBlob = new Blob([bytes], { type: fileType });

    const formData = new FormData();
    // Deno'da FormData.append() 2 parametr qabul qiladi (key, value)
    // OpenAI API file'ni Blob sifatida qabul qiladi
    formData.append("file", audioBlob);
    formData.append("model", "whisper-1");
    formData.append("language", "uz"); // O'zbek tilini hint sifatida beramiz

    const whisperResponse = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: formData,
      }
    );

    if (!whisperResponse.ok) {
      const errorData = await whisperResponse.json();
      throw new Error(errorData.error?.message || "Transcription failed");
    }

    const whisperData = await whisperResponse.json();
    const transcribedText = whisperData.text;

    // Step 2: GPT-4o-mini orqali tilni aniqlash va to'g'rilash
    const correctionResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "Siz O'zbek, Rus va Ingliz tillaridagi audio transkriptsiya natijalarini to'g'rilovchi mutaxassissiz. MUHIM: Agar matn qozoqcha kirill alifboda yozilgan bo'lsa, uni to'liq O'ZBEKCHA LOTIN alifbosiga o'girish kerak.\n\nMUHIM MISOL:\nINPUT: 'Бүгінгі бақты чемпионликке болған қаракет Вашақт Майдандығы айынчыларды еміз. Көп рақсызды қарынды.'\nOUTPUT: 'Bugungi baxtli chempionlikka bo'lgan harakat vaqti maydonlarida ayni chilar emiz. Ko'p raqsizdi qarindi.'\n\nYOKI:\nINPUT: 'Бүгінгі бақты чемпионликке болған қаракет'\nOUTPUT: 'Bugungi baxtli chempionlikka bo'lgan harakat'\n\nBOSHQA MISOLLAR:\n1. 'Esrar bekdirsiz, Polatuf' → 'Asrorbek Tursunpulatov'\n2. 'Esrar' → 'Asrorbek'\n3. 'bekdirsiz' → 'Tursunpulatov'\n4. 'Polatuf' → 'Tursunpulatov'\n\nVAZIFANG:\n1. Agar matn qozoqcha kirill alifboda bo'lsa, uni o'zbekcha lotin alifbosiga o'girish\n2. Fonetik xatolarni to'g'rilash\n3. Faqat o'zbekcha lotin alifboda matn qaytarish\n4. Hech qanday izoh yo'q, faqat to'g'rilangan matn",
            },
            {
              role: "user",
              content: `Quyidagi matnni to'g'rilab chiq va faqat to'g'rilangan matnni qaytar:\n\n${transcribedText}`,
            },
          ],
          temperature: 0.1,
        }),
      }
    );

    if (!correctionResponse.ok) {
      const errorData = await correctionResponse.json();
      throw new Error(errorData.error?.message || "Correction failed");
    }

    const correctionData = await correctionResponse.json();
    const correctedText = correctionData.choices[0].message.content;

    // Step 3: Tilni aniqlash (faqat uz, ru, en)
    const languageDetectionResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "Siz til aniqlovchi mutaxassissiz. Matnni tahlil qiling va faqat quyidagi 3 ta tildan birini qaytaring: 'uz' (O'zbek), 'ru' (Rus), yoki 'en' (Ingliz).\n\nMUHIM QOIDALAR:\n- Faqat 'uz', 'ru', yoki 'en' qaytaring\n- Qozoqcha, Qirg'izcha yoki boshqa tillarni 'uz' (O'zbek) deb tanlang, chunki ular O'zbek tiliga o'xshash\n- Ruscha matn uchun 'ru'\n- Inglizcha matn uchun 'en'\n- Hech qachon boshqa til kodlarini qaytarmang\n- Faqat bitta kod qaytaring, izohsiz",
            },
            {
              role: "user",
              content: `Quyidagi matn qaysi tilda? Faqat bitta kod qaytaring (uz, ru, yoki en):\n\n${correctedText}`,
            },
          ],
          temperature: 0.1,
        }),
      }
    );

    let detectedLanguage: string | null = null;
    if (languageDetectionResponse.ok) {
      const languageData = await languageDetectionResponse.json();
      let language = languageData.choices[0].message.content
        .trim()
        .toLowerCase();

      // Faqat uz, ru, en qabul qilish
      if (language === "uz" || language === "ru" || language === "en") {
        detectedLanguage = language;
      } else {
        // Agar boshqa til kodlari kelsa, qozoqcha/kirgizcha kabi tillar uchun 'uz' deb belgilash
        // chunki ular O'zbek tiliga yaqin
        const turkicLanguages = ["kk", "ky", "tk", "az", "tr"]; // Qozoq, Qirg'iz, Turkman, Ozarbayjon, Turk
        if (
          turkicLanguages.includes(language) ||
          language.includes("kaza") ||
          language.includes("qozoq") ||
          language.includes("kirgiz")
        ) {
          detectedLanguage = "uz";
        } else {
          // Boshqa tillar uchun default 'uz'
          detectedLanguage = "uz";
        }
      }
    } else {
      // Xatolik bo'lsa, default 'uz'
      detectedLanguage = "uz";
    }

    // Agar hali ham null bo'lsa, default 'uz'
    if (!detectedLanguage) {
      detectedLanguage = "uz";
    }

    return new Response(
      JSON.stringify({
        success: true,
        transcription: correctedText,
        detectedLanguage,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Edge Function error:", error);
    const errorMessage =
      error?.message || error?.toString() || "Transcription failed";
    console.error("Error message:", errorMessage);

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
