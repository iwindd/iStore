import { Formats } from "next-intl";

declare module "notistack" {
  interface VariantOverrides {
    intlError: {
      values?: Record<string, string | number | Date>;
      formats?: Formats;
    };
    intlSuccess: {
      values?: Record<string, string | number | Date>;
      formats?: Formats;
    };
  }
}
