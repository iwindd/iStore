"use server";
import { ProductPermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { ProductPreorderSchema, ProductPreorderValues } from "@/schema/Product";

const updatePreorder = async (
  payload: ProductPreorderValues,
  product_id: number
) => {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");
  if (!user.hasPermission(ProductPermissionEnum.UPDATE))
    throw new Error("Unauthorized");

  const validated = ProductPreorderSchema.parse(payload);

  const product = await db.product.update({
    where: { id: product_id },
    data: {
      usePreorder: validated.usePreorder,
    },
  });

  return product;
};

export default updatePreorder;
