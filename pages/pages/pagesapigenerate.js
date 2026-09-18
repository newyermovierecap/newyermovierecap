import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { transcript } = req.body;

  if (!transcript) {
    return res.status(400).json({
      error: "Transcript ထည့်ပါ။"
    });
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });

  const prompt = `
You are an expert Movie Recapper.

Read the following movie transcript and create:

1. recap_script:
A complete and engaging movie recap written in natural Burmese language.

2. srt_subtitles:
Burmese SRT subtitles with sequential timing.

Respond ONLY with valid JSON.

Transcript:
${transcript}
`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleanJson = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const data = JSON.parse(cleanJson);

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Processing failed. Check API key or input."
    });
  }
}
