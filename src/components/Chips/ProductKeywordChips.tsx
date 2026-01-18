import * as ff from "@/libs/formatter";
import { Box, BoxProps, Chip } from "@mui/material";

interface ProductKeywordChipsProps extends BoxProps {
  keywords?: string | null;
}

const ProductKeywordChips = ({
  keywords,
  ...props
}: ProductKeywordChipsProps) => {
  if (!keywords) return <>{ff.text(keywords || undefined)}</>;

  const keywordList = keywords
    .split(",")
    .map((k) => k.trim())
    .filter((k) => k.length > 0);

  if (keywordList.length === 0) return <>{ff.text(keywords)}</>;

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
      {keywordList.map((keyword, index) => (
        <Chip
          key={`${keyword}-${index}`}
          label={keyword}
          size="small"
          variant="filled"
        />
      ))}
    </Box>
  );
};

export default ProductKeywordChips;
