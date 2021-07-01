import { EditorStore } from '../EditorStore';

export class Query<P extends Record<string, any> = null> {
  protected store: EditorStore;
  readonly params: P;

  constructor(store: EditorStore);
  constructor(store: EditorStore, params: P);
  constructor(store: EditorStore, params?: P) {
    this.store = store;
    this.params = params;
    this.setup();
  }

  protected setup() {}

  find(): this;
  find(params: P): this;
  find(params?: P): this {
    const Constructor = this.constructor;
    // @ts-ignore
    return new Constructor(this.store, params);
  }
}
