export interface JwtSigner {
  sign(payload: Record<string, unknown>, ttl: TimeDuration): Promise<string>;
}

export const JwtSigner = Symbol('JwtSigner');
