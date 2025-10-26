type StopTypes = number | string | boolean | symbol | bigint | Date;

type ExcludedTypes = (...args: any[]) => any;

type Dot<T extends string, U extends string> = '' extends U ? T : `${T}.${U}`;

type GetKeys<T> = T extends StopTypes
  ? ''
  : T extends readonly unknown[]
    ? GetKeys<T[number]>
    : {
        [K in keyof T & string]: T[K] extends StopTypes
          ? K
          : T[K] extends ExcludedTypes
            ? never
            : K | Dot<K, GetKeys<T[K]>>;
      }[keyof T & string];
