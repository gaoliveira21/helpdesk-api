import { JwtSigner } from './jwt_signer.port';
import { JwtVerifier } from './jwt_verifier.port';

export interface JwtSignerVerifier extends JwtSigner, JwtVerifier {}

export const JwtSignerVerifier = Symbol('JwtSignerVerifier');
