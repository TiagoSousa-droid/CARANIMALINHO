import { useRef, useState, useEffect } from "react";

export default function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [photo, setPhoto] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🎥 iniciar câmara
  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.log("Erro na câmara:", err);
      }
    }

    startCamera();
  }, []);

  // 📸 tirar foto
  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const width = video.videoWidth;
    const height = video.videoHeight;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, width, height);

    const image = canvas.toDataURL("image/png");
    setPhoto(image);
  };

  // 🤖 enviar para IA
  const sendToAI = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: photo }),
      });

      const data = await res.json();
      setResult(data.generatedImage);
    } catch (err) {
      console.log("Erro IA:", err);
    }

    setLoading(false);
  };

  const reset = () => {
    setPhoto(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-purple-900 to-pink-600 text-white p-4">

      {/* título */}
      <h1 className="text-3xl font-bold mb-6 tracking-wide">
        SnapAI 📸✨
      </h1>

      {/* câmera */}
      {!photo && (
        <div className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-[420px] object-cover"
          />
        </div>
      )}

      {/* foto tirada */}
      {photo && !result && (
        <div className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
          <img src={photo} alt="foto" className="w-full" />
        </div>
      )}

      {/* resultado IA */}
      {result && (
        <div className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border-4 border-green-300">
          <img src={result} alt="resultado IA" className="w-full" />
        </div>
      )}

      {/* canvas escondido */}
      <canvas ref={canvasRef} className="hidden" />

      {/* loading */}
      {loading && (
        <p className="mt-4 animate-pulse text-white/80">
          A IA está a criar a tua imagem...
        </p>
      )}

      {/* botões */}
      <div className="flex gap-3 mt-6 flex-wrap justify-center">

        {!photo && (
          <button
            onClick={takePhoto}
            className="px-6 py-3 bg-white text-black rounded-full font-semibold shadow-lg active:scale-95 transition"
          >
            Tirar Foto
          </button>
        )}

        {photo && !result && (
          <>
            <button
              onClick={sendToAI}
              className="px-6 py-3 bg-purple-500 rounded-full font-semibold shadow-lg active:scale-95 transition"
            >
              {loading ? "A gerar..." : "Enviar para IA"}
            </button>

            <button
              onClick={reset}
              className="px-6 py-3 bg-black/60 rounded-full font-semibold shadow-lg"
            >
              Recomeçar
            </button>
          </>
        )}

        {result && (
          <button
            onClick={reset}
            className="px-6 py-3 bg-green-500 rounded-full font-semibold shadow-lg"
          >
            Nova Foto
          </button>
        )}
      </div>
    </div>
  );
}