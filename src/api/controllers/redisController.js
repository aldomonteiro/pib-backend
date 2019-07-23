import messenger from '../../messenger';

export const emitEventBotWebapp = (pageID, eventName, data) => {
  const msgStr = JSON.stringify({ pageID: pageID, eventName: eventName, data: data });
  messenger.publish('bot-to-webapp', msgStr);
}

export const emitEventBotWhats = (whatsAppId, userId, message) => {
  const msgStr = JSON.stringify({ whatsAppId: whatsAppId, userId: userId, message: message });
  messenger.publish('bot-to-whats', msgStr);
}