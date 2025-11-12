import { Path, RegisterOptions, useForm, UseFormProps } from "react-hook-form";

const useFormValidate = <T extends Record<string, any>>({
  ...props
}: UseFormProps<T>) => {
  const form = useForm<T>({
    ...props,
  });

  if (
    process.env.NODE_ENV === "development" &&
    form.formState.errors &&
    Object.keys(form.formState.errors).length > 0
  ) {
    console.warn(
      "useFormValidate: The form has validation errors. Please check the console for details.",
      form.formState.errors
    );
  }

  return {
    ...form,
    register: (key: Path<T>, options?: RegisterOptions<T, Path<T>>) => {
      const resp = form.register(key, {
        ...options,
      });

      const isError = !!form.formState.errors[key];

      return {
        ...resp,
        ...(isError
          ? {
              error: true,
              helperText: form.formState.errors[key]?.message,
            }
          : {}),
      };
    },
  };
};

export default useFormValidate;
