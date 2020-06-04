export type User = {
  _id: string;
  email: string;
  avatar: string;
  githubId?: string;
  name: string;
};

export type Message = {
  _id: string;
  user: User;
  createdAt: string;
  text: string;
}