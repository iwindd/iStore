"use client";
import * as EventActions from "@/actions/broadcast/eventActions";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import BaseSelector, { BaseSelectorProps } from "./BaseSelector";

type EventSelectorProps = Omit<
  BaseSelectorProps<EventActions.EventSelectorItem>,
  "canCreate"
>;

const EventSelector = (props_: EventSelectorProps) => {
  const params = useParams<{ store: string }>();
  const props = {
    ...props_,
    label: props_.label || "กรุณาเลือกโปรโมชั่น",
    placeholder: props_.placeholder || "ค้นหาโปรโมชั่น",
  };

  return (
    <BaseSelector<EventActions.EventSelectorItem>
      id="event-selector"
      noOptionsText="ไม่พบโปรโมชั่น"
      fetchItem={async (id) => {
        const resp = await EventActions.findEvent(params.store, id);
        return resp || null;
      }}
      searchItems={async (query) => {
        const resp = await EventActions.searchEvents(params.store, query);
        return resp || [];
      }}
      getItemLabel={(option) =>
        typeof option === "string"
          ? option
          : option.name || option.note || `Promotion #${option.id}`
      }
      getItemKey={(option) => option.id}
      renderCustomOption={(option) => (
        <>
          {option.id === props.defaultValue ? "(เลือกแล้ว) " : ""}
          {dayjs(option.start_at).format("DD/MM/YY")} -{" "}
          {dayjs(option.end_at).format("DD/MM/YY")}
        </>
      )}
      {...props}
    />
  );
};

export default EventSelector;
