export interface CsrfGenerator {
  generate(): string;
}

export const CsrfGenerator = Symbol('CsrfGenerator');
