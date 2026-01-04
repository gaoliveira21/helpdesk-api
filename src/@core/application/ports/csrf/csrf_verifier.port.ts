export interface CsrfVerifier {
  verify(token: string): boolean;
}

export const CsrfVerifier = Symbol('CsrfVerifier');
