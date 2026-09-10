import { GoogleGenAI } from "@google/genai";
import { ZodType } from "zod";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined");
}

const ai = new GoogleGenAI({
  apiKey,
});

export async function askGemini<T>(
  prompt: string,
  schema: object,
  validate: ZodType<T>,
): Promise<T> {
  const response = await ai.interactions.create({
    model: "gemini-3.6-flash",
    input: prompt,

    response_format: {
      type: "text",
      mime_type: "application/json",
      schema,
    },
  });

  if (!response.output_text) {
    throw new Error("Gemini returned an empty response");
  }

  return validate.parse(JSON.parse(response.output_text));
}
