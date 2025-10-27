// Helper to add notifications
export const addNotification = (title, message, type = 'reminder') => {
  const notifications = JSON.parse(localStorage.getItem('taskNotifications') || '[]');
  
  const newNotification = {
    id: Date.now().toString(),
    title,
    message,
    type, // 'reminder', 'completed', 'overdue', 'info'
    timestamp: new Date().toISOString(),
    read: false
  };
  
  notifications.unshift(newNotification);
  
  // Keep only last 50 notifications
  const trimmed = notifications.slice(0, 50);
  localStorage.setItem('taskNotifications', JSON.stringify(trimmed));
  
  // Trigger event for NotificationCenter to update
  window.dispatchEvent(new Event('newNotification'));
  
  // Show browser notification if permitted
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body: message,
      icon: '/favicon.ico',
      badge: '/favicon.ico'
    });
  }
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if ('Notification' in window && Notification.permission === 'default') {
    await Notification.requestPermission();
  }
};
