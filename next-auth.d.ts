import NextAuth from "next-auth"

export interface CartItem {
  serial: string,
  title: string,
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string,
      application: string,
      cart: CartItem[]
    }
  }
}