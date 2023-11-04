import React from 'react'
import DataTable, { TableColumn } from 'react-data-table-component';
import { Inputs } from './schema';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../action';
import { CSVLink, CSVDownload } from "react-csv";

interface DataRow extends Inputs {
  category: {
    title: string
  }
}

const columns: TableColumn<DataRow>[] = [
  { id: "serail", name: 'รหัสสินค้า', selector: row => row.serial, sortable: false },
  { id: "title", name: 'ชื่อสินค้า', selector: row => row.title, sortable: false },
  { id: "category", name: 'ประเภทสินค้า', selector: row => row.category.title, sortable: true },
  { id: "price", name: 'ราคา', selector: row => row.price, sortable: true, format: (data) => data.price.toLocaleString() },
  { id: "cost", name: 'ต้นทุน', selector: row => row.cost, sortable: true, format: (data) => data.cost.toLocaleString() },
  { id: "stock", name: 'ของในสต๊อก', selector: row => row.stock, sortable: true, format: (data) => data.stock.toLocaleString() },
];

const ProductTable = (props: {
  search: string
  onManager: (item: Inputs) => void
}) => {
  const [perPage, setPerPage] = React.useState<number>(10);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [totalRows, setTotalRows] = React.useState<number>(0);
  const [sort, setSort] = React.useState<[string | null, "asc" | "desc"]>([null, "desc"]);
  const { data, refetch, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      return await getProducts(currentPage, perPage, props.search, sort);
    }
  })

  React.useEffect(() => {
    setTotalRows(data?.total || 0)
  }, [data])

  React.useEffect(() => {
    refetch()
  }, [perPage, currentPage, props.search, sort])

  if (error) {
    return <p>ERROR</p>
  }

  return (
    <>
      {!isLoading ? (
        <>
          <div>
            <div className="flex justify-end">
              <CSVLink
                filename={"รายการสินค้า"}
                className='btn btn-success'
                data={
                  (data?.data as DataRow[]).map((p: DataRow) => {
                    return {
                      serial: p.serial,
                      title: p.title,
                      price: p.price,
                      category: p.category.title,
                      cost: p.cost,
                      stock: p.stock
                    }
                  })
                }
                headers={
                  (columns).map((col) => {
                    return {
                      label: col.name,
                      key: (col.id)
                    }
                  }) as any
                }>EXPORT CSV</CSVLink>
            </div>
          </div>
          <DataTable
            columns={columns as any}
            data={data ? (data.success ? data.data as Inputs[] : []) : []}
            progressPending={isLoading}
            pagination
            paginationServer
            paginationComponentOptions={{
              selectAllRowsItem: true,
              selectAllRowsItemText: 'ALL',
            }}
            paginationTotalRows={totalRows}
            paginationDefaultPage={currentPage}
            sortServer
            onSort={(data, style) => {
              setSort([data.name as string, style])
            }}
            onChangeRowsPerPage={setPerPage}
            onChangePage={setCurrentPage}
            onRowClicked={props.onManager}
          />
        </>
      ) : (
        <div className='flex justify-center'>
          <span className="loading loading-ring loading-lg"></span>
        </div>
      )
      }
    </>
  )
}

export default ProductTable
