class NotificationService {
  constructor() {
    this.notifications = [];
    this.subscribers = [];
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  getNotifications() {
    return this.notifications;
  }

  getUnreadCount() {
    return this.notifications.filter(n => n.unread).length;
  }
}

export default new NotificationService();