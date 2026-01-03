import OpenAI from "openai";
import { ConsoleNinja } from "./console-ninja.js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ""
});

const safeParse = (content: string) => {
  try {
    return JSON.parse(content);
  } catch (error) {
    ConsoleNinja.warn("Failed to parse AI JSON", { error, content });
    return null;
  }
};

export const analyzeReport = async (text: string) => {
  if (!process.env.OPENAI_API_KEY) {
    return {
      birads: { value: 3, confidence: "medium", evidence: [] },
      breast_density: { value: "B", evidence: [] },
      exam: { type: "Mammogram", laterality: "Bilateral", evidence: [] },
      findings: [],
      recommendations: [],
      red_flags: []
    };
  }

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: "You are a radiology assistant extracting structured data."
      },
      {
        role: "user",
        content: `Analyze this breast radiology report and extract structured data.\n\nReport Text: ${text}\n\nReturn JSON with: birads {value, confidence, evidence[]}, breast_density, exam {type, laterality}, findings [{laterality, location, description, assessment, evidence[]}], recommendations [{action, timeframe, evidence[]}], red_flags[]\n\nEvidence must be exact quotes. BI-RADS must be 0-6. Flag anything suspicious.`
      }
    ]
  });

  const content = response.choices[0]?.message?.content || "{}";
  return safeParse(content) || {};
};

export const generateSummary = async (payload: unknown) => {
  if (!process.env.OPENAI_API_KEY) {
    return "A brief patient-friendly summary is unavailable in demo mode.";
  }

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.4,
    messages: [
      {
        role: "system",
        content: "You are a supportive clinical summarizer for patients."
      },
      {
        role: "user",
        content: `Create a patient-friendly 2-4 sentence summary of this radiology report explaining key findings, BI-RADS meaning, and what patient should know. Be honest but reassuring.\n\nData: ${JSON.stringify(
          payload
        )}`
      }
    ]
  });

  return response.choices[0]?.message?.content || "";
};

export const consolidateReports = async (reports: unknown) => {
  if (!process.env.OPENAI_API_KEY) {
    return "Consolidated insights are unavailable in demo mode.";
  }

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content: "You are a radiology analyst consolidating multi-report trends."
      },
      {
        role: "user",
        content: `Analyze these multiple breast radiology reports for the same patient. Create 3-5 paragraph summary covering: overall assessment, progression over time, consistent findings, concerning patterns, key recommendations.\n\nReports: ${JSON.stringify(
          reports
        )}`
      }
    ]
  });

  return response.choices[0]?.message?.content || "";
};

export const compareTreatments = async (patient: unknown, options: string[]) => {
  if (!process.env.OPENAI_API_KEY) {
    return {
      recommendation: "AI comparison unavailable in demo mode.",
      options: options.map((option) => ({
        name: option,
        score: 6,
        efficacy_rate: "N/A",
        benefits: [],
        side_effects: [],
        duration: "Unknown",
        considerations: []
      }))
    };
  }

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.4,
    messages: [
      {
        role: "system",
        content: "You are a clinical decision support assistant."
      },
      {
        role: "user",
        content: `Compare these treatment options for this breast cancer patient. For each: recommendation score (1-10), efficacy rate, benefits, side effects, duration, considerations. Include overall recommendation and disclaimer.\n\nPatient: ${JSON.stringify(
          patient
        )}\nOptions: ${JSON.stringify(options)}`
      }
    ]
  });

  const content = response.choices[0]?.message?.content || "{}";
  return safeParse(content) || {};
};
