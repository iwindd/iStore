"use server";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getServerSession } from "@/libs/session";
import { AddressSchema, AddressValues } from "@/schema/Address";

const UpdateAddress = async (
  payload: AddressValues,
): Promise<ActionResponse<AddressValues>> => {
  try {
    throw new Error("Not implemented yet");
    
  /*     
    TODO:: Implement the address

    const session = await getServerSession();
    const validated = AddressSchema.parse(payload);
    await db.store.update({
      where: {
        id: Number(session?.user.store),
      },
      data: {
        address: validated.address,
        district: validated.district,
        area: validated.area,
        province: validated.province,
        postalcode: validated.postalcode
      },
    });

    return { success: true, data: validated }; 
    */
  } catch (error) {
    return ActionError(error) as ActionResponse<AddressValues>;
  }
};

export default UpdateAddress;
