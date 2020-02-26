// media breakpoint - small screen min width
var smallScreenMin = 768;

// default className for NotificationsSystem component
var notificationsSystemClassName = 'notifications-system';

// default className for NotificationsContainer component
var notificationsContainerClassName = {
  main: 'notifications-container',
  position: function position(_position: any) {
    return 'notifications-container--' + _position;
  }
};

// default transition for Notification component
var notificationsContainerTransition = {
  enterTimeout: 500,
  leaveTimeout: 900,
  name: {
    enter: 'notification-enter',
    leave: 'notification-leave'
  }
};

// default className for Notification component
var notificationClassName = {
  wrapper: 'notification-wrapper',
  main: 'notification',
  meta: 'notification-meta',
  title: 'notification-title',
  message: 'notification-message',
  icon: 'fa notification-icon',
  imageContainer: 'notification-image-container',
  image: 'notification-image',
  status: function status(_status: any) {
    return 'notification--' + _status;
  },
  dismissible: 'notification--dismissible',
  // `fa` corresponds to font-awesome's class name
  buttons: function buttons(count: any) {
    if (count === 0) {
      return '';
    } else if (count === 1) {
      return 'notification--buttons-1';
    } else if (count === 2) {
      return 'notification--buttons-2';
    }
    return 'notification-buttons';
  },
  closeButtonContainer: 'notification-close-button-container',
  closeButton: 'notification-close-button',
  button: 'notification-button',
  buttonText: 'notification-button-text'
};

const theme = {
  smallScreenMin,
  notificationsSystem: {
    className: notificationsSystemClassName
  },
  notificationsContainer: {
    className: notificationsContainerClassName,
    transition: notificationsContainerTransition
  },
  notification: {
    className: notificationClassName
  }
};

export default theme;