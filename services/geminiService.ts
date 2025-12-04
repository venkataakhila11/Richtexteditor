import { GoogleGenAI } from "@google/genai";
import { GeminiActionType } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateAIContent = async (
  action: GeminiActionType,
  selectedText: string,
  fullContext?: string // In CUSTOM_PROMPT, this carries the user's specific instruction
): Promise<string> => {
  try {
    const ai = getClient();
    const modelId = 'gemini-2.5-flash'; // Fast model for text editing

    let prompt = "";

    switch (action) {
      case GeminiActionType.REWRITE:
        prompt = `Rewrite the following text to improve clarity and flow, maintain HTML formatting if present: \n\n"${selectedText}"`;
        break;
      case GeminiActionType.SUMMARIZE:
        prompt = `Summarize the following text concisely in one paragraph: \n\n"${selectedText}"`;
        break;
      case GeminiActionType.EXPAND:
        prompt = `Expand upon the following text with more details and explanation: \n\n"${selectedText}"`;
        break;
      case GeminiActionType.FIX_GRAMMAR:
        prompt = `Fix grammar and spelling errors in the following text, do not change the tone: \n\n"${selectedText}"`;
        break;
      case GeminiActionType.MAKE_FORMAL:
        prompt = `Rewrite the following text to be more professional and formal: \n\n"${selectedText}"`;
        break;
      case GeminiActionType.MAKE_CASUAL:
        prompt = `Rewrite the following text to be more casual and friendly: \n\n"${selectedText}"`;
        break;
      case GeminiActionType.EXTRACT_KEY_POINTS:
        prompt = `Identify and extract the key points from the following text and format them as an HTML unordered list (<ul><li>...</li></ul>): \n\n"${selectedText}"`;
        break;
      case GeminiActionType.EMOJIFY:
        prompt = `Add relevant emojis to the following text to make it more engaging, but keep the core message clear: \n\n"${selectedText}"`;
        break;
      case GeminiActionType.SOFTEN_TONE:
        prompt = `Rewrite the following text to sound more empathetic, softer, and less direct: \n\n"${selectedText}"`;
        break;
      case GeminiActionType.CONTINUE_WRITING:
        prompt = `Continue writing based on the following context. Keep the style consistent. Provide only the new content: \n\n"${fullContext}"`;
        break;
      case GeminiActionType.CUSTOM_PROMPT:
        if (selectedText) {
             prompt = `Act on the following text based on this specific instruction: "${fullContext}". Return only the result. \n\nText: "${selectedText}"`;
        } else {
             prompt = `Write content based on this specific instruction: "${fullContext}". Return formatted HTML content.`;
        }
        break;
      default:
        prompt = selectedText;
    }

    // System instruction to ensure we get partial HTML fragments suitable for insertion
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: "You are an expert editor assistant. Return the result as clean text or HTML fragments compatible with a rich text editor. Do not wrap in markdown code blocks (like ```html). Just return the raw content.",
        temperature: 0.7,
      }
    });

    return response.text || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};