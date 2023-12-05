import React, { useEffect } from 'react'
import { DataGrid, GridSortModel, GridSortDirection, GridFilterModel, GridRowParams, GridToolbar } from '@mui/x-data-grid';
import { getCategories, getProducts, saveProduct } from '../action';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { Inputs } from './schema';
import { Box, Button } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useInterface } from '@/app/providers/InterfaceProvider';
import { Product } from '@prisma/client';
import Confirmation from './confirmation';
import AddDialog from './add';
import Header from '../../components/header';
import CustomToolbar from '../../components/toolbar';


const ProductDataTable = () => {
  /* CATEGORY */
  const [categories, setCategories] = React.useState<any>([]);
  const [selectProduct, setSelectProduct] = React.useState<number>(0);
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      return await getCategories()
    }
  })

  useEffect(() => {
    if (!categoriesData?.data) return
    setCategories(categoriesData.data);
  }, [categoriesData])

  /* DATAGRID */
  const params = useSearchParams()
  const categoryFilter = params.get('categoryFilter');
  const sortParam = params.get('sort');
  const sortDirectionParam = params.get('format');

  const [sortModel, setSortModel] = React.useState<GridSortModel>((sortParam ? ([{
    field: sortParam as string,
    sort: sortDirectionParam as GridSortDirection
  }]) : ([])));

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 15,
    page: 0,
  });

  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
    items: [],
    quickFilterExcludeHiddenColumns: true,
    quickFilterValues: [],
  });

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      return await getProducts(sortModel, paginationModel, filterModel, Number(categoryFilter));
    }
  })

  const onCommit = async (newData: any, oldData: any) => {
    const resp = await saveProduct(newData, oldData.id);

    if (!resp.success) return oldData
    return newData
  }

  useEffect(() => {
    const fetchData = async () => {
      await refetch()
    }

    fetchData()
  }, [paginationModel, sortModel, filterModel, refetch])

  const { setDialog } = useInterface();
  const onSelectRow = (params: GridRowParams) => setSelectProduct(params.id as number)
  const deleteDialog = setDialog(Confirmation, {
    id: selectProduct,
    title: ((data?.data || []) as Product[]).find(p => p.id == selectProduct)?.title,
    refetch: refetch
  });

  const addDialog = setDialog(AddDialog, {
    categories: categoriesData?.data || [],
    refetch: refetch
  }, "sm")

  if (error) return <p>ERROR</p>

  return (
    <div style={{ height: '100%', width: '100%' }}>

      <Header title='รายการสินค้า' className='flex justify-end items-center gap-2'>
        <Button startIcon={<Add />} onClick={addDialog.onOpen} variant="outlined">
          เพิ่มรายการ
        </Button>
        {selectProduct ? (
          <Button startIcon={<Delete />} onClick={deleteDialog.onOpen} variant="outlined" color="error">
            ลบรายการ
          </Button>
        ) : null}
      </Header>

      <Box sx={{ height: 750, width: '100%' }} className="mt-4">
        <DataGrid
          loading={isLoading}
          rows={isLoading ? [] : data?.data as Inputs[]}

          columns={[
            { field: 'serial', sortable: false, headerName: 'รหัสสินค้า', flex: 1 },
            { field: 'title', sortable: false, headerName: 'ชื่อสินค้า', flex: 1, editable: true },
            {
              field: 'categoryId', sortable: false, headerName: 'ประเภทสินค้า', flex: 1,
              valueOptions: categories.map((c: { id: number }) => c.id),
              valueFormatter: (params) => categories.find((cc: { id: number }) => cc.id == params.value).title || params.value,
              getOptionLabel: (id) => categories.find((cc: { id: number }) => cc.id == id).title || id,
              type: "singleSelect",
              editable: categories.length > 0,
            },
            { field: 'price', sortable: true, headerName: 'ราคา', flex: 1, type: "number", editable: true, valueFormatter: params => (params.value as number).toLocaleString() },
            { field: 'cost', sortable: true, headerName: 'ต้นทุน', flex: 1, type: "number", editable: true, valueFormatter: params => (params.value as number).toLocaleString() },
            { field: 'stock', sortable: true, headerName: 'ของในสต๊อก', flex: 1, type: "number", editable: true, valueFormatter: params => (params.value as number).toLocaleString() },
          ]}
          rowCount={data?.total}
          density="compact"

          onRowClick={onSelectRow}
          processRowUpdate={onCommit}

          pageSizeOptions={[15, 30, 50, 100]}
          paginationModel={paginationModel}
          paginationMode="server"
          onPaginationModelChange={setPaginationModel}

          sortingMode="server"
          onSortModelChange={setSortModel}

          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          slots={{
            toolbar: CustomToolbar,
          }}
          slotProps={{ toolbar: { showQuickFilter: true } }}
          filterMode="server"
          filterModel={filterModel}
          onFilterModelChange={(newModel) => setFilterModel(newModel)}
        />
      </Box>

    </div>
  )
}

export default ProductDataTable