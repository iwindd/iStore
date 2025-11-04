import "next-auth";

interface StoreAddress {
  address?: string;
  district?: string;
  area?: string;
  province?: string;
  postalcode?: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      userStoreId: number;
      store: string;
      name: string;
      email: string;
      line_token: string;
      address: StoreAddress | null;
      permission: string;
    };
  }
}
