import NextAuth from "next-auth"

export interface CartItem {
  id: number,
  serial: string,
  title: string,
  price: number,
  count: number,
  category: string,
  retail: boolean
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string,
      application: number,
      cart: CartItem[],
      retail: boolean
    }
  }
}