"use client";
import React from 'react'
import Cart from './components/Cart';
import Cashier from './components/Cashier';
import { AddToCashier } from './action';
import { useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';

export interface CashierPageChildType {
  addProductToCart: (serial: string) => void
}

const CashierPage = () => {
  const { data: session, update } = useSession();
  const { enqueueSnackbar } = useSnackbar();

  const addProductToCart = async (serial: string) => {
    const resp = await AddToCashier({ serial });

    if (!resp.success || session?.user.retail == undefined) {
      if (resp.error == "no_found_product") {
        enqueueSnackbar(`ไม่พบสินค้า ${serial}`, { variant: "error" })
      }

      return
    };
    
    const cart = session?.user.cart == null ? [] : session.user.cart;
    const product = cart.find(p => p.serial == serial && p.retail == session?.user.retail);
    if (!product) {
      cart.push({
        id: resp.data?.id as number,
        serial: resp.data?.serial as string,
        title: resp.data?.title as string,
        price: resp.data?.price as number,
        count: 1,
        category: resp.data?.category.title as string,
        retail: session?.user.retail as boolean
      })
    } else {
      product.count++
    }

    await update({
      ...session,
      user: {
        ...session?.user,
        cart
      }
    })
  }

  return (
    <>
      <Cashier addProductToCart={addProductToCart} />
      <Cart addProductToCart={addProductToCart} />
    </>
  )
}

export default CashierPage