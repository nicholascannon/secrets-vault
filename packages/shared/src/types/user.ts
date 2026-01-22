export interface User {
  id: string;
  email: string;
  firstName: string | undefined;
  lastName: string | undefined;
  imageUrl: string | undefined;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
}
