import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import TShirt from "./tshirt";
import "./styles.css"; // ✅ Import external CSS

function App() {
  const [webhookURL, setWebhookURL] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");

  // ✅ Load T-shirt settings from URL when app starts
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const savedColor = params.get("color");
    if (savedColor) setColor(`#${savedColor}`);

    fetch("/config.json")
      .then((response) => response.json())
      .then((config) => setWebhookURL(config.ZAPIER_WEBHOOK_URL))
      .catch((error) => console.error("Error loading config.json:", error));
  }, []);

  // ✅ Generate a shareable link containing the model settings
  const generateShareableLink = () => {
    const url = `${window.location.origin}?color=${color.replace("#", "")}`;
    navigator.clipboard.writeText(url).then(() => {
      alert("Shareable link copied to clipboard!");
    });
  };

  // ✅ Open & Close Modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setEmail("");
  };

  // ✅ Send Design to Zapier with Model Settings
  const sendToZapier = async () => {
    if (!webhookURL) return alert("Webhook URL is missing!");
    if (!email) return alert("Please enter an email!");

    try {
      const response = await fetch(webhookURL, {
        method: "POST",
        body: JSON.stringify({
          email,
          settings: { color },
          shareable_link: `${window.location.origin}?color=${color.replace("#", "")}`,
        }),
      });

      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

      alert("Design sent! Check your email.");
      closeModal();
    } catch (error) {
      console.error("Webhook request failed:", error);
      alert(`Failed to send design: ${error.message}`);
    }
  };

  return (
    <div className="app-container">
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 1.5, 2.5], fov: 35 }}>
          <ambientLight intensity={2} />
          <directionalLight position={[1, 3, 2]} intensity={1.5} />
          <OrbitControls minDistance={1.8} maxDistance={4} />
          <TShirt color={color} scale={[3, 3, 3]} position={[0, -0.3, 0]} />
        </Canvas>
      </div>


      {/* ✅ Toolbar - Canva-Style */}
      <div className="toolbar">
        <label>Color:</label>
        <input type="color" className="color-picker" value={color} onChange={(e) => setColor(e.target.value)} />
        <button className="btn-primary" onClick={openModal}>Email Me the Design</button>
        <button className="btn-secondary" onClick={generateShareableLink}>Copy Shareable Link</button>
      </div>

      {/* ✅ Email Modal (Now Centered with Dark Background) */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Enter Your Email</h3>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
            <div className="modal-buttons">
              <button className="btn-primary" onClick={sendToZapier}>Send Design</button>
              <button className="btn-cancel" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Floating GitHub Button with Icon */}
      <a 
        href="https://github.com/daraghkinvara/3d-fashion-designer" 
        target="_blank" 
        rel="noopener noreferrer"
        className="github-button"
      >
        <img src="/github-icon.png" alt="GitHub" className="github-icon" />
        View on GitHub
      </a>
    </div>
  );
}

export default App;
