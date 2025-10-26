export type Config = {
  auth: {
    jwtSecret: string;
    jwtExpiresIn: number;
  };
};

export interface ConfProvider {
  get<P extends GetKeys<Config>>(path: P): ValueAtPath<Config, P>;
}
