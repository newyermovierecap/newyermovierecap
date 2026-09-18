import { useState } from "react";

export default function Home() {
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    if (!transcript.trim()) {
      alert("Movie Transcript ထည့်ပါ။");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ transcript })
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        alert(data.error || "Error ဖြစ်နေပါတယ်။");
        return;
      }

      setResult(data);
    } catch (error) {
      alert("Internet သို့မဟုတ် Server Error ဖြစ်နေပါတယ်။");
    } finally {
      setLoading(false);
    }
  };

  const downloadSRT = () => {
    if (!result?.srt_subtitles) return;

    const file = new Blob(
      [result.srt_subtitles],
      { type: "text/plain;charset=utf-8" }
    );

    const url = URL.createObjectURL(file);
    const element = document.createElement("a");

    element.href = url;
    element.download = "new-yer-recap.srt";
    element.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        padding: "16px",
        fontFamily: "sans-serif",
        maxWidth: "600px",
        margin: "0 auto"
      }}
    >
      <h2 style={{ textAlign: "center" }}>
        🎬 New Yer AI Movie Recap
      </h2>

      <textarea
        rows="10"
        style={{
          width: "100%",
          padding: "12px",
          boxSizing: "border-box",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
        placeholder="Movie Transcript ကို ဒီမှာ Paste လုပ်ပါ..."
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
      />

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          width: "100%",
          marginTop: "12px",
          padding: "14px",
          border: "none",
          borderRadius: "8px",
          background: "#2563eb",
          color: "white",
          fontSize: "16px",
          fontWeight: "bold"
        }}
      >
        {loading
          ? "🤖 AI က Recap ရေးနေပါတယ်..."
          : "✨ Recap ထုတ်မယ်"}
      </button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>မြန်မာ Movie Recap</h3>

          <div
            style={{
              background: "#f3f4f6",
              padding: "12px",
              borderRadius: "8px",
              whiteSpace: "pre-wrap"
            }}
          >
            {result.recap_script}
          </div>

          <button
            onClick={downloadSRT}
            style={{
              width: "100%",
              marginTop: "12px",
              padding: "12px",
              border: "none",
              borderRadius: "8px",
              background: "#10b981",
              color: "white",
              fontWeight: "bold"
            }}
          >
            📥 SRT Subtitle Download
          </button>
        </div>
      )}
    </div>
  );
}
