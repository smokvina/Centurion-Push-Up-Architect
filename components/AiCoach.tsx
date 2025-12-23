import React, { useState } from 'react';
import { askAiCoach } from '../services/gemini';
import { UserProgress } from '../types';

interface AiCoachProps {
  user: UserProgress;
}

const AiCoach: React.FC<AiCoachProps> = ({ user }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string, links?: any[]}[]>([
    { role: 'ai', content: 'Pozdrav vojniče! Ja sam tvoj Centurion AI Trener. Kako ti mogu pomoći danas? Pitanja o formi, boli ili prehrani?' }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!query.trim()) return;

    const userMsg = { role: 'user' as const, content: query };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const stats = `Max Reps: ${user.maxReps}, Faza: ${user.currentPhase}, Tjedan: ${user.currentWeek}`;
      const response = await askAiCoach(userMsg.content, stats);
      
      const aiMsg = { 
          role: 'ai' as const, 
          content: response.text || "Nisam uspio generirati odgovor.", 
          links: response.grounding 
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Došlo je do greške u komunikaciji sa stožerom (API Error).' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-military-800 rounded-xl shadow flex flex-col h-[500px] border border-gray-200 dark:border-military-600">
      <div className="p-4 bg-military-700 text-white rounded-t-xl flex justify-between items-center">
        <span className="font-bold"><i className="fas fa-robot mr-2"></i> Centurion AI Trener</span>
        <span className="text-xs bg-green-600 px-2 py-1 rounded">ONLINE</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${
              msg.role === 'user' 
                ? 'bg-green-600 text-white rounded-br-none' 
                : 'bg-gray-100 dark:bg-military-900 dark:text-gray-200 rounded-bl-none'
            }`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
              {msg.links && msg.links.length > 0 && (
                  <div className="mt-2 text-xs border-t border-gray-300 dark:border-gray-600 pt-2">
                      <div className="font-bold mb-1">Izvori:</div>
                      {msg.links.map((chunk: any, i: number) => (
                         chunk.web?.uri && (
                             <a key={i} href={chunk.web.uri} target="_blank" rel="noreferrer" className="block text-blue-500 hover:underline truncate">
                                 {chunk.web.title || chunk.web.uri}
                             </a>
                         )
                      ))}
                  </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-gray-100 dark:bg-military-900 p-3 rounded-lg rounded-bl-none text-gray-500 text-sm">
                <i className="fas fa-circle-notch fa-spin mr-2"></i> Analiziram podatke...
             </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-military-600">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Upiši pitanje za trenera..."
            className="flex-1 bg-gray-50 dark:bg-military-900 border border-gray-300 dark:border-military-600 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500 text-gray-900 dark:text-white"
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiCoach;