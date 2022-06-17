/**
 * @class EventManager
 * EventManager class
 * Publish/subscribe
 * parent class for Pagination
 */
export class EventManager {
  /** @constructor */
  constructor() {
    this.events = {};
  }

  /**
   * @param {String} eventName
   * @param {Function} func
   */
  subscribe(eventName, func) {
    this.events[eventName] = func;
  }

  /**
   * @param {String} eventName
   */
  unsubscribe(eventName) {
    if (this.events[eventName]) {
      // eslint-disable-next-line no-unused-vars
      const { [eventName]: remove, ...rest } = this.events;
      this.events = rest;
    }
  }

  /**
   * @param {String} eventName
   * @param  {...any} args
   * @returns {*} - function execution result
   */
  fire(eventName, ...args) {
    const func = this.events[eventName];
    if (func) {
      return func(...args);
    }
  }
}
