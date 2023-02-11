class EventBus {
    static getInstance() {
      if (typeof EventBus.instance === 'object') {
        return EventBus.instance;
      }
      return new EventBus();
    }
  
    constructor() {
      if (typeof EventBus.instance === 'object') {
        return EventBus.instance;
      }
      EventBus.instance = this;
      this.eventListeners = {};
    }
  
    fireEvent(eventName, data) {
      const listeners = this.eventListeners[eventName];
      if (Array.isArray(listeners)) {
        listeners.map(listener => {
          if (typeof listener === 'function') {
            listener(data);
          }
        });
      }
    }
  
    addListener(eventName, listener) {
      const listeners = this.eventListeners[eventName];
      if (Array.isArray(listeners)) {
        listeners.push(listener);
      } else {
        this.eventListeners[eventName] = [listener];
      }
    }
  
    removeListener(listener) {
      Object.keys(this.eventListeners).map(eventName => {
        const listeners = this.eventListeners[eventName];
        this._remove(listeners, listener);
        if (listeners.length === 0) {
          delete this.eventListeners[eventName];
        }
      });
    }
  
    _remove(array, item) {
      if (!array) return;
      for (let i = 0, l = array.length; i < l; i++) {
        if (item === array[i]) array.splice(i, 1);
      }
    }
  }
  
  export default EventBus.getInstance();
  