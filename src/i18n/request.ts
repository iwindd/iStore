import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  // Static for now, we'll change this later
  const locale = "th";

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    formats: {
      number: {
        currency: {
          style: "currency",
          currency: "THB",
          currencyDisplay: "narrowSymbol",
        },
        compact: {
          notation: "compact",
          compactDisplay: "short",
        },
        percent: {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      },
      dateTime: {
        short: {
          year: "numeric",
          month: "short",
          day: "numeric",
        },
        ["full-time"]: {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          calendar: "buddhist",
        },
      },
    },
  };
});
