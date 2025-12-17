import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize with key (we'll fetch this from localStorage or env for now)
export const analyzeQuotesWithGemini = async (apiKey, quotes) => {
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Prepare context
        const simplifiedData = quotes.map(q => ({
            id: q.id,
            dims: `${q.length_cm}x${q.width_cm}x${q.height_cm}`,
            vol: q.volume,
            mat: q.material_type,
            cost: q.final_unit_price - q.unif_profit,
            price: q.final_unit_price,
            margin: q.margin_percent,
            profit: q.total_project_profit
        }));

        const prompt = `
      Actúa como un Consultor Financiero Experto en Manufactura de Corrugados.
      Analiza el siguiente historial de cotizaciones recientes (formato JSON):
      
      ${JSON.stringify(simplifiedData, null, 2)}

      Identifica patrones de pérdidas o márgenes bajos.
      Reglas:
      1. Sé directo y conciso.
      2. Dame 3 recomendaciones específicas tipo "Bullet points".
      3. Si ves márgenes menores al 25%, alerta sobre riesgo.
      4. Si ves volúmenes altos con márgenes bajos, sugiere estrategia de volumen.
      
      Formato de respuesta:
      **Resumen General**: [1 frase]
      **Alertas**: [Lista de alertas]
      **Oportunidades**: [Lista de oportunidades]
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();

    } catch (error) {
        console.error("AI Error:", error);
        throw new Error("Error conectando con Gemini AI checkeá tu API Key.");
    }
};
