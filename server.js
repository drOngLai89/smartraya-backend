const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Initialize OpenAI using v4.x syntax
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🔥 POST endpoint to generate greeting card
app.post("/generateCard", async (req, res) => {
  const { occasion, recipient, relationship, traits } = req.body;

  try {
    const prompt = `
You are a creative AI card writer for Malaysian cultural celebrations. 
Write a heartfelt message for a ${occasion} greeting card.

Recipient: ${recipient}  
Relationship: ${relationship}  
Traits / Personal Note: ${traits}  

1. Make it poetic and warm (2–3 short paragraphs)
2. Include one Malay proverb or blessing
3. Suitable for printed card
`;

    // 🧠 Generate text from GPT-4
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const message = completion.choices[0].message.content;

    // 🎨 Generate AI image with DALL·E
    const imagePrompt = `Festive ${occasion} greeting card background, soft colors, lights, digital painting, modern Islamic style`;

    const image = await openai.images.generate({
      prompt: imagePrompt,
      n: 1,
      size: "512x512",
    });

    res.json({
      message,
      imageURL: image.data[0].url,
    });
  } catch (error) {
    console.error("❌ Error generating card:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ SmartRaya backend is running on port ${PORT}`);
});
