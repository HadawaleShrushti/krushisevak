import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { ArrowLeft, Send, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Message {
  id: string;
  text: string;
  sender: 'farmer' | 'retailer';
  timestamp: Date;
}

export function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I am interested in buying wheat.',
      sender: 'retailer',
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: '2',
      text: 'Namaste! Yes, I have 500 kg available. What quantity do you need?',
      sender: 'farmer',
      timestamp: new Date(Date.now() - 3000000),
    },
    {
      id: '3',
      text: 'I need around 200 kg. Can you do ₹23 per kg?',
      sender: 'retailer',
      timestamp: new Date(Date.now() - 2400000),
    },
    {
      id: '4',
      text: 'My price is ₹25 per kg. For 200 kg, I can do ₹24 per kg.',
      sender: 'farmer',
      timestamp: new Date(Date.now() - 1800000),
    },
  ]);

  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'retailer',
        timestamp: new Date(),
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          className="mb-4 gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden h-[calc(100vh-220px)] flex flex-col">
          {/* Chat Header */}
          <CardHeader className="border-b bg-gradient-to-r from-primary to-secondary text-white p-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-2">
                <User className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg text-white">Ramesh Kumar</CardTitle>
                <p className="text-sm text-green-50">{t('farmer')}</p>
              </div>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'retailer' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    message.sender === 'retailer'
                      ? 'bg-primary text-white rounded-br-sm'
                      : 'bg-gray-100 text-foreground rounded-bl-sm'
                  }`}
                >
                  <p className="break-words">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'retailer' ? 'text-green-100' : 'text-muted-foreground'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>

          {/* Message Input */}
          <div className="border-t p-4 bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <Input
                placeholder={t('typeMessage')}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
                className="rounded-xl flex-1"
              />
              <Button
                onClick={handleSendMessage}
                className="rounded-xl bg-primary hover:bg-primary/90 px-6"
              >
                <Send className="w-4 h-4 mr-2" />
                {t('send')}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
