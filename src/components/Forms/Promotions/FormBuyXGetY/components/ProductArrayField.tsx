"use client";
import ProductSelector from "@/components/Selector/ProductSelector";
import { Delete } from "@mui/icons-material";
import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import {
  Control,
  FieldErrors,
  useFieldArray,
  useFormContext,
} from "react-hook-form";

interface ProductArrayFieldProps {
  name: "needProducts" | "offerProducts";
  control: Control<any>;
  errors: FieldErrors<any>;
  disabled?: boolean;
  maxProducts?: number;
}

const ProductArrayField = ({
  name,
  control,
  errors,
  disabled,
  maxProducts = 50,
}: ProductArrayFieldProps) => {
  const t = useTranslations("PROMOTIONS.buyXgetY.array_field");
  const { register, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const productErrors = errors[name] as
    | {
        [key: number]: {
          product_id?: { message?: string };
          quantity?: { message?: string };
        };
      }
    | undefined;

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: "50px" }}>{t("headers.index")}</TableCell>
            <TableCell sx={{ width: "50%" }}>{t("headers.product")}</TableCell>
            <TableCell>{t("headers.quantity")}</TableCell>
            <TableCell sx={{ width: "60px" }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fields.length > 0 ? (
            fields.map((field, index) => (
              <TableRow key={field.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <ProductSelector
                    defaultValue={(field as any).product_id}
                    error={!!productErrors?.[index]?.product_id}
                    helperText={productErrors?.[index]?.product_id?.message}
                    disabled={disabled}
                    onSubmit={(product) => {
                      if (product) {
                        setValue(`${name}.${index}.product_id`, product.id);
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    type="number"
                    {...register(`${name}.${index}.quantity`, {
                      valueAsNumber: true,
                    })}
                    disabled={disabled}
                    error={!!productErrors?.[index]?.quantity}
                    helperText={productErrors?.[index]?.quantity?.message}
                    slotProps={{
                      htmlInput: { min: 1 },
                    }}
                  />
                </TableCell>
                {!disabled && (
                  <TableCell>
                    <IconButton
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4}>
                <Typography variant="body2" align="center" color="secondary">
                  {t("empty")}
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        {!disabled && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>
                {fields.length < maxProducts ? (
                  <Button
                    variant="dashed"
                    color="secondary"
                    fullWidth
                    onClick={() => append({ product_id: 0, quantity: 1 })}
                    disabled={disabled}
                  >
                    {t("add_product")}
                  </Button>
                ) : (
                  <Typography variant="body2" align="center" color="secondary">
                    {t("max_limit", { max: maxProducts })}
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </TableContainer>
  );
};

export default ProductArrayField;
