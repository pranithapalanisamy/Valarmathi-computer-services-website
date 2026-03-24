// AI Chat API endpoint for Vite/React project
// This should be deployed as a serverless function or separate backend service

export async function handleChatRequest(request: Request) {
  try {
    const { message, history, business_context } = await request.json();

    // For production, integrate with your preferred AI service
    // Options: OpenAI, Claude, Gemini, or local LLM
    
    // Example OpenAI integration (uncomment and configure):
    /*
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a helpful AI assistant for ${business_context.name}. 
            Business details:
            - Services: ${business_context.services.join(', ')}
            - Location: ${business_context.location}
            - Phone: ${business_context.phone}
            - Email: ${business_context.email}
            - Hours: ${business_context.hours}
            
            Be friendly, professional, and helpful. Answer questions about the business services, 
            pricing, booking, and technical support. If asked about complex technical issues, 
            recommend contacting the business directly. Keep responses concise but informative.`
          },
          ...history,
          { role: 'user', content: message }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    const data = await openaiResponse.json();
    const aiResponse = data.choices[0].message.content;
    */

    // For now, return an intelligent rule-based response
    const aiResponse = generateIntelligentResponse(message, business_context);

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

function generateIntelligentResponse(message: string, context: any): string {
  const msg = message.toLowerCase();
  
  // Greeting patterns
  if (msg.match(/hello|hi|hey|greetings|good morning|good afternoon/)) {
    return `Hello! Welcome to ${context.name}. I'm here to help you with our computer services, repairs, and any technical questions you might have. How can I assist you today?`;
  }
  
  // Pricing inquiries
  if (msg.match(/price|cost|how much|charge|fee|rate/)) {
    return `Our pricing varies by service type:\n\n💻 Basic Diagnosis: ₹300-500\n🔧 Virus Removal: ₹1,500-3,000\n📱 Screen Replacement: ₹1,500-8,000\n💾 Data Recovery: ₹3,000-10,000\n🌐 Network Setup: ₹400-1,500\n⚡ RAM Upgrade: ₹800-2,000\n\nFor exact pricing, I can provide a detailed quote based on your specific issue. What device problem are you experiencing?`;
  }
  
  // Service inquiries
  if (msg.match(/service|repair|fix|what you do|offer/)) {
    return `${context.name} offers comprehensive computer services:\n\n🔧 **Hardware Services**: Motherboard repair, screen replacement, RAM/SSD upgrades\n💿 **Software Services**: OS installation, driver updates, virus removal\n🌐 **Network Services**: WiFi setup, troubleshooting, configuration\n💾 **Data Services**: Recovery, backup solutions, migration\n📅 **Maintenance**: Annual contracts, on-site support\n\nWe service all major brands: HP, Dell, Lenovo, Apple, ASUS, Acer. What specific service do you need?`;
  }
  
  // Booking inquiries
  if (msg.match(/book|appointment|schedule|when can you|how to book/)) {
    return `Booking a service is easy! Here are your options:\n\n📞 **Call Us**: ${context.phone}\n📧 **Email**: ${context.email}\n🌐 **Website**: Use our booking form\n🏠 **Visit**: ${context.location}\n\n⏰ **Response Time**: Under 2 hours during business hours\n📅 **Hours**: ${context.hours}\n\nWhat service would you like to book? I can help you get started right away!`;
  }
  
  // Emergency/urgent inquiries
  if (msg.match(/emergency|urgent|asap|immediate|broken|crashed/)) {
    return `🚨 **Emergency Support Available**\n\nFor urgent issues, call us immediately at ${context.phone}. We offer:\n\n⚡ Priority service for critical problems\n🚗 Emergency on-site support (when available)\n📞 24/7 phone support for urgent inquiries\n\nWhat's the emergency? Is it a business-critical system or personal device?`;
  }
  
  // Technical support questions
  if (msg.match(/slow|freezing|crashing|virus|malware|not turning on/)) {
    return `I can help troubleshoot that! Common solutions:\n\n🐌 **Slow Performance**: Often needs cleanup, RAM upgrade, or SSD\n🔄 **Freezing/Crashing**: Could be overheating, software conflicts, or hardware issues\n🦠 **Virus/Malware**: Requires professional removal and system security setup\n⚡ **Not Turning On**: Could be power supply, motherboard, or other hardware failure\n\nFor proper diagnosis, our technicians can run comprehensive tests. Would you like to schedule a diagnostic service?`;
  }
  
  // Contact/location inquiries
  if (msg.match(/contact|phone|email|address|location|where are you/)) {
    return `📍 **Contact Information**\n\n📞 **Phone**: ${context.phone}\n📧 **Email**: ${context.email}\n🏠 **Address**: ${context.location}\n⏰ **Hours**: ${context.hours}\n\nYou can also request a free quote through our website. Need directions or want to schedule a visit?`;
  }
  
  // Time/hours inquiries
  if (msg.match(/hours|time|when are you open|close/)) {
    return `⏰ **Business Hours**: ${context.hours}\n\n📞 **Phone Support**: Available during business hours\n🚨 **Emergency**: Call anytime for urgent issues\n⚡ **Response Time**: Under 2 hours during business hours\n\nNeed service outside regular hours? Call us - we may be able to accommodate urgent requests!`;
  }
  
  // Brand/device inquiries
  if (msg.match(/brand|dell|hp|lenovo|apple|mac|asus|acer/)) {
    return `We service all major computer brands and devices:\n\n💻 **Laptops**: Dell, HP, Lenovo, Apple MacBook, ASUS, Acer\n🖥️ **Desktops**: All major manufacturers and custom builds\n📱 **Tablets**: iPad, Android tablets\n📱 **Phones**: Basic software issues\n\nOur technicians are certified across all platforms. What brand and model are you having issues with?`;
  }
  
  // Data recovery inquiries
  if (msg.match(/data recovery|lost files|deleted|backup/)) {
    return `💾 **Data Recovery Services**\n\nWe can recover data from:\n• Failed hard drives (HDD/SSD)\n• Corrupted storage devices\n• Accidentally deleted files\n• Formatted drives\n• Virus-damaged systems\n\n🔒 **Success Rate**: 85-95% depending on damage\n⏱️ **Timeline**: 1-3 days for most cases\n💰 **Pricing**: ₹3,000-10,000 based on complexity\n\nStop using the device immediately to prevent data overwrite. Can you describe what happened to your data?`;
  }
  
  // Default intelligent response
  return `Thank you for your question about "${message}". As the AI assistant for ${context.name}, I'm here to help with computer services, repairs, technical support, and booking appointments.\n\nI can assist with:\n• Service information and pricing\n• Booking appointments\n• Technical troubleshooting\n• Emergency support\n• Contact information\n• And much more!\n\nCould you provide more details about what you'd like to know? I'm here to help!`;
}
