import React, { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const NewsletterForm = ({ isDarkMode }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ⭐ FIXED: Added missing closing brace
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address! 📧');
      return;
    } // ⭐ This brace was missing!

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URI}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setSubscribed(true);
        toast.success('🎉 Welcome aboard! Check your inbox!');
        setEmail('');
        setTimeout(() => setSubscribed(false), 5000);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Oops! Something went wrong. Try again! 😅');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error('Failed to subscribe. Please try again later!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: isDarkMode
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '50px 30px',
        borderRadius: '20px',
        maxWidth: '800px',
        margin: '40px auto',
        textAlign: 'center',
        color: 'white',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}
    >
      <Mail size={48} style={{ margin: '0 auto 20px', display: 'block' }} />
      <h2 style={{ fontSize: '32px', marginBottom: '15px', fontWeight: 'bold' }}>
        Stay in the Loop! 📬
      </h2>
      <p style={{ fontSize: '16px', marginBottom: '30px', opacity: 0.95 }}>
        Get productivity tips, funny task ideas, and exclusive updates delivered to your inbox. No spam, just good vibes! ✨
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '20px'
        }}
      >
        {!subscribed ? (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
              style={{
                flex: '1',
                minWidth: '250px',
                padding: '14px 20px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '15px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '14px 30px',
                borderRadius: '10px',
                border: 'none',
                background: loading ? '#9CA3AF' : '#10B981',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '15px',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s'
              }}
            >
              {loading ? 'Subscribing...' : (
                <>
                  Subscribe
                  <Send size={18} />
                </>
              )}
            </button>
          </>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(16, 185, 129, 0.2)',
            padding: '14px 30px',
            borderRadius: '10px',
            fontWeight: 'bold'
          }}>
            <CheckCircle size={24} />
            You're all set! Welcome to Tickify! 🎉
          </div>
        )}
      </form>

      <p style={{ fontSize: '13px', opacity: 0.8 }}>
        We respect your privacy. Unsubscribe anytime.
      </p>
    </motion.div>
  );
};

export default NewsletterForm;
