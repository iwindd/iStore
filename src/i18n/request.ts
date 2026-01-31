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
      },
      dateTime: {
        short: {
          year: "numeric",
          month: "short",
          day: "numeric",
        },
      },
    },
  };
});
