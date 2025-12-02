import { useState } from "react";
import { GoogleGenerativeAI } from "@google/genai";

function App() {
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [palette, setPalette] = useState<string[]>([]);
  const [explanation, setExplanation] = useState("");

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  const generatePalette = async () => {
    if (!mood.trim()) return;

    setLoading(true);
    setPalette([]);
    setExplanation("");

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
      });

      const result = await model.generateContent([
        `Generate a cohesive 5-color palette (HEX codes only) with a short aesthetic explanation for the mood: "${mood}". 
        Format response strictly as:
        {
          "colors": ["#HEX", "#HEX", "#HEX", "#HEX", "#HEX"],
          "explanation": "text"
        }
        `
      ]);

      const text = result.response.text();
      const data = JSON.parse(text);

      setPalette(data.colors || []);
      setExplanation(data.explanation || "");

    } catch (err) {
      console.error(err);
      alert("Error generating palette");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Smart Color Palette Generator 🎨</h1>

      <input
        style={styles.input}
        placeholder="Masukkan mood... (contoh: cozy, bold, dreamy)"
        value={mood}
        onChange={(e) => setMood(e.target.value)}
      />

      <button style={styles.button} onClick={generatePalette} disabled={loading}>
        {loading ? "Generating..." : "Generate Palette"}
      </button>

      {palette.length > 0 && (
        <div style={styles.paletteBox}>
          <h2 style={styles.sectionTitle}>Generated Palette:</h2>

          <div style={styles.colorsRow}>
            {palette.map((color, idx) => (
              <div key={idx} style={{ ...styles.colorBlock, backgroundColor: color }}>
                <span style={styles.colorHex}>{color}</span>
              </div>
            ))}
          </div>

          <p style={styles.explanation}>{explanation}</p>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: "40px",
    fontFamily: "Inter, sans-serif",
    maxWidth: "800px",
    margin: "0 auto",
    textAlign: "center",
  },
  title: {
    fontSize: "32px",
    fontWeight: 700,
  },
  input: {
    padding: "12px 16px",
    width: "70%",
    borderRadius: "10px",
    border: "1px solid #ccc",
    marginTop: "20px",
    fontSize: "16px",
  },
  button: {
    marginTop: "20px",
    padding: "12px 20px",
    background: "black",
    color: "white",
    borderRadius: "10px",
    fontSize: "16px",
    cursor: "pointer",
  },
  paletteBox: {
    marginTop: "40px",
    textAlign: "left",
  },
  sectionTitle: {
    fontSize: "22px",
    marginBottom: "10px",
    fontWeight: 600,
  },
  colorsRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
  },
  colorBlock: {
    flex: 1,
    height: "80px",
    borderRadius: "10px",
    position: "relative",
  },
  colorHex: {
    position: "absolute",
    bottom: "8px",
    left: "8px",
    background: "rgba(255,255,255,0.8)",
    padding: "4px 6px",
    borderRadius: "6px",
    fontSize: "12px",
  },
  explanation: {
    fontSize: "16px",
    lineHeight: "1.6",
    opacity: 0.9,
  },
};

export default App;
