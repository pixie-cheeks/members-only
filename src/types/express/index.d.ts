// to make the file a module and avoid the TypeScript error
export {};

declare global {
  namespace Express {
    export interface User {
      id: number;
      first_name: string;
      last_name: string;
      username: string;
      password: string;
      is_member?: boolean;
      is_admin?: boolean;
    }
  }
}
