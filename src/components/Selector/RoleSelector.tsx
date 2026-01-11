"use client";
import * as Actions from "@/actions/roles";
import { TextFieldProps } from "@mui/material";
import BaseSelector from "./BaseSelector";

interface SelectorProps {
  onSubmit(Product: Actions.RoleSelector | null): void;
  fieldProps?: TextFieldProps;
  defaultValue?: number;
  error?: boolean;
  helperText?: string;
}

const RoleSelector = (props: SelectorProps) => {
  return (
    <BaseSelector<Actions.RoleSelector>
      id="role-selector"
      label="กรุณาเลือกตำแหน่ง"
      placeholder="ค้นหาตำแหน่ง"
      noOptionsText="ไมพบตำแหน่ง"
      defaultValue={props.defaultValue}
      fieldProps={props.fieldProps}
      error={props.error}
      helperText={props.helperText}
      onSubmit={props.onSubmit}
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
    />
  );
};

export default RoleSelector;
