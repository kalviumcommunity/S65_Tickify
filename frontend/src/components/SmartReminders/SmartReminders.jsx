import React, { useState, useEffect } from 'react';
import { Bell, Clock, X, Plus, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// Global audio storage - persists across re-renders
let globalAudioInstance = null;

const SmartReminders = ({ checklist }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [taskReminders, setTaskReminders] = useState({});
  const [showTaskSelector, setShowTaskSelector] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [reminderTime, setReminderTime] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);

  // Alarm sound - looping notification
  const alarmSound = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';

  // Play looping alarm - stored globally
  const playAlarmSound = () => {
    try {
      // Stop any existing alarm first
      if (globalAudioInstance) {
        globalAudioInstance.pause();
        globalAudioInstance.currentTime = 0;
      }

      const audio = new Audio(alarmSound);
      audio.volume = 0.7;
      audio.loop = true;
      
      audio.play().catch(err => {
        console.log('Audio play error:', err);
      });

      globalAudioInstance = audio;
      setIsAlarmPlaying(true);

      // Stop after 1 minute
      setTimeout(() => {
        if (globalAudioInstance) {
          globalAudioInstance.pause();
          globalAudioInstance.currentTime = 0;
          globalAudioInstance = null;
          setIsAlarmPlaying(false);
        }
      }, 60000);

      return audio;
    } catch (error) {
      console.log('Audio error:', error);
      return null;
    }
  };

  // Stop alarm - works from anywhere
  const stopAlarm = () => {
    console.log('stopAlarm called');
    if (globalAudioInstance) {
      console.log('Stopping audio...');
      globalAudioInstance.pause();
      globalAudioInstance.currentTime = 0;
      globalAudioInstance = null;
    }
    setIsAlarmPlaying(false);
  };

  // Make stopAlarm accessible globally
  useEffect(() => {
    window.stopTickifyAlarm = stopAlarm;
    console.log('stopTickifyAlarm registered on window');
    
    return () => {
      delete window.stopTickifyAlarm;
      if (globalAudioInstance) {
        globalAudioInstance.pause();
        globalAudioInstance = null;
      }
    };
  }, []);

  useEffect(() => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        setNotificationsEnabled(true);
      }
    }

    loadAndRescheduleReminders();

    return () => {
      if (globalAudioInstance) {
        globalAudioInstance.pause();
        globalAudioInstance = null;
      }
    };
  }, []);

  // Load and reschedule reminders
  const loadAndRescheduleReminders = () => {
    const saved = localStorage.getItem('tickify_task_reminders');
    if (!saved) return;

    try {
      const parsedReminders = JSON.parse(saved);
      const now = new Date();
      const validReminders = {};

      Object.entries(parsedReminders).forEach(([taskId, reminder]) => {
        const reminderTime = new Date(reminder.datetime);
        
        if (reminderTime > now) {
          validReminders[taskId] = {
            ...reminder,
            timerId: null
          };
        }
      });

      setTaskReminders(validReminders);

      Object.entries(validReminders).forEach(([taskId, reminder]) => {
        scheduleTaskReminder(taskId, reminder.datetime, reminder.taskText, false);
      });

    } catch (error) {
      console.error('Error loading reminders:', error);
    }
  };

  // Request notification permission
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('Your browser doesn\'t support notifications 😢', {
        duration: 5000
      });
      return;
    }

    if (Notification.permission === 'denied') {
      toast.error(
        '⚠️ Notifications are BLOCKED!\n\n' +
        'On Mac: System Settings → Notifications → Chrome → Enable\n' +
        'In Chrome: Settings → Site Settings → Notifications → Allow',
        {
          duration: 10000,
          style: {
            background: '#ef4444',
            color: 'white',
            fontSize: '14px'
          }
        }
      );
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        
        const notification = new Notification('✅ Tickify Notifications Enabled!', {
          body: 'You\'ll get alerts with sound even when using other apps!\n\nReminders will ring for 60 seconds.',
          icon: '/logo.png',
          badge: '/logo.png',
          tag: 'tickify-welcome',
          requireInteraction: false,
          silent: false,
          vibrate: [200, 100, 200]
        });

        const audio = new Audio(alarmSound);
        audio.volume = 0.5;
        audio.play().catch(err => console.log(err));
        setTimeout(() => audio.pause(), 2000);

        toast.success('🔔 System notifications enabled!', { duration: 3000 });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };

      } else {
        toast.error(
          '❌ Permission denied!\n\nPlease enable notifications:\n' +
          '1. Click the lock icon in address bar\n' +
          '2. Allow notifications for this site',
          {
            duration: 8000
          }
        );
      }
    } catch (error) {
      console.error('Notification error:', error);
      toast.error('Error setting up notifications');
    }
  };

  // Schedule reminder
  const scheduleTaskReminder = (taskId, datetime, taskText, saveToStorage = true) => {
    const scheduledTime = new Date(datetime);
    const now = new Date();

    if (scheduledTime <= now) {
      if (saveToStorage) {
        toast.error('Please select a future date and time!');
      }
      return;
    }

    const timeUntilReminder = scheduledTime.getTime() - now.getTime();

    const timerId = setTimeout(() => {
      if (notificationsEnabled && Notification.permission === 'granted') {
        
        const notification = new Notification('⏰ TICKIFY TASK REMINDER', {
          body: `🔔 TIME TO WORK ON:\n\n"${taskText}"\n\n⚠️ Alarm is ringing! Click to stop.`,
          icon: '/logo.png',
          badge: '/logo.png',
          tag: `tickify-urgent-${taskId}`,
          requireInteraction: true,
          silent: false,
          vibrate: [300, 100, 300, 100, 300, 100, 300],
          renotify: true,
          sticky: true
        });

        playAlarmSound();

        notification.onclick = () => {
          console.log('Notification clicked!');
          window.focus();
          
          if (window.stopTickifyAlarm) {
            window.stopTickifyAlarm();
          } else {
            if (globalAudioInstance) {
              globalAudioInstance.pause();
              globalAudioInstance.currentTime = 0;
              globalAudioInstance = null;
            }
            setIsAlarmPlaying(false);
          }
          
          notification.close();
          toast.success(`✅ Alarm stopped for: "${taskText}"`);
        };

        notification.onclose = () => {
          console.log('Notification closed');
        };

        notification.onerror = (error) => {
          console.error('Notification error:', error);
          toast.error('Notification failed - check browser settings!');
        };

        toast((t) => (
          <div className="flex flex-col gap-3 p-2">
            <div className="flex items-center gap-2">
              <Bell className="animate-pulse" size={24} />
              <div className="text-xl font-bold">⏰ TASK REMINDER!</div>
            </div>
            <div className="text-base font-semibold">{taskText}</div>
            <button
              onClick={() => {
                console.log('Toast stop button clicked');
                if (window.stopTickifyAlarm) {
                  window.stopTickifyAlarm();
                } else {
                  if (globalAudioInstance) {
                    globalAudioInstance.pause();
                    globalAudioInstance.currentTime = 0;
                    globalAudioInstance = null;
                  }
                  setIsAlarmPlaying(false);
                }
                notification.close();
                toast.dismiss(t.id);
              }}
              className="px-6 py-3 mt-2 text-lg font-bold text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              🔇 STOP ALARM
            </button>
          </div>
        ), {
          duration: 60000,
          position: 'top-center',
          style: {
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            fontSize: '16px',
            padding: '24px',
            border: '3px solid white',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
          }
        });
      }
      
      const updatedReminders = { ...taskReminders };
      delete updatedReminders[taskId];
      setTaskReminders(updatedReminders);
      localStorage.setItem('tickify_task_reminders', JSON.stringify(updatedReminders));
      
    }, timeUntilReminder);

    const newReminder = {
      taskId,
      taskText,
      datetime,
      timerId,
      active: true,
      formattedTime: scheduledTime.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const updatedReminders = { ...taskReminders, [taskId]: newReminder };
    setTaskReminders(updatedReminders);
    
    if (saveToStorage) {
      const reminderToSave = { ...newReminder };
      delete reminderToSave.timerId;
      
      const allReminders = { ...taskReminders, [taskId]: reminderToSave };
      Object.keys(allReminders).forEach(key => {
        if (allReminders[key].timerId) {
          delete allReminders[key].timerId;
        }
      });
      
      localStorage.setItem('tickify_task_reminders', JSON.stringify(allReminders));
      toast.success(`✅ Alarm set for "${taskText}"!`, { duration: 3000 });
    }
  };

  const handleSetTaskReminder = () => {
    if (!selectedTask) {
      toast.error('Please select a task!');
      return;
    }

    if (!reminderDate || !reminderTime) {
      toast.error('Please select both date and time!');
      return;
    }

    const datetime = `${reminderDate}T${reminderTime}`;
    const task = checklist.find(t => t._id === selectedTask);
    
    if (task) {
      scheduleTaskReminder(selectedTask, datetime, task.text);
      setShowTaskSelector(false);
      setSelectedTask(null);
      setReminderDate('');
      setReminderTime('');
    }
  };

  const removeTaskReminder = (taskId) => {
    const reminder = taskReminders[taskId];
    if (reminder?.timerId) {
      clearTimeout(reminder.timerId);
    }
    
    const updatedReminders = { ...taskReminders };
    delete updatedReminders[taskId];
    setTaskReminders(updatedReminders);
    
    const remindersCopy = { ...updatedReminders };
    Object.keys(remindersCopy).forEach(key => {
      if (remindersCopy[key].timerId) {
        delete remindersCopy[key].timerId;
      }
    });
    localStorage.setItem('tickify_task_reminders', JSON.stringify(remindersCopy));
    
    toast.success('Reminder removed!');
  };

  const incompleteTasks = checklist.filter(task => !task.completed);
  const today = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toTimeString().slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 text-white shadow-2xl smart-reminders-card bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Bell size={28} className="animate-pulse" />
          <h3 className="text-xl font-bold">System Alarms</h3>
        </div>
        
        <button
          onClick={requestNotificationPermission}
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
            notificationsEnabled
              ? 'bg-green-500 text-white'
              : 'bg-white/20 hover:bg-white/30'
          }`}
        >
          {notificationsEnabled ? '✅ Enabled' : '🔔 Enable'}
        </button>
      </div>

      <div className="p-3 mb-4 text-sm rounded-lg bg-white/10">
        <p className="mb-2 font-semibold">🔊 <strong>Works in other apps!</strong></p>
        <p className="text-white/90">
          • Rings for 60 seconds<br/>
          • Shows desktop popup<br/>
          • System-wide notifications
        </p>
      </div>

      {isAlarmPlaying && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={stopAlarm}
          className="flex items-center justify-center w-full gap-2 px-4 py-4 mb-4 text-lg font-bold bg-red-600 rounded-lg hover:bg-red-700 animate-pulse"
        >
          🔇 STOP ALARM NOW
        </motion.button>
      )}

      <button
        onClick={() => setShowTaskSelector(!showTaskSelector)}
        disabled={!notificationsEnabled || incompleteTasks.length === 0}
        className="flex items-center justify-center w-full gap-2 px-4 py-3 mb-4 font-semibold transition-all rounded-lg bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus size={18} />
        {notificationsEnabled ? 'Set Task Alarm' : 'Enable Notifications First'}
      </button>

      <AnimatePresence>
        {showTaskSelector && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 mb-4 space-y-3 rounded-lg bg-white/10"
          >
            <div>
              <label className="block mb-2 text-sm font-semibold">Select Task:</label>
              <select
                value={selectedTask || ''}
                onChange={(e) => setSelectedTask(e.target.value)}
                className="w-full px-4 py-2 text-white border-2 rounded-lg bg-white/20 border-white/30 focus:outline-none focus:border-white/50"
              >
                <option value="" disabled>Choose a task...</option>
                {incompleteTasks.map((task) => (
                  <option key={task._id} value={task._id} className="text-gray-900">
                    {task.text.length > 50 ? task.text.substring(0, 50) + '...' : task.text}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold">Date:</label>
              <input
                type="date"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                min={today}
                className="w-full px-4 py-2 text-white border-2 rounded-lg bg-white/20 border-white/30 focus:outline-none focus:border-white/50"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold">Time:</label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                min={reminderDate === today ? currentTime : undefined}
                className="w-full px-4 py-2 text-white border-2 rounded-lg bg-white/20 border-white/30 focus:outline-none focus:border-white/50"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSetTaskReminder}
                className="flex-1 px-4 py-2 font-semibold transition-all bg-green-500 rounded-lg hover:bg-green-600"
              >
                ✓ Set Alarm
              </button>
              <button
                onClick={() => {
                  setShowTaskSelector(false);
                  setSelectedTask(null);
                  setReminderDate('');
                  setReminderTime('');
                }}
                className="px-4 py-2 font-semibold transition-all bg-red-500 rounded-lg hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {Object.keys(taskReminders).length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase text-white/70">
            <AlertCircle size={14} />
            Active Alarms ({Object.keys(taskReminders).length}):
          </p>
          <div className="space-y-2 overflow-y-auto max-h-64">
            {Object.entries(taskReminders).map(([taskId, reminder]) => (
              <motion.div
                key={taskId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start justify-between p-3 rounded-lg bg-white/10"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">🔔 {reminder.taskText}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock size={12} />
                    <span className="text-xs text-white/80">{reminder.formattedTime}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeTaskReminder(taskId)}
                  className="ml-2 text-red-300 hover:text-red-100"
                >
                  <X size={18} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {incompleteTasks.length === 0 && notificationsEnabled && (
        <div className="p-3 mt-4 text-center rounded-lg bg-white/10">
          <p className="text-sm text-white/80">
            🎉 All tasks done! Add tasks to set alarms.
          </p>
        </div>
      )}

      {notificationsEnabled && (
        <div className="pt-4 mt-4 text-sm text-center border-t border-white/20">
          <p className="text-white/80">
            {isAlarmPlaying ? '🔊 ALARM PLAYING' : '🔕 Silent'} • {incompleteTasks.length} tasks • {Object.keys(taskReminders).length} alarms
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default SmartReminders;
