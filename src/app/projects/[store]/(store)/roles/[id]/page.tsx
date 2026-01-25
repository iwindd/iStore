"use client";

import updateStoreRole from "@/actions/roles/updateStoreRole";
import App, { Wrapper } from "@/layouts/App";
import { RoleValues } from "@/schema/Role";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { enqueueSnackbar } from "notistack";
import RoleForm from "../components/RoleForm";
import { useRole } from "./providers/RoleProvider";

const EditRolePage = () => {
  const t = useTranslations("ROLES");
  const { role, storeSlug } = useRole();

  const updateRoleMutation = useMutation({
    mutationFn: (values: RoleValues) =>
      updateStoreRole(storeSlug, { ...values, id: role.id }),
    onSuccess: () => {
      enqueueSnackbar(t("messages.updated"), { variant: "success" });
    },
    onError: (error) => {
      console.error(error);
      enqueueSnackbar(t("messages.error"), { variant: "error" });
    },
  });

  const initialValues: RoleValues = {
    label: role.name,
    description: role.description || "",
    permissions: role.permissions.map((p) => p.name),
  };

  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>{t("edit_title")}</App.Header.Title>
      </App.Header>
      <App.Main>
        <RoleForm
          storeSlug={storeSlug}
          initialValues={initialValues}
          onSubmit={updateRoleMutation.mutate}
          isSubmitting={updateRoleMutation.isPending}
        />
      </App.Main>
    </Wrapper>
  );
};

export default EditRolePage;
