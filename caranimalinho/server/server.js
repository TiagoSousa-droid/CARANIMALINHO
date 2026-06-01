import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🤖 ROUTE DA IA
app.post("/generate-image", async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: "Imagem não enviada" });
    }

    const result = await openai.images.edit({
      model: "gpt-image-1",
      image,
      prompt: "Transforma esta imagem num estilo criativo, moderno, bonito e visualmente apelativo",
      size: "1024x1024",
    });

    const generatedImage = result.data[0].url;

    return res.json({ generatedImage });

  } catch (err) {
    console.log("Erro IA:", err);
    return res.status(500).json({ error: "Erro ao gerar imagem" });
  }
});

// 🚀 START SERVER
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`🔥 Server a correr em http://localhost:${PORT}`);
});