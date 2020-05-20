import * as mitt from 'mitt';

type EventType = string | symbol;

export interface CommonEventEmitter {
  on(event: EventType, handler: mitt.Handler): void;
  off(event: EventType, handler: mitt.Handler): void;
  /* To maintain parity with the built in NodeJS event emitter which uses removeListener
   * rather than `off`.
   * if you're implementing new code you should use off
   */
  removeListener(event: EventType, handler: mitt.Handler): void;
  emit(event: EventType, eventData?: any): void;
  once(event: EventType, handler: mitt.Handler): void;
  listenerCount(event: string): number;
}

export class EventEmitter implements CommonEventEmitter {
  private emitter: mitt.Emitter;
  private listenerCounts = new Map<EventType, number>();

  constructor() {
    this.emitter = mitt();
  }

  on(event: EventType, handler: mitt.Handler): void {
    this.emitter.on(event as string, handler);
    const existingCounts = this.listenerCounts.get(event);
    if (existingCounts) {
      this.listenerCounts.set(event, existingCounts + 1);
    } else {
      this.listenerCounts.set(event, 1);
    }
  }

  off(event: EventType, handler: mitt.Handler): void {
    this.emitter.off(event as string, handler);

    const existingCounts = this.listenerCounts.get(event);
    this.listenerCounts.set(event, existingCounts - 1);
  }

  removeListener(event: EventType, handler: mitt.Handler): void {
    this.off(event, handler);
  }

  emit(event: EventType, eventData?: any): void {
    this.emitter.emit(event as string, eventData);
  }

  once(event: EventType, handler: mitt.Handler): void {
    const onceHandler: mitt.Handler = (eventData) => {
      handler(eventData);
      this.off(event, onceHandler);
    };

    this.on(event, onceHandler);
  }

  listenerCount(event: string): number {
    return this.listenerCounts.get(event) || 0;
  }
}
