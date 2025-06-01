import { OPENAI_API_KEY } from '@env';

interface Region {
  country: string;
  state: string | null;
}

interface AnswerResponse {
  answer: string;
  standard?: string;
  clause?: string;
}

export async function fetchAnswer(question: string, region: Region): Promise<AnswerResponse> {
  try {
    // In a real app, we'd call the OpenAI API with the proper API key
    // For this demonstration, we'll simulate a response
    
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo purposes, generate a response based on the question and region
    const apiKey = OPENAI_API_KEY;
    
    // This is a simulated response
    // In a real implementation, this would call the OpenAI API with the proper prompt
    // that includes the question and region context
    
    // Sample answers based on common electrical questions
    const sampleAnswers = [
      {
        question: "what is the minimum height for a power outlet?",
        answer: "According to the Australian/New Zealand Wiring Rules (AS/NZS 3000:2018), there is no specific minimum height requirement for general power outlets in residential installations. However, industry practice typically places them at 300mm above the finished floor level. For kitchens and other wet areas, outlets should be at least 150mm above benchtops and at least 300mm away from sinks.",
        standard: "AS/NZS 3000:2018",
        clause: "4.4.2.2"
      },
      {
        question: "maximum circuit breaker size for 12 AWG wire",
        answer: "For 12 AWG copper wire with 90°C insulation (THHN, THWN-2, etc.), the maximum circuit breaker size is 20 amperes per the National Electrical Code. This is based on the wire's ampacity rating and the requirement to protect the conductor from overcurrent conditions.",
        standard: "NFPA 70 (NEC)",
        clause: "240.4(D)(5)"
      },
      {
        question: "requirements for bathroom lighting",
        answer: "In residential bathrooms, lighting must be controlled by a wall switch located at the entrance. At least one light fixture must be installed in every bathroom, and all lighting fixtures in wet locations must be rated for damp or wet locations. Recessed fixtures must be specifically labeled for use in wet areas if installed in shower or tub zones.",
        standard: "IEC 60364-7-701",
        clause: "701.512.2"
      },
      {
        question: "spacing between electrical panel and gas meter",
        answer: "According to safety regulations, there must be a minimum clearance of 3 feet (915mm) between an electrical panel and a gas meter. This separation is required to prevent potential ignition of gas leaks by electrical arcing and to ensure safe access to both utilities for maintenance and emergency situations.",
        standard: "NFPA 54/ANSI Z223.1",
        clause: "5.7.2"
      }
    ];
    
    // Find a sample answer that somewhat matches the question
    const matchingAnswer = sampleAnswers.find(item => 
      question.toLowerCase().includes(item.question.split(" ")[1]) ||
      question.toLowerCase().includes(item.question.split(" ")[2])
    );
    
    if (matchingAnswer) {
      return {
        answer: matchingAnswer.answer,
        standard: matchingAnswer.standard,
        clause: matchingAnswer.clause
      };
    }
    
    // Default fallback response
    return {
      answer: `Based on the electrical standards applicable in ${region.country}${region.state ? `, ${region.state}` : ''}, the specific regulation regarding "${question}" would require detailed analysis of the relevant sections of the electrical code. In a real implementation, this would provide the exact clause references and detailed explanation from the appropriate standard.`,
      standard: region.country === "United States" ? "NFPA 70 (NEC)" : 
               region.country === "Australia" ? "AS/NZS 3000:2018" :
               region.country === "United Kingdom" ? "BS 7671:2018" :
               region.country === "Canada" ? "CSA C22.1" : 
               "IEC 60364",
      clause: "Various sections"
    };
    
  } catch (error) {
    console.error('Error fetching answer:', error);
    throw new Error('Failed to get answer from API');
  }
}