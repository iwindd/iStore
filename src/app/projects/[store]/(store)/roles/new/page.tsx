"use client";

import createStoreRole from "@/actions/roles/createStoreRole";
import App, {Wrapper} from "@/layouts/App";
import {RoleValues} from "@/schema/Role";
import {useMutation} from "@tanstack/react-query";
import {useTranslations} from "next-intl";
import {useParams} from "next/navigation";
import {enqueueSnackbar} from "notistack";
import RoleForm from "../components/RoleForm";

const NewRolePage = () => {
  const t = useTranslations("ROLES");
  const params = useParams();
  const storeSlug = params.store as string;

  const createRoleMutation = useMutation({
    mutationFn: (values: RoleValues) => createStoreRole(storeSlug, values),
    onSuccess: () => {
      enqueueSnackbar(t("messages.created"), { variant: "success" });
    },
    onError: (error) => {
      console.error(error);
      enqueueSnackbar(t("messages.error"), { variant: "error" });
    },
  });

  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>{t("create_title")}</App.Header.Title>
      </App.Header>
      <App.Main>
        <RoleForm
          storeSlug={storeSlug}
          onSubmit={createRoleMutation.mutate}
          isSubmitting={createRoleMutation.isPending}
        />
      </App.Main>
    </Wrapper>
  );
};

export default NewRolePage;
