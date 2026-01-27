"use client";

import { searchNonEmployeeUsers } from "@/actions/user/searchNonEmployeeUsers";
import { Typography } from "@mui/material";
import { User } from "@prisma/client";
import { useParams } from "next/navigation";
import BaseSelector, { BaseSelectorProps } from "./BaseSelector";

type UserSelectorProps = Omit<BaseSelectorProps<Partial<User>>, "canCreate">;

const UserSelector = (props_: UserSelectorProps) => {
  const params = useParams();
  const storeSlug = params.store as string;

  const props = {
    ...props_,
    label: props_.label || "ค้นหาผู้ใช้",
    placeholder: props_.placeholder || "พิมพ์ชื่อ หรือ อีเมล เพื่อค้นหา",
  };

  return (
    <BaseSelector<Partial<User>>
      id="user-selector"
      noOptionsText="ไม่พบผู้ใช้"
      // fetching single item is not strictly needed for this use case if we only select from search
      // but BaseSelector might require it if we pass a default value that only has ID.
      // For now, let's assume we won't load with a pre-selected user ID without the user object.
      // Or we can implement a fetchUserById action if needed.
      fetchItem={async (id) => {
        // Implement if needed: return await fetchUserById(id);
        return {} as any;
      }}
      searchItems={async (query) => {
        return await searchNonEmployeeUsers(storeSlug, query);
      }}
      getItemLabel={(option) =>
        typeof option === "string"
          ? option
          : `${option.first_name} ${option.last_name}`
      }
      renderCustomOption={(option) => (
        <div>
          <Typography variant="caption" color="text.secondary">
            {option.email}
          </Typography>
        </div>
      )}
      getItemKey={(option) => option.id!}
      {...props}
    />
  );
};

export default UserSelector;
