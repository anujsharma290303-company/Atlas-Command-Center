export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
  [key: string]: unknown;
}
