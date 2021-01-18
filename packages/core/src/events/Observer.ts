export type ObserverSubscriber<O extends Observer> = O extends Observer<infer A>
  ? (params: A) => void
  : never;
export type ObserverUnsubscriber = () => void;

export class Observer<A = {}> {
  private subscribers: Function[] = [];

  subscribe(subscriber: ObserverSubscriber<this>): ObserverUnsubscriber {
    this.subscribers.push(subscriber);

    return () => {
      // On unsubscribe, we replace the subscriber callback with an empty function
      // This is better than splicing the function - which could cause issues with the notify() below
      this.subscribers[this.subscribers.indexOf(subscriber)] = () => {};
    };
  }

  notify(value: A) {
    this.subscribers.forEach((subscriber) => subscriber(value));
  }

  clear() {
    this.subscribers = [];
  }
}
