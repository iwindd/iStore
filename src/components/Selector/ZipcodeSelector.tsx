"use client";

import { findZipcode } from "@/actions/address/findZipcode";
import getZipcodes, { ZipcodeOption } from "@/actions/address/getZipcodes";
import { useTranslations } from "next-intl";
import BaseSelector, { BaseSelectorProps } from "./BaseSelector";

type ZipcodeSelectorProps = BaseSelectorProps<ZipcodeOption>;

const ZipcodeSelector = (props_: ZipcodeSelectorProps) => {
  const t = useTranslations("COMPONENTS.selector.zipcode");
  const props = {
    ...props_,
    label: props_.label || t("label"),
    placeholder: props_.placeholder || t("placeholder"),
    canCreate: false,
  };

  return (
    <BaseSelector<ZipcodeOption>
      id="zipcode-selector"
      noOptionsText={t("no_options")}
      fetchItem={async (id) => {
        const resp = await findZipcode(id);
        return resp;
      }}
      searchItems={async (query) => {
        const resp = await getZipcodes(query);
        return resp;
      }}
      getItemLabel={(option) =>
        typeof option === "string"
          ? option
          : `${option.code} - ${option.subDistrictName}, ${option.districtName}, ${option.provinceName}`
      }
      getItemKey={(option) => option.id}
      renderCustomOption={(option) => (
        <>
          {option.subDistrictName}, {option.districtName}, {option.provinceName}
        </>
      )}
      {...props}
    />
  );
};

export default ZipcodeSelector;
