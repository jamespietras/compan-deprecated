export interface Deferred {
  readonly promise: Promise<any>;
  readonly resolve: (value: any) => any;
  readonly reject: (error: any) => any;
}

export function defer(): Deferred {
  let savedReject: any;
  let savedResolve: any;

  const promise: Promise<any> = new Promise((
    resolve: (value: any) => any,
    reject: (error: any) => any
  ) => {
    savedReject = reject;
    savedResolve = resolve;
  });

  const deferred: Deferred = {
    promise: promise,
    reject: savedReject,
    resolve: savedResolve
  };

  return deferred;
}
