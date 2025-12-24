import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeLabImage(base64Image: string, type: 'foam' | 'coating' | 'lumps') {
  try {
    const prompt = `Analyze this lab test image for ${type}. 
    Provide a brief professional description and suggest a score or status. 
    Keep the answer concise.`;

    // Fix: Using the correct multimodal input format as per SDK guidelines (single Content object with parts)
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image.split(',')[1] || base64Image,
            },
          },
        ],
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "AI analysis unavailable.";
  }
}