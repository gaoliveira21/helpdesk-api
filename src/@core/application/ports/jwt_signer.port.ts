export interface JwtSigner {
  sign(payload: Record<string, unknown>, ttlInMs: number): Promise<string>;
}
