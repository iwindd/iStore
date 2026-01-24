"use client";

import {
  CountryOption,
  findCountry,
  searchCountries,
} from "@/actions/address/getCountries";
import { useTranslations } from "next-intl";
import BaseSelector, { BaseSelectorProps } from "./BaseSelector";

type CountrySelectorProps = BaseSelectorProps<CountryOption>;

const CountrySelector = (props_: CountrySelectorProps) => {
  const t = useTranslations("COMPONENTS.selector.country");
  const props = {
    ...props_,
    label: props_.label || t("label"),
    placeholder: props_.placeholder || t("placeholder"),
    canCreate: false,
  };

  return (
    <BaseSelector<CountryOption>
      id="country-selector"
      noOptionsText={t("no_options")}
      fetchItem={async (id) => {
        const resp = await findCountry(id);
        return resp;
      }}
      searchItems={async (query) => {
        const resp = await searchCountries(query);
        return resp;
      }}
      getItemLabel={(option) =>
        typeof option === "string"
          ? option
          : `${option.name} (${option.nameEn})`
      }
      getItemKey={(option) => option.id}
      {...props}
    />
  );
};

export default CountrySelector;
