"use client";
import Loading from "@/components/loading";
import ReceiptDocument, {
  ReceiptDocumentProps,
} from "@/documents/ReceiptDocument";
import { number } from "@/libs/formatter";
import { ReceiptTwoTone } from "@mui/icons-material";
import { Button } from "@mui/material";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useParams } from "next/navigation";

interface ReceiptControllerProps extends ReceiptDocumentProps {}

const ReceiptController = (props: ReceiptControllerProps) => {
  const { id } = useParams<{ id: string }>();

  return (
    <PDFDownloadLink
      document={<ReceiptDocument {...props} />}
      fileName={`ใบเสร็จบิลที่ #${number(+id)}`}
    >
      {({ loading }) =>
        loading ? (
          <Loading centered />
        ) : (
          <Button startIcon={<ReceiptTwoTone />}>ใบเสร็จ</Button>
        )
      }
    </PDFDownloadLink>
  );
};

export default ReceiptController;
