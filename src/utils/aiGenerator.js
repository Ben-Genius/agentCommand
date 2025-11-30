import { supabase } from '@/lib/supabase';

/**
 * Helper to handle Supabase Function invocation
 */
export const invokeAiAgent = async (action, payload) => {
  if (!supabase) throw new Error("Supabase client not initialized");

  const { data, error } = await supabase.functions.invoke('ai-agent', {
    body: { action, payload }
  });

  if (error) {
    // Try to parse the error body if available
    let errorMessage = error.message;
    if (error instanceof Error && error.context && error.context.json) {
       try {
         const body = await error.context.json();
         if (body.error) errorMessage = body.error;
       } catch (e) {
         // ignore json parse error
       }
    }
    throw new Error(errorMessage);
  }

  if (data && data.error) {
    throw new Error(data.error);
  }
  
  return data.result;
};

/**
 * AI Report Generator
 * Generates a summary report for a student application.
 */
export const generateStudentReport = async (student) => {
  return invokeAiAgent('generate_report', student);
};

/**
 * Summarize Text
 */
export const summarizeText = async (text) => {
  return invokeAiAgent('summarize_text', { text });
};

/**
 * Summarize URL
 */
export const summarizeUrl = async (url) => {
  return invokeAiAgent('summarize_url', { url });
};

/**
 * Extract University Info
 */
export const extractUniversityInfo = async (url) => {
  const result = await invokeAiAgent('extract_university_info', { url });
  try {
    // The AI might return markdown code blocks, strip them
    const cleanJson = result.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error("Failed to parse AI JSON response", result);
    throw new Error("AI returned invalid data format");
  }
};
