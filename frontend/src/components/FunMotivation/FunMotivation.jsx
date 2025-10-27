import React, { useState, useEffect } from 'react';
import { Trophy, Star, Zap, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const FunMotivation = ({ checklist }) => {
  const [stats, setStats] = useState({
    completed: 0,
    total: 0,
    streak: 0,
    level: 1
  });

  useEffect(() => {
    const completed = checklist.filter(item => item.completed).length;
    const total = checklist.length;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;
    const level = Math.floor(completed / 5) + 1;

    setStats({ completed, total, streak: completed, level });

    // Show motivational messages
    if (completed > 0 && completed % 5 === 0) {
      const messages = [
        '🎉 Wow! You completed 5 tasks! You\'re on fire!',
        '🚀 Level up! Keep crushing it!',
        '⭐ You\'re unstoppable! 5 more down!',
        '💪 Beast mode activated! 5 tasks conquered!',
        '🏆 Champion status! Another 5 in the bag!'
      ];
      toast.success(messages[Math.floor(Math.random() * messages.length)], {
        icon: '🎊',
        duration: 4000
      });
    }
  }, [checklist]);

  const motivationalQuotes = [
    "You're doing amazing! Keep it up! 💪",
    "Every task completed is a win! 🏆",
    "Small progress is still progress! 🌱",
    "You got this, champion! ⭐",
    "Crushing it one task at a time! 🚀"
  ];

  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
      setCurrentQuote(randomQuote);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const completionPercentage = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fun-motivation-card"
      style={{
        padding: '20px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        marginBottom: '20px',
        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>
            <Trophy size={20} style={{ display: 'inline', marginRight: '8px' }} />
            Level {stats.level} Achiever
          </h3>
          <p style={{ margin: '4px 0 0 0', opacity: 0.9, fontSize: '14px' }}>
            {currentQuote}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '32px', fontWeight: '800', lineHeight: 1 }}>
            {stats.completed}/{stats.total}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>Tasks Done</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{
          width: '100%',
          height: '10px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: '10px',
          overflow: 'hidden'
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.5 }}
            style={{
              height: '100%',
              backgroundColor: '#fbbf24',
              borderRadius: '10px'
            }}
          />
        </div>
        <p style={{ margin: '6px 0 0 0', fontSize: '13px', opacity: 0.9 }}>
          {completionPercentage.toFixed(0)}% Complete 🎯
        </p>
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {stats.completed >= 5 && (
          <span style={{
            padding: '6px 12px',
            borderRadius: '20px',
            backgroundColor: 'rgba(251, 191, 36, 0.3)',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            ⭐ Starter
          </span>
        )}
        {stats.completed >= 10 && (
          <span style={{
            padding: '6px 12px',
            borderRadius: '20px',
            backgroundColor: 'rgba(251, 191, 36, 0.3)',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            🔥 On Fire
          </span>
        )}
        {stats.completed >= 20 && (
          <span style={{
            padding: '6px 12px',
            borderRadius: '20px',
            backgroundColor: 'rgba(251, 191, 36, 0.3)',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            🏆 Legend
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default FunMotivation;
