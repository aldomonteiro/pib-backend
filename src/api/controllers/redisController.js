import messenger from '../../messenger';

export const emitEvent = (pageID, eventName, data) => {
    const msgStr = JSON.stringify({ pageID: pageID, eventName: eventName, data: data });
    messenger.publish('redis', msgStr);
}