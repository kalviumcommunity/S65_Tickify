const Newsletter = require('../models/NewsletterModel');

// Subscribe to newsletter
const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    // Check if already subscribed
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      if (existing.isActive) {
        return res.status(400).json({ message: 'Email already subscribed' });
      } else {
        // Reactivate subscription
        existing.isActive = true;
        await existing.save();
        return res.status(200).json({ message: 'Subscription reactivated!' });
      }
    }

    const newSubscriber = new Newsletter({ email });
    await newSubscriber.save();

    res.status(201).json({ 
      message: 'Successfully subscribed!',
      email: newSubscriber.email 
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ message: 'Failed to subscribe', error: error.message });
  }
};

// Get all subscribers (admin only)
const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find({ isActive: true });
    res.status(200).json({ count: subscribers.length, subscribers });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch subscribers', error: error.message });
  }
};

module.exports = { subscribe, getAllSubscribers };