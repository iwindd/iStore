"use client";
import * as Actions from "@/actions/roles";
import BaseSelector, { BaseSelectorProps } from "./BaseSelector";

type RoleSelectorProps = Omit<
  BaseSelectorProps<Actions.RoleSelectorItem>,
  "canCreate"
>;

const RoleSelector = (props_: RoleSelectorProps) => {
  const props = {
    ...props_,
    label: props_.label || "กรุณาเลือกตำแหน่ง",
    placeholder: props_.placeholder || "ค้นหาตำแหน่ง",
  };

  return (
    <BaseSelector<Actions.RoleSelectorItem>
      id="role-selector"
      noOptionsText="ไมพบตำแหน่ง"
      fetchItem={async (id) => {
        const resp = await Actions.find(id);
        return resp.success && resp.data ? resp.data : null;
      }}
      searchItems={async (query) => {
        const resp = await Actions.selector(query);
        return resp.data || [];
      }}
      getItemLabel={(option) =>
        typeof option === "string" ? option : option.label
      }
      getItemKey={(option) => option.id}
      renderCustomOption={(option) => (
        <>{option.id == props.defaultValue ? "(เลือก) " : ""}</>
      )}
      {...props}
    />
  );
};

export default RoleSelector;
