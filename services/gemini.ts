import { GoogleGenAI } from "@google/genai";

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API Key not found");
    }
    return new GoogleGenAI({ apiKey });
};

export const askAiCoach = async (query: string, userStats: string) => {
    try {
        const ai = getClient();
        const model = "gemini-3-flash-preview";
        
        const systemInstruction = `
        Ti si Centurion AI Trener, stručnjak za kalisteniku i sklekove.
        Tvoj cilj je pomoći korisniku da dođe do 100 sklekova u seriji.
        Korisnik se nalazi u programu "Centurion Push-Up Architect".
        
        Kontekst korisnika:
        ${userStats}
        
        Odgovaraj na HRVATSKOM jeziku. Budi motivirajuć, strog ali pravedan ("military style").
        Koristi kratke i jasne rečenice.
        Ako te korisnik pita o ozljedama, daj općenite savjete ali napomeni da nisi liječnik.
        Ako korisnik pita o činjenicama (npr. svjetski rekord), koristi Google Search.
        `;

        const response = await ai.models.generateContent({
            model: model,
            contents: query,
            config: {
                systemInstruction: systemInstruction,
                tools: [{ googleSearch: {} }]
            }
        });

        const text = response.text;
        const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

        return { text, grounding };
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
};
