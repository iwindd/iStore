"use server";

import Prisma from "@/libs/prisma";
import { getServerSession } from "@/libs/session";
import { Inputs } from "./schema";
import { CartItem } from "../../../next-auth";
import { Activity } from "@/libs/activity";

interface Product extends CartItem {
  price: number,
  cost: number,
  count: number
}

export const AddToCashier = async (payload: Inputs) => {
  try {
    const session = await getServerSession();
    const data = await Prisma.product.findFirst({
      where: {
        serial: payload.serial,
        application: session?.user.application
      },
      include: {
        category: true
      }
    })

    if (!data) {
      return {
        success: false,
        error: "no_found_product"
      }
    }

    const cart = session?.user.cart == null ? [] : session.user.cart
    const product = cart.find(p => p.serial == data.serial );

    if (!product) {
      cart.push({
        id: data.id,
        serial: data.serial,
        title: data.title,
        price: data.price,
        count: 1,
        category: data.category.title,
        stock: data.stock
      })
    } else { product.count++ }

    return {
      success: true,
      cart: cart
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error
    }
  }
}

export const PaymentAction = async (paymentPayload: {
  note: string,
  type: 0 | 1
}) => {
  try {
    const session = await getServerSession();
    const cart = session?.user.cart || [];

    if (cart.length <= 0) return;

    const payload: Product[] = cart.map((p) => {
      return {
        ...p,
        price: 0,
        cost: 0
      }
    })

    const data = await Prisma.product.findMany({
      where: {
        application: session?.user.application,
        serial: { in: payload.map(p => p.serial) }
      },
      include: {
        category: true
      }
    })

    const products = data
      .map((product) => {
        const count = (payload.find(p => p.id == product.id) as Product).count
        return {
          serial: product.serial,
          title: product.title,
          price: product.price,
          cost: product.cost,
          count: count,
          category: product.category.title,
          overStock: count > product.stock
        }
      })

    const Order = await Prisma.order.create({
      data: {
        ...paymentPayload,
        price: products.reduce((total, p) => total + p.price * p.count, 0),
        cost: products.reduce((total, p) => total + p.cost * p.count, 0),
        profit: products.reduce((total, p) => total + p.price * p.count, 0) - products.reduce((total, p) => total + p.cost * p.count, 0),
        productsText: products.map(p => p.title).join(", "),
        products: { create: products },
        application: session?.user.application as number
      }
    })

    await Prisma.$transaction(
      data.map((p) => {
        const count = (payload.find(pl => pl.id == p.id) as Product).count;

        return Prisma.product.update({
          where: {
            application: session?.user.application as number,
            id: p.id,
          },
          data: {
            stock: p.stock - count,
            sold: p.sold + count
          }
        })
      })
    )

    Activity({
      category: "Cashier",
      type: "PAYMENT",
      data: {
        id: Order.id,
      }
    })

    return {
      success: true,
      data: Order
    }
  } catch (error) {
    return {
      success: false,
      error: error
    }
  }
}

export const getFavoriteItems = async () => {
  try {
    const session = await getServerSession()
    const products = await Prisma.product.findMany({
      where: {
        application: session?.user.application,
        favorite: true
      },
      select: {
        serial: true,
        title: true,
        keywords: true
      }
    })

    return {
      success: true,
      data: products
    }
  } catch (error) {
    return {
      success: false,
      error
    }
  }
}

export const getLastCashierActivity = async () => {
  try {
    const session = await getServerSession()
    const activities = await Prisma.activity.findMany({
      where: {
        application: session?.user.application as number,
        category: "Cashier",
        type: "PAYMENT"
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 5
    })

    return {
      success: true,
      data: activities
    }
  } catch (error) {
    return {
      success: false,
      data: []
    }
  }
}