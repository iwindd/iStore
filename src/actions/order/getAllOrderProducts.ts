"use server";

import { TableFetch } from "@/components/Datatable";
import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import {
  assertStore,
  ifNotHasStorePermission,
} from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";

const getAllOrderProducts = async (table: TableFetch, orderId: number) => {
  try {
    const ctx = await getPermissionContext(table.storeIdentifier);
    assertStore(ctx);

    // Fetch OrderProducts
    const orderProducts = await db.orderProduct.findMany({
      where: {
        order: {
          id: orderId,
          store_id: ctx.storeId!,
          creator_id: ifNotHasStorePermission(
            ctx,
            PermissionConfig.store.history.getAllOrderProducts,
            ctx.employeeId,
          ),
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
      },
    });

    // Fetch OrderPreOrderProducts
    const preOrderProducts = await db.orderPreOrder.findMany({
      where: {
        order: {
          id: orderId,
          store_id: ctx.storeId!,
          creator_id: ifNotHasStorePermission(
            ctx,
            PermissionConfig.store.history.getAllOrderProducts,
            ctx.employeeId,
          ),
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

    // Fetch OrderProductPromotionBuyXGetY
    const promotionProducts = await db.orderProductPromotionBuyXGetY.findMany({
      where: {
        order: {
          id: orderId,
          store_id: ctx.storeId!,
          creator_id: ifNotHasStorePermission(
            ctx,
            PermissionConfig.store.history.getAllOrderProducts,
            ctx.employeeId,
          ),
        },
      },
      select: {
        id: true,
        received_count: true,
        free_count: true,
        cost: true,
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
        promotionBuyXGetY: {
          select: {
            event: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // Combine and add type field
    let combinedData = [
      ...orderProducts.map((item) => ({
        ...item,
        type: "PRODUCT",
        status: null,
      })),
      ...preOrderProducts.map((item) => ({
        ...item,
        type: "PREORDER",
      })),
      ...promotionProducts.map((item) => ({
        ...item,
        type: "PROMOTION",
        count: item.received_count,
        status: null,
        promotions: item.promotionBuyXGetY.event?.name || "-",
      })),
    ];

    // Filter data if specified
    if (table.filter && table.filter.items.length > 0) {
      table.filter.items.forEach((filterItem) => {
        const { field, operator, value } = filterItem;
        if (!value) return;

        combinedData = combinedData.filter((item: any) => {
          let itemValue = item[field];

          // Handle nested fields
          if (field.includes(".")) {
            const fields = field.split(".");
            itemValue = fields.reduce((obj, f) => obj?.[f], item);
          }

          if (operator === "equals") {
            return itemValue === value;
          }

          if (operator === "contains") {
            return String(itemValue)
              .toLowerCase()
              .includes(String(value).toLowerCase());
          }
          // Add more operators if needed
          return true;
        });
      });
    }

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
