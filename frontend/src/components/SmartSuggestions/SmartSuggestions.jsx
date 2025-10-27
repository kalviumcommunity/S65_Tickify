import React, { useState, useEffect } from 'react';
import { Lightbulb, Sparkles, RefreshCw, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const SmartSuggestions = ({ onAddSuggestion }) => {
  const [currentSuggestion, setCurrentSuggestion] = useState('');
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentApiIndex, setCurrentApiIndex] = useState(0);

  // 6 Different Free APIs - No Auth Required!
  const apiSources = [
    {
      name: 'Advice Slip',
      icon: '💡',
      badge: 'Life Advice',
      fetch: async () => {
        const res = await fetch('https://api.adviceslip.com/advice');
        const data = await res.json();
        return `${data.slip.advice}`;
      }
    },
    {
      name: 'Bored API',
      icon: '🎯',
      badge: 'Activity Idea',
      fetch: async () => {
        const res = await fetch('https://bored-api.appbrewery.com/random');
        const data = await res.json();
        return `${data.activity}`;
      }
    },
    {
      name: 'Quotable',
      icon: '✨',
      badge: 'Inspiration',
      fetch: async () => {
        const res = await fetch('https://api.quotable.io/random');
        const data = await res.json();
        return `"${data.content}" - ${data.author}`;
      }
    },
    {
      name: 'Dad Joke API',
      icon: '😂',
      badge: 'Fun Break',
      fetch: async () => {
        const res = await fetch('https://icanhazdadjoke.com/', {
          headers: { 'Accept': 'application/json' }
        });
        const data = await res.json();
        return `Laugh break: ${data.joke}`;
      }
    },
    {
      name: 'Official Joke API',
      icon: '🤣',
      badge: 'Comedy Break',
      fetch: async () => {
        const res = await fetch('https://official-joke-api.appspot.com/random_joke');
        const data = await res.json();
        return `${data.setup} ${data.punchline}`;
      }
    },
    {
      name: 'Affirmations API',
      icon: '🌟',
      badge: 'Daily Affirmation',
      fetch: async () => {
        const res = await fetch('https://www.affirmations.dev/');
        const data = await res.json();
        return `${data.affirmation}`;
      }
    }
  ];

  // Fetch suggestion from a specific API
  const fetchFromAPI = async (apiConfig) => {
    try {
      const suggestion = await apiConfig.fetch();
      return {
        text: suggestion,
        icon: apiConfig.icon,
        badge: apiConfig.badge,
        success: true
      };
    } catch (error) {
      console.log(`${apiConfig.name} failed:`, error);
      return { success: false };
    }
  };

  // Main fetch function that tries APIs in sequence
  const fetchSuggestion = async () => {
    setLoading(true);
    
    try {
      // Try current API first
      let result = await fetchFromAPI(apiSources[currentApiIndex]);
      
      // If current API fails, try all others
      if (!result.success) {
        for (let i = 0; i < apiSources.length; i++) {
          if (i !== currentApiIndex) {
            result = await fetchFromAPI(apiSources[i]);
            if (result.success) {
              setCurrentApiIndex(i);
              break;
            }
          }
        }
      }
      
      // If all APIs fail, use a motivational message
      if (!result.success) {
        result = {
          text: "You're doing great! Keep up the good work!",
          icon: '💪',
          badge: 'Motivation',
          success: true
        };
      }
      
      setCurrentSuggestion(`${result.icon} ${result.text}`);
      setShowSuggestion(true);
      
      // Move to next API for variety
      setCurrentApiIndex((prevIndex) => (prevIndex + 1) % apiSources.length);
      
    } catch (error) {
      console.error('Error in fetchSuggestion:', error);
      setCurrentSuggestion('💪 You\'re doing amazing! Keep going!');
      setShowSuggestion(true);
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial suggestion on mount
  useEffect(() => {
    fetchSuggestion();
  }, []);

  // Auto-refresh every 25 seconds
  useEffect(() => {
    const interval = setInterval(fetchSuggestion, 25000);
    return () => clearInterval(interval);
  }, [currentApiIndex]);

  const handleAddSuggestion = () => {
    if (onAddSuggestion && currentSuggestion) {
      // Clean up the suggestion
      const cleanSuggestion = currentSuggestion
        .replace(/^[^\w\s]+\s/, '') // Remove leading emoji
        .replace(/"/g, '') // Remove quotes
        .replace(/Laugh break: /g, '') // Remove prefix
        .trim();
      
      onAddSuggestion(cleanSuggestion);
      toast.success('💡 Suggestion added to your input!');
    }
  };

  const handleManualRefresh = () => {
    toast.loading('Fetching fresh suggestion...', { duration: 1000 });
    fetchSuggestion();
  };

  return (
    <AnimatePresence>
      {showSuggestion && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="p-6 border-2 shadow-2xl smart-suggestions-card bg-gradient-to-br from-amber-400 via-orange-400 to-yellow-500 rounded-2xl border-amber-300"
        >
          <div className="flex items-start justify-between gap-4">
            {/* Icon */}
            <motion.div
              animate={{ 
                rotate: loading ? 360 : 0,
                scale: loading ? [1, 1.2, 1] : 1
              }}
              transition={{ 
                duration: 1, 
                repeat: loading ? Infinity : 0,
                ease: "linear"
              }}
              className="flex-shrink-0"
            >
              {loading ? (
                <Loader size={32} className="text-orange-700" />
              ) : (
                <Sparkles size={32} className="text-orange-700" />
              )}
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="flex items-center gap-2 mb-2 text-lg font-bold text-orange-900">
                <Lightbulb size={20} />
                AI-Powered Suggestion
              </h3>
              
              {loading ? (
                <div className="space-y-2">
                  <div className="w-3/4 h-4 rounded bg-orange-700/20 animate-pulse"></div>
                  <div className="w-1/2 h-4 rounded bg-orange-700/20 animate-pulse"></div>
                </div>
              ) : (
                <p className="text-base font-medium leading-relaxed text-orange-900 break-words">
                  {currentSuggestion}
                </p>
              )}

              {/* Source Badge */}
              {!loading && (
                <div className="mt-3">
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-orange-900 rounded-full bg-orange-700/20">
                    {apiSources[currentApiIndex > 0 ? currentApiIndex - 1 : apiSources.length - 1].badge}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col flex-shrink-0 gap-2">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleManualRefresh}
                disabled={loading}
                className="p-2 text-white transition-all bg-orange-600 rounded-full shadow-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Get new suggestion"
              >
                <RefreshCw size={18} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddSuggestion}
                disabled={loading}
                className="px-4 py-2 text-sm font-bold text-white transition-all bg-orange-600 rounded-lg shadow-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                ✨ Add
              </motion.button>
            </div>
          </div>

          {/* API Info Footer */}
          <div className="pt-3 mt-4 border-t border-orange-600/30">
            <div className="flex items-center justify-between text-xs">
              <p className="font-semibold text-orange-800">
                💫 Powered by {apiSources.length} AI APIs
              </p>
              <p className="font-semibold text-orange-800">
                🔄 Auto-refresh: 25s
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SmartSuggestions;
