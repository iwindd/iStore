"use client";
import * as React from "react";
import { CSVLink } from "react-csv";

interface ExportHook<T> {
  ExportHandler: React.ReactNode;
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
  setHeaders: React.Dispatch<
    React.SetStateAction<{ label: string; key: string }[]>
  >;
  Export(): void;
}

export function useExport<T>(
  defaultHeaders: { label: string; key: string }[],
  fileName = "export"
): ExportHook<T> {
  const [items, setItems] = React.useState<T[]>([]);
  const [headers, setHeaders] = React.useState<
    { label: string; key: string }[]
  >(defaultHeaders || []);
  const [isDownload, setIsDownload] = React.useState<boolean>(false);
  const csvLinkRef = React.useRef<any & HTMLAnchorElement>(null);

  const Export = async () => {
    if (csvLinkRef.current?.link) {
      setIsDownload(true);
    }
  };

  React.useEffect(() => {
    if (isDownload && csvLinkRef.current.link) {
      csvLinkRef.current.link.click();
      setIsDownload(false);
      setItems([]); // clear mem
    }
  }, [isDownload, csvLinkRef]);

  return {
    ExportHandler: (
      <CSVLink
        ref={csvLinkRef}
        data={items as any}
        headers={headers}
        filename={`${fileName}.csv`}
        target="_blank"
        style={{ display: "none" }} // Hide the link as it's not needed to be visible
      >
        Export
      </CSVLink>
    ),
    setItems,
    setHeaders,
    Export,
  };
}
