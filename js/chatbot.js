// Initialize empty array at the beginning
let chatHistory = [];
let MAX_HISTORY_LENGTH = 10;
let INITIAL_PROMPT;
let model;

// Make function available immediately
window.getChatbotResponse = async function(userMessage) {
  try {
    // Check if chatHistory is initialized properly
    if (!Array.isArray(chatHistory)) {
      console.error('Chat history not properly initialized, creating new history');
      chatHistory = [];
    }
    
    // Create a local copy to prevent reference issues
    const currentHistory = [...chatHistory];
    
    const messages = currentHistory.map(msg => ({
      role: msg.role,
      parts: msg.parts.map(part => ({ text: part.text }))
    }));

    // Add the new user message
    messages.push({
      role: "user",
      parts: [{ text: userMessage }]
    });

    // Get response from the model
    const result = await model.generateContent({ contents: messages });
    const response = await result.response;
    const responseText = response.text();

    // Update global history
    chatHistory.push({ 
      role: "user", 
      parts: [{ text: userMessage }] 
    });
    
    chatHistory.push({ 
      role: "model", 
      parts: [{ text: responseText }] 
    });

    // Trim history if it gets too long
    if (chatHistory.length > MAX_HISTORY_LENGTH * 2) {
      chatHistory = chatHistory.slice(-MAX_HISTORY_LENGTH * 2);
    }

    return responseText;
  } catch (error) {
    console.error('Chatbot Error:', error);
    return 'Sorry, I encountered an issue. Please try again later.';
  }
};

// Initialize everything after the document is loaded
document.addEventListener('DOMContentLoaded', function() {
  try {
    // Initialize the Google AI SDK components
    const { GoogleGenerativeAI } = window.google.generativeAI;

    // API key configuration
    const API_KEY = 'AIzaSyDIi3JhFh_tBRPIiypKeiWiAsQJPxqODVE';
    const genAI = new GoogleGenerativeAI(API_KEY);

    // Model configuration
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    // Initialize model globally
    model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig,
    });

    // Initial prompt and chat history
    INITIAL_PROMPT = `You are Rumi, a helpful assistant for RUMI SAFFRON. We deal in high-end quality saffron from Iran and the world's most organic wildflower honey. Products:
      - Premium Saffron (1g): Rs 1300
      - Wildflower Honey (250g): Rs 800
      Delivery charges: Rs 200 for orders under Rs 2000, free otherwise. We offer wholesale, retail, and samples for big orders. Our packaging is premium, and we're an organic luxury brand.`;

    // Now initialize chat history with the initial prompt and response
    chatHistory = [
      {
        role: "user",
        parts: [{ text: INITIAL_PROMPT }]
      }, 
      {
        role: "model", 
        parts: [{ text: "Greetings! I'm Rumi, your expert assistant for RUMI SAFFRON. How can I assist you with our luxury saffron and honey today?" }]
      }
    ];
    
    console.log("Chatbot initialized successfully!");
  } catch (error) {
    console.error("Error initializing chatbot:", error);
  }
});