import * as mitt from 'mitt';

export class EventEmitter {
  private emitter: mitt.Emitter;
  private listenerCounts = new Map<string, number>();

  private constructor() {
    this.emitter = mitt();
  }

  on(event: string, handler: mitt.Handler): void {
    this.emitter.on(event, handler);
    const existingCounts = this.listenerCounts.get(event);
    if (existingCounts) {
      this.listenerCounts.set(event, existingCounts + 1);
    } else {
      this.listenerCounts.set(event, 1);
    }
  }

  off(event: string, handler: mitt.Handler): void {
    this.emitter.off(event, handler);

    const existingCounts = this.listenerCounts.get(event);
    this.listenerCounts.set(event, existingCounts - 1);
  }

  emit(event: string, eventData?: any): void {
    this.emitter.emit(event, eventData);
  }

  once(event: string, handler: mitt.Handler): void {
    const onceHandler: mitt.Handler = (eventData) => {
      handler(eventData);
      this.off(event, onceHandler);
    };

    this.emitter.on(event, onceHandler);
  }

  listenerCount(event: string): number {
    return this.listenerCounts.get(event) || 0;
  }
}
