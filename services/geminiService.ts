
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("Missing API_KEY environment variable.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateBaldImage(base64Image: string, mimeType: string): Promise<string> {
    const model = 'gemini-2.5-flash-image';
    
    // Extract pure base64 data from data URL
    const pureBase64 = base64Image.split(',')[1];
    
    const imagePart = {
        inlineData: {
            data: pureBase64,
            mimeType: mimeType,
        },
    };

    const textPart = {
        text: 'Haz que la persona de esta imagen sea completamente calva. Elimina todo el pelo de su cabeza, manteniendo el resto de la imagen lo más realista posible.',
    };

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: {
                parts: [imagePart, textPart],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        
        throw new Error("La respuesta de la API no contenía una imagen.");

    } catch (error) {
        console.error('Error calling Gemini API:', error);
        throw new Error('Error al comunicarse con la IA para generar la imagen.');
    }
}
