import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mic, MessageCircle, Volume2, Play, Pause } from "lucide-react";

const VoiceChatDemo = () => {
  const [activeDemo, setActiveDemo] = useState<'voice' | 'chat' | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const voiceMessages = [
    "Analyzing your Q3 sales data...",
    "I found 3 critical bottlenecks in your pipeline.",
    "Automatically scheduling follow-ups for 24 prospects.",
    "Your conversion rate improved by 18% this month."
  ];

  const chatMessages = [
    { type: 'user', text: 'Show me our team productivity metrics' },
    { type: 'ai', text: 'Analyzing 14 team members across 8 projects...' },
    { type: 'ai', text: 'Here are your key insights:' },
    { type: 'ai', text: '• Average sprint velocity: +23%\n• Bug resolution time: -31%\n• Code review efficiency: +45%' }
  ];

  const toggleVoiceDemo = () => {
    setActiveDemo(activeDemo === 'voice' ? null : 'voice');
    setIsPlaying(!isPlaying);
  };

  const toggleChatDemo = () => {
    setActiveDemo(activeDemo === 'chat' ? null : 'chat');
  };

  return (
    <section className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="neural-heading text-5xl md:text-6xl mb-6">
            Experience <span className="text-primary">AI Interaction</span>
          </h2>
          <p className="neural-body text-xl text-muted-foreground max-w-3xl mx-auto">
            Communicate with your business intelligence through natural voice commands and conversational chat.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Voice AI Demo */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="neural-glass p-8 relative overflow-hidden group"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-neural-cyan to-neural-violet p-0.5">
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                  <Volume2 className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="neural-subheading text-2xl">Voice AI Assistant</h3>
            </div>

            {/* Voice Visualization */}
            <div className="relative h-40 mb-8 flex items-center justify-center">
              <Button
                onClick={toggleVoiceDemo}
                className={`w-24 h-24 rounded-full transition-all duration-300 ${
                  activeDemo === 'voice' 
                    ? 'neural-btn-primary scale-110' 
                    : 'neural-btn-ghost'
                }`}
              >
                {activeDemo === 'voice' ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Mic className="h-8 w-8" />
                )}
              </Button>

              {/* Sound Waves */}
              <AnimatePresence>
                {activeDemo === 'voice' && (
                  <>
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 bg-primary rounded-full"
                        style={{ left: `${45 + i * 8}%` }}
                        initial={{ height: 4 }}
                        animate={{ 
                          height: [4, 20 + Math.random() * 40, 4],
                          opacity: [0.3, 1, 0.3]
                        }}
                        transition={{ 
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.1
                        }}
                        exit={{ opacity: 0 }}
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Voice Messages */}
            <div className="space-y-3 min-h-[120px]">
              <AnimatePresence>
                {activeDemo === 'voice' && voiceMessages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 1.5 }}
                    className="neural-glass p-4 border-l-2 border-primary"
                  >
                    <p className="neural-body text-sm">{message}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Chat AI Demo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="neural-glass p-8 relative overflow-hidden group"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-neural-violet to-accent p-0.5">
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="neural-subheading text-2xl">Chat AI Assistant</h3>
            </div>

            {/* Chat Interface */}
            <div className="space-y-4 min-h-[200px]">
              <Button
                onClick={toggleChatDemo}
                className={`w-full ${
                  activeDemo === 'chat' 
                    ? 'neural-btn-primary' 
                    : 'neural-btn-ghost'
                }`}
              >
                <Play className="mr-2 h-4 w-4" />
                {activeDemo === 'chat' ? 'Demo Running...' : 'Start Chat Demo'}
              </Button>

              <AnimatePresence>
                {activeDemo === 'chat' && chatMessages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 1.2 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-4 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground ml-4'
                        : 'neural-glass border-l-2 border-accent mr-4'
                    }`}>
                      <p className="neural-body text-sm whitespace-pre-line">{message.text}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Interactive Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            { title: "Natural Language", description: "Speak or type in plain English" },
            { title: "Real-time Responses", description: "Instant AI-powered insights" },
            { title: "Context Aware", description: "Remembers your conversation history" }
          ].map((feature, index) => (
            <div key={feature.title} className="text-center neural-glass p-6">
              <h4 className="neural-subheading text-lg mb-2">{feature.title}</h4>
              <p className="neural-body text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Flow Line to Next Section */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flow-line" />
    </section>
  );
};

export default VoiceChatDemo;