const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Configuration, OpenAIApi } = require("openai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const message = completion.data.choices[0].message.content;

    const imagePrompt = `Festive ${occasion} greeting card background, soft colors, lights, digital painting, modern Islamic style`;

    const image = await openai.createImage({
      prompt: imagePrompt,
      n: 1,
      size: "512x512",
    });

    res.json({
      message,
      imageURL: image.data.data[0].url,
    });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ SmartRaya backend running on port ${PORT}`);
});
