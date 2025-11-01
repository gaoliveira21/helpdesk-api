export interface JwtSigner {
  sign(payload: Record<string, unknown>, ttlInMs: number): Promise<string>;
}

export const JwtSigner = Symbol('JwtSigner');
