"use server";

import { TableFetch } from "@/components/Datatable";
import db from "@/libs/db";
import { getUser } from "@/libs/session";

const getAllOrderProducts = async (table: TableFetch, orderId: number) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    // Fetch OrderProducts
    const orderProducts = await db.orderProduct.findMany({
      where: {
        order_id: orderId,
        order: {
          store_id: user.store,
        },
      },
      select: {
        id: true,
        count: true,
        total: true,
        cost: true,
        profit: true,
        note: true,
        product: {
          select: {
            serial: true,
            label: true,
            category: {
              select: {
                label: true,
              },
            },
          },
        },
        promotionOffers: {
          select: {
            id: true,
            event: {
              select: {
                note: true,
              },
            },
          },
        },
      },
    });

    // Fetch OrderPreOrderProducts
    const preOrderProducts = await db.orderPreOrder.findMany({
      where: {
        order_id: orderId,
        order: {
          store_id: user.store,
        },
      },
      select: {
        id: true,
        count: true,
        total: true,
        cost: true,
        profit: true,
        note: true,
        status: true,
        product: {
          select: {
            serial: true,
            label: true,
            category: {
              select: {
                label: true,
              },
            },
          },
        },
      },
    });

    // Combine and add type field
    const combinedData = [
      ...orderProducts.map((item) => ({
        ...item,
        type: "PRODUCT" as const,
        status: null,
        promotions: item.promotionOffers
          .map((p) => p.event?.note || `#${p.id}`)
          .join(", "),
      })),
      ...preOrderProducts.map((item) => ({
        ...item,
        type: "PREORDER" as const,
      })),
    ];

    // Apply sorting if specified
    let sortedData = [...combinedData];
    if (table.sort && table.sort.length > 0) {
      const sortField = table.sort[0].field;
      const sortOrder = table.sort[0].sort;

      sortedData.sort((a: any, b: any) => {
        let aValue = a[sortField];
        let bValue = b[sortField];

        // Handle nested fields
        if (sortField.includes(".")) {
          const fields = sortField.split(".");
          aValue = fields.reduce((obj, field) => obj?.[field], a);
          bValue = fields.reduce((obj, field) => obj?.[field], b);
        }

        if (aValue === bValue) return 0;
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        const comparison = aValue < bValue ? -1 : 1;
        return sortOrder === "asc" ? comparison : -comparison;
      });
    }

    // Apply pagination
    const { page, pageSize } = table.pagination;
    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = sortedData.slice(startIndex, endIndex);

    return {
      data: paginatedData.map((item: any) => ({
        ...item,
        total: Number(item.total),
        cost: Number(item.cost),
        profit: Number(item.profit),
      })),
      total: sortedData.length,
    };
  } catch (error) {
    console.error(error);
    return { data: [], total: 0 };
  }
};

export default getAllOrderProducts;
