import { Box, BoxProps, Chip, Tooltip } from "@mui/material";

interface ProductKeywordChipsProps extends BoxProps {
  keywords?: string[];
}

const ProductKeywordChips = ({
  keywords,
  ...props
}: ProductKeywordChipsProps) => {
  if (!keywords || keywords.length === 0) return <>-</>;

  return (
    <Box
      sx={{
        display: "flex",
        gap: 0.5,
        flexWrap: "wrap",
        alignItems: "center",
        height: "100%",
        ...props.sx,
      }}
      {...props}
    >
      {keywords.slice(0, 1).map((keyword, index) => (
        <Chip
          key={`${keyword}-${index}`}
          label={keyword}
          size="small"
          variant="filled"
        />
      ))}
      {keywords.length > 1 && (
        <Tooltip title={keywords.slice(1).join(", ")}>
          <Chip
            label={`+${keywords.length - 1}`}
            size="small"
            variant="filled"
          />
        </Tooltip>
      )}
    </Box>
  );
};

export default ProductKeywordChips;
