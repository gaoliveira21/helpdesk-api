export type Config = {
  app: {
    port: number;
    env: Environment;
  };
  auth: {
    secret: string;
    accessTokenExpiresIn: TimeDuration;
    refreshTokenExpiresIn: TimeDuration;
  };
  csrf: {
    secret: string;
  };
  allowedOrigins: string[];
};

export interface ConfProvider {
  get<P extends GetKeys<Config>>(path: P): ValueAtPath<Config, P>;
}

export const ConfProvider = Symbol('ConfProvider');
