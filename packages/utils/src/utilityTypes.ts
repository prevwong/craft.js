export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;
export type Delete<T, U> = Pick<T, Exclude<keyof T, U>>;
export type OverwriteFnReturnType<F extends (...args: any) => void, R> = (
  ...args: Parameters<F>
) => Delete<ReturnType<F>, R>;
export type ConditionallyMergeRecordTypes<
  C,
  S extends Record<string, any>
> = C extends null ? S : C & S;
