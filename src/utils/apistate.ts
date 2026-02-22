export type ApiState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T; fetchedAt: number }
  | { status: "error"; error: string; retryCount: number };


type QueryResult<T> = {
  isUninitialized?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  data?: T;
};

export function mapApiState<T>(
  result: QueryResult<T>,
  retryCount = 0,
): ApiState<T> {
  if (result.isUninitialized) {
    return { status: "idle" };
  }

  if (result.isLoading) {
    return { status: "loading" };
  }

  if (result.isError) {
    return {
      status: "error",
      error: "Failed to fetch data",
      retryCount,
    };
  }

  if (result.data) {
    return {
      status: "success",
      data: result.data,
      fetchedAt: Date.now(),
    };
  }

  return { status: "idle" };
}