import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, payload } = await req.json();
    console.log(`Received action: ${action}`);

    const geminiKey = Deno.env.get('GEMINI_API_KEY');

    if (!geminiKey) {
      console.error('GEMINI_API_KEY is missing');
      throw new Error('GEMINI_API_KEY is not set in Supabase Edge Function secrets.');
    }

    let systemPrompt = "You are a helpful AI assistant.";
    let userPrompt = "";

    if (action === 'generate_report') {
      systemPrompt = "You are an expert admissions consultant. Generate a detailed markdown report for the student application status. Use the following sections: Executive Summary, Key Highlights, Action Items, and Next Steps. Be professional but encouraging.";
      userPrompt = `Student Data: ${JSON.stringify(payload)}.`;
    } else if (action === 'summarize_text') {
      systemPrompt = "You are a helpful assistant that summarizes text. Provide a concise summary of the provided text.";
      userPrompt = `Summarize the following text:\n\n${payload.text}`;
    } else if (action === 'summarize_url') {
       console.log(`Fetching URL: ${payload.url}`);
       try {
         const response = await fetch(payload.url);
         if (!response.ok) throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
         const html = await response.text();
         
         const text = html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, "")
                          .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gm, "")
                          .replace(/<[^>]*>?/gm, ' ')
                          .replace(/\s+/g, ' ')
                          .trim()
                          .substring(0, 15000); 
         
         systemPrompt = "You are a helpful assistant that summarizes web pages. Provide a concise summary of the webpage content.";
         userPrompt = `Summarize the content of this webpage (${payload.url}):\n\n${text}`;
       } catch (e) {
         console.error(`URL Fetch Error: ${e.message}`);
         throw new Error(`Could not fetch or parse URL: ${e.message}`);
       }
    } else if (action === 'extract_university_info') {
       console.log(`Extracting info from URL: ${payload.url}`);
       try {
         const response = await fetch(payload.url);
         if (!response.ok) throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
         const html = await response.text();
         
         const text = html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, "")
                          .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gm, "")
                          .replace(/<[^>]*>?/gm, ' ')
                          .replace(/\s+/g, ' ')
                          .trim()
                          .substring(0, 20000); 
         
         systemPrompt = `You are an expert data extractor. Extract university information from the provided text into a strict JSON format. 
         The JSON should have these fields:
         - name: University Name
         - location: City, Province/State
         - deadline: Application Deadline (e.g., "Jan 15, 2026")
         - app_fee: Application Fee (e.g., "$100 CAD")
         - tuition: Estimated Tuition for Year 1 (e.g., "$40,000 - $50,000")
         - room_board: Estimated Room & Board (e.g., "$15,000")
         - scholarships: An array of objects with { "name": "Scholarship Name", "value": "Value", "notes": "Criteria/Notes" }
         - insights: A short paragraph of key insights or strategy for an international applicant.
         
         If a field is not found, use "TBD" or "Check Website". Return ONLY the JSON.`;
         userPrompt = `Extract information from this webpage content (${payload.url}):\n\n${text}`;
       } catch (e) {
         console.error(`URL Fetch Error: ${e.message}`);
         throw new Error(`Could not fetch or parse URL: ${e.message}`);
       }
    } else if (action === 'suggest_universities') {
      console.log('Suggesting universities for student:', payload.student);
      const s = payload.student;
      systemPrompt = `You are an expert university admission counselor for Canada. Suggest 5 best-fit Canadian universities based on the student's profile.
      Return a strict JSON array of objects.
      JSON Schema:
      [
        {
          "name": "University Name",
          "location": "City, Province",
          "matchReason": "Why this is a good match",
          "programs": "Suggested programs"
        }
      ]`;
      userPrompt = `Student Profile:
      - GPA/Grades: ${s.gpa || 'Not specified'}
      - SAT: ${s.sat_score || 'Not specified'}
      - IELTS: ${s.ielts_score || 'Not specified'}
      - Interests: ${s.interests || 'General Arts/Science'}
      
      Suggest 5 Canadian universities that would be realistic and good options for this student. Focus on a mix of reach, target, and safety schools.`;
    } else if (action === 'brainstorm_essays') {
      console.log('Brainstorming essays for:', payload.student);
      const s = payload.student;
      const userNotes = payload.userNotes || '';
      systemPrompt = `You are an expert college essay coach. Your goal is to help the student find unique, compelling angles for their personal statement.
      Avoid generic advice. Look for specific details in their profile that could be turned into a story.
      Return the response in Markdown format with clear headings.`;
      userPrompt = `Student Profile:
      - Interests: ${s.interests || 'Not specified'}
      - Major: ${s.major || 'Not specified'}
      - Background: ${s.background || 'International student'}
      - Checklist Progress: ${s.checklist ? JSON.stringify(s.checklist) : 'Not started'}
      
      User Notes/Context: ${userNotes}
      
      Generate 3 unique essay topic ideas for this student. For each idea, explain "The Angle" (what makes it unique) and "The Hook" (how to start).`;
    } else if (action === 'review_strategy') {
      console.log('Reviewing strategy for:', payload.student);
      const s = payload.student;
      const userNotes = payload.userNotes || '';
      systemPrompt = `You are a strategic university admissions consultant. Analyze the student's profile to identify strengths, weaknesses, and opportunities.
      Return the response in Markdown format.`;
      userPrompt = `Student Profile:
      - GPA: ${s.gpa || 'Not specified'}
      - SAT: ${s.sat_score || 'Not specified'}
      - IELTS: ${s.ielts_score || 'Not specified'}
      - Interests: ${s.interests || 'Not specified'}
      - Major: ${s.major || 'Not specified'}
      - Current Status: ${s.status || 'Not specified'}
      - Checklist Progress: ${s.checklist ? JSON.stringify(s.checklist) : 'Not started'}
      
      User Notes/Context: ${userNotes}
      
      Provide a strategic review:
      1. **Profile Strength**: Rate as High/Medium/Low for top Canadian universities.
      2. **Key Gaps**: What is missing? (e.g., leadership, test scores).
      3. **Action Plan**: 3 specific things they should do in the next month to improve their chances.`;
    } else {
      throw new Error('Invalid action. Supported actions: generate_report, summarize_text, summarize_url, extract_university_info, suggest_universities, brainstorm_essays, review_strategy');
    }

    console.log('Sending request to Gemini...');
    // Gemini API structure
    // Using gemini-flash-latest as it is confirmed available for this key
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiKey}`;
    
    const aiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\n${userPrompt}`
          }]
        }]
      }),
    });

    const data = await aiResponse.json();
    
    if (data.error) {
      console.error('Gemini API Error:', data.error);
      throw new Error(`Gemini API Error: ${data.error.message}`);
    }

    // Extract text from Gemini response
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!result) {
       console.error('Unexpected Gemini response structure:', JSON.stringify(data));
       throw new Error('Failed to generate content from Gemini.');
    }

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Edge Function Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
