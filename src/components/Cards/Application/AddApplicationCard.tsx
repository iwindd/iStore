import { AddTwoTone } from "@mui/icons-material";
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";

type AddApplicationCardProps = {
  onClick: () => void;
};

const AddApplicationCard = ({ onClick }: AddApplicationCardProps) => {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        borderStyle: "dashed",
        borderColor: "divider",
        bgcolor: "action.hover",
      }}
      variant="outlined"
    >
      <CardActionArea
        onClick={onClick}
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <AddTwoTone fontSize="large" color="disabled" />
          <Typography color="text.secondary" variant="button">
            Add Application
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default AddApplicationCard;
