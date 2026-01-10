"use client";
import * as EventActions from "@/actions/broadcast/eventActions";
import { TextFieldProps } from "@mui/material";
import dayjs from "dayjs";
import BaseSelector from "./BaseSelector";

interface SelectorProps {
  onSubmit(event: EventActions.EventSelectorItem | null): void;
  fieldProps?: TextFieldProps;
  defaultValue?: number;
  error?: boolean;
  helperText?: string;
}

const EventSelector = (props: SelectorProps) => {
  return (
    <BaseSelector<EventActions.EventSelectorItem>
      id="event-selector"
      label="กรุณาเลือกโปรโมชั่น"
      placeholder="ค้นหาโปรโมชั่น (Note)"
      noOptionsText="ไม่พบโปรโมชั่น"
      defaultValue={props.defaultValue}
      fieldProps={props.fieldProps}
      error={props.error}
      helperText={props.helperText}
      onSubmit={props.onSubmit}
      fetchItem={async (id) => {
        const resp = await EventActions.findEvent(id);
        return resp || null;
      }}
      searchItems={async (query) => {
        const resp = await EventActions.searchEvents(query);
        return resp || [];
      }}
      getItemLabel={(option) =>
        typeof option === "string"
          ? option
          : option.note || `Promotion #${option.id}`
      }
      getItemKey={(option) => option.id}
      renderCustomOption={(option) => (
        <>
          {option.id === props.defaultValue ? "(เลือกแล้ว) " : ""}
          {dayjs(option.start_at).format("DD/MM/YY")} -{" "}
          {dayjs(option.end_at).format("DD/MM/YY")}
        </>
      )}
    />
  );
};

export default EventSelector;
