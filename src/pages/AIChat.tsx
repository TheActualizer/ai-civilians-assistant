import { useState } from "react";
import Navbar from "@/components/Navbar";
import { ChatInterface } from "@/components/Chat/ChatInterface";
import { useSession } from "@supabase/auth-helpers-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";

interface ChatMessage {
  agent: string;
  message: string;
  timestamp: string;
}

const AIChat = () => {
  const session = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleMessageSubmit = async (message: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      agent: 'user',
      message,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate agent response (this will be replaced with actual agent interaction)
    const agentMessage: ChatMessage = {
      agent: 'AI Civil Engineer',
      message: `I received your message: "${message}". I'm processing it now...`,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, agentMessage]);
  };

  const handleVoiceInput = async (transcript: string) => {
    await handleMessageSubmit(transcript);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar session={session} />
      
      <div className="container mx-auto px-4 pt-24 pb-32">
        <Card className="bg-white shadow-xl border-0">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl font-bold">AI Chat Assistant</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              Have a real-time conversation with our AI Civil Engineer. Ask questions, get insights, 
              and receive expert guidance on your projects.
            </p>
          </CardContent>
        </Card>
      </div>

      <ChatInterface 
        messages={messages}
        onMessageSubmit={handleMessageSubmit}
        onVoiceInput={handleVoiceInput}
      />
    </div>
  );
};

export default AIChat;