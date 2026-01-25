"use client";

import {
  fetchRoleSelector,
  RoleSelectorInstance,
  searchRoleSelector,
} from "@/actions/roles/selectorRole";
import { useParams } from "next/navigation";
import BaseSelector, { BaseSelectorProps } from "./BaseSelector";

type RoleSelectorProps = Omit<
  BaseSelectorProps<RoleSelectorInstance>,
  "canCreate"
>;

const RoleSelector = (props_: RoleSelectorProps) => {
  const params = useParams();
  const storeSlug = params.store as string;

  const props = {
    ...props_,
    label: props_.label || "กรุณาเลือกตำแหน่ง",
    placeholder: props_.placeholder || "ค้นหาตำแหน่ง",
  };

  return (
    <BaseSelector<RoleSelectorInstance>
      id="role-selector"
      noOptionsText="ไม่พบตำแหน่ง"
      fetchItem={async (id) => {
        return await fetchRoleSelector(storeSlug, id);
      }}
      searchItems={async (query) => {
        return await searchRoleSelector(storeSlug, query);
      }}
      getItemLabel={(option) =>
        typeof option === "string" ? option : option.name
      }
      getItemKey={(option) => option.id}
      {...props}
    />
  );
};

export default RoleSelector;
