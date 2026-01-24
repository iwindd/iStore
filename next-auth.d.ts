import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      first_name: string;
      last_name: string;
      email: string;
    };
  }
}
