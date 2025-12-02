
import { GoogleGenAI, Type } from "@google/genai";
import { PaletteResponse } from '../types';

const getApiKey = (): string => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY environment variable not set");
    }
    return apiKey;
};

export const generatePalette = async (mood: string): Promise<PaletteResponse> => {
    try {
        const ai = new GoogleGenAI({ apiKey: getApiKey() });

        const paletteSchema = {
            type: Type.OBJECT,
            properties: {
                palette: {
                    type: Type.ARRAY,
                    description: "An array of exactly 5 string Hex color codes (e.g., #RRGGBB).",
                    items: {
                        type: Type.STRING
                    }
                },
                justification: {
                    type: Type.STRING,
                    description: "A brief, aesthetic justification for the chosen color palette, explaining how it relates to the user's mood/keyword."
                }
            },
            required: ['palette', 'justification']
        };

        const prompt = `You are a professional Graphic Designer and Color Theory Expert specializing in cute, adorable, and cheerful aesthetics. Based on the mood or keyword "${mood}", generate a unique and appealing color palette. The palette must have exactly 5 Hex color codes. Also, provide a brief aesthetic justification for your choice.`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: paletteSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText) as PaletteResponse;

        if (!parsedResponse.palette || parsedResponse.palette.length !== 5) {
            throw new Error("API did not return a 5-color palette.");
        }

        return parsedResponse;
    } catch (error) {
        console.error("Error generating palette:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate palette: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the palette.");
    }
};
