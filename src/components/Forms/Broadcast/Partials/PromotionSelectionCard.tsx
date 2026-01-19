import {
  EventSelectorItem,
  getEventPromotionDetails,
} from "@/actions/broadcast/eventActions";
import EventSelector from "@/components/Selector/EventSelector";
import { CreateBroadcastValues } from "@/schema/Broadcast";
import {
  Card,
  CardContent,
  CardHeader,
  FormControl,
  Stack,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import PromotionBuyXGetYDetail from "./PromotionBuyXGetYDetail";

interface PromotionSelectionCardProps {
  form: UseFormReturn<CreateBroadcastValues>;
  disabled?: boolean;
}

const PromotionSelectionCard = ({
  form,
  disabled,
}: PromotionSelectionCardProps) => {
  const t = useTranslations("BROADCASTS.form");
  const {
    setValue,
    watch,
    formState: { errors },
  } = form;

  const eventId = watch("event_id");

  // Local state to hold the full event object for "note" display
  // We initialize it null, but if there is an initial eventId (edit mode),
  // the EventSelector might fetch it internally, but we don't strictly need it here
  // unless we want to show the note immediately without re-fetching or if EventSelector passes it up.
  // Actually EventSelector passes the object on change.
  const [selectedEvent, setSelectedEvent] =
    React.useState<EventSelectorItem | null>(null);

  const { data: promotionDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["promotion-details", eventId],
    queryFn: () => getEventPromotionDetails(eventId),
    enabled: !!eventId && eventId > 0,
  });

  const handleEventChange = (event: EventSelectorItem | null) => {
    if (event) {
      setValue("event_id", event.id);
      setSelectedEvent(event);
    } else {
      setValue("event_id", 0);
      setSelectedEvent(null);
    }
  };

  return (
    <Card>
      <CardHeader title={t("sections.promotion_selection.title")} />
      <CardContent>
        <Stack spacing={2}>
          <FormControl fullWidth error={!!errors.event_id}>
            <EventSelector
              onSubmit={handleEventChange}
              defaultValue={eventId}
              error={!!errors.event_id}
              helperText={errors.event_id?.message}
              fieldProps={{
                disabled,
              }}
            />
          </FormControl>

          {selectedEvent?.note && (
            <Typography variant="body2" color="text.secondary">
              {selectedEvent.note}
            </Typography>
          )}

          {isLoadingDetails && (
            <Typography variant="caption" color="text.secondary">
              Loading details...
            </Typography>
          )}

          {promotionDetails && (
            <PromotionBuyXGetYDetail
              buyItems={promotionDetails.buyItems}
              getItems={promotionDetails.getItems}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PromotionSelectionCard;
