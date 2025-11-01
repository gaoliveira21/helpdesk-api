export type Config = {
  auth: {
    secret: string;
    accessTokenExpiresIn: number;
    refreshTokenExpiresIn: number;
  };
};

export interface ConfProvider {
  get<P extends GetKeys<Config>>(path: P): ValueAtPath<Config, P>;
}

export const ConfProvider = Symbol('ConfProvider');
