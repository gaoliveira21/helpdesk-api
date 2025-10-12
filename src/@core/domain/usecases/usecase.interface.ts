export type Failure = { error: Error; data: null };
export type Success<T> = T extends void
  ? { error: null }
  : { error: null; data: T };

export type Result<T> = Failure | Success<T>;

export interface UseCase<Input, Output> {
  execute(input: Input): Promise<Result<Output>> | Result<Output>;
}
