import { useEffect, useRef } from "react";

function App() {
  const videoRef = useRef(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error("Erro ao abrir a câmara:", error);
      }
    }

    startCamera();
  }, []);

  return (
    <div>
      <h1>CARANIMALINHO</h1>
      <p>Faz uma expressão e encontra o teu animal gémeo.</p>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          width: "600px",
          borderRadius: "12px",
          border: "3px solid #333",
        }}
      />
    </div>
  );
}

export default App;