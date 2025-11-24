import { GridLocaleText } from "@mui/x-data-grid";

const thTHGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: "ไม่พบรายการ",
  noResultsOverlayLabel: "ไม่พบผลลัพธ์",

  // Density selector toolbar button text
  toolbarDensity: "ความหนาแน่น",
  toolbarDensityLabel: "ความหนาแน่น",
  toolbarDensityCompact: "หนาแน่น",
  toolbarDensityStandard: "ปกติ",
  toolbarDensityComfortable: "กว้าง",

  // Columns selector toolbar button text
  toolbarColumns: "ตาราง",
  toolbarColumnsLabel: "เลือก",

  // Filters toolbar button text
  toolbarFilters: "ตัวกรอง",
  toolbarFiltersLabel: "แสดงตัวกรอง",
  toolbarFiltersTooltipHide: "ซ่อนตัวกรอง",
  toolbarFiltersTooltipShow: "แสดงตัวกรอง",
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} active filters` : `${count} ตัวกรอง`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: "ค้นหา...",
  toolbarQuickFilterLabel: "ค้นหา",
  toolbarQuickFilterDeleteIconLabel: "Clear",

  // Export selector toolbar button text
  toolbarExport: "Export",
  toolbarExportLabel: "Export",
  toolbarExportCSV: "ดาวน์โหลดเป็น CSV",
  toolbarExportPrint: "พิมพ์",
  toolbarExportExcel: "ดาวน์โหลดเป็น Excel",

  // Columns management text
  columnsManagementSearchTitle: "ค้นหา",
  columnsManagementNoColumns: "No columns",
  columnsManagementShowHideAllText: "แสดง/ซ่อน ทั้งหมด",

  // Filter panel text
  filterPanelAddFilter: "Add filter",
  filterPanelRemoveAll: "Remove all",
  filterPanelDeleteIconLabel: "Delete",
  filterPanelLogicOperator: "Logic operator",
  filterPanelOperator: "Operator",
  filterPanelOperatorAnd: "And",
  filterPanelOperatorOr: "Or",
  filterPanelColumns: "Columns",
  filterPanelInputLabel: "Value",
  filterPanelInputPlaceholder: "Filter value",

  // Filter operators text
  filterOperatorContains: "ประกอบด้วย",
  filterOperatorEquals: "เท่ากับ",
  filterOperatorStartsWith: "เริ่มต้นด้วย",
  filterOperatorEndsWith: "ลงท้ายด้วย",
  filterOperatorIs: "คือ",
  filterOperatorNot: "is not",
  filterOperatorAfter: "is after",
  filterOperatorOnOrAfter: "is on or after",
  filterOperatorBefore: "is before",
  filterOperatorOnOrBefore: "is on or before",
  filterOperatorIsEmpty: "is empty",
  filterOperatorIsNotEmpty: "is not empty",
  filterOperatorIsAnyOf: "is any of",
  "filterOperator=": "=",
  "filterOperator!=": "!=",
  "filterOperator>": ">",
  "filterOperator>=": ">=",
  "filterOperator<": "<",
  "filterOperator<=": "<=",

  // Header filter operators text
  headerFilterOperatorContains: "ประกอบด้วย",
  headerFilterOperatorEquals: "เท่ากับ",
  headerFilterOperatorStartsWith: "เริ่มต้นด้วย",
  headerFilterOperatorEndsWith: "ลงท้ายด้วย",
  headerFilterOperatorIs: "คือ",
  headerFilterOperatorNot: "Is not",
  headerFilterOperatorAfter: "Is after",
  headerFilterOperatorOnOrAfter: "Is on or after",
  headerFilterOperatorBefore: "Is before",
  headerFilterOperatorOnOrBefore: "Is on or before",
  headerFilterOperatorIsEmpty: "Is empty",
  headerFilterOperatorIsNotEmpty: "Is not empty",
  headerFilterOperatorIsAnyOf: "Is any of",
  "headerFilterOperator=": "Equals",
  "headerFilterOperator!=": "Not equals",
  "headerFilterOperator>": "Greater than",
  "headerFilterOperator>=": "Greater than or equal to",
  "headerFilterOperator<": "Less than",
  "headerFilterOperator<=": "Less than or equal to",

  // Filter values text
  filterValueAny: "any",
  filterValueTrue: "true",
  filterValueFalse: "false",

  // Column menu text
  columnMenuLabel: "เมนู",
  columnMenuShowColumns: "แสดงตาราง",
  columnMenuManageColumns: "จัดการตาราง",
  columnMenuFilter: "ตัวกรอง",
  columnMenuHideColumn: "ซ่อนตาราง",
  columnMenuUnsort: "ยกเลิกลำดับ",
  columnMenuSortAsc: "เรียงจากมากไปน้อย",
  columnMenuSortDesc: "เรียงจากน้อยไปมาก",

  // Column header text
  columnHeaderFiltersTooltipActive: (count) => `${count} ตัวกรอง`,
  columnHeaderFiltersLabel: "แสดงตัวกรอง",
  columnHeaderSortIconLabel: "ลำดับ",

  // Rows selected footer text
  footerRowSelected: (count) => `${count.toLocaleString()} แถว`,

  // Total row amount footer text
  footerTotalRows: "ทั้งหมด:",

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} ของ ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: "Checkbox selection",
  checkboxSelectionSelectAllRows: "Select all rows",
  checkboxSelectionUnselectAllRows: "Unselect all rows",
  checkboxSelectionSelectRow: "Select row",
  checkboxSelectionUnselectRow: "Unselect row",

  // Boolean cell text
  booleanCellTrueLabel: "ใช่",
  booleanCellFalseLabel: "ไม่",

  // Actions cell more text
  actionsCellMore: "เพิ่มเติม",

  // Column pinning text
  pinToLeft: "ปักหมุดซ้าย",
  pinToRight: "ปักหมุดขวา",
  unpin: "ยกเลิกหมุด",

  // Tree Data
  treeDataGroupingHeaderName: "Group",
  treeDataExpand: "see children",
  treeDataCollapse: "hide children",

  // Grouping columns
  groupingColumnHeaderName: "Group",
  groupColumn: (name) => `Group by ${name}`,
  unGroupColumn: (name) => `Stop grouping by ${name}`,

  // Master/detail
  detailPanelToggle: "Detail panel toggle",
  expandDetailPanel: "Expand",
  collapseDetailPanel: "Collapse",

  // Row reordering text
  rowReorderingHeaderName: "Row reordering",

  // Aggregation
  aggregationMenuItemHeader: "Aggregation",
  aggregationFunctionLabelSum: "sum",
  aggregationFunctionLabelAvg: "avg",
  aggregationFunctionLabelMin: "min",
  aggregationFunctionLabelMax: "max",
  aggregationFunctionLabelSize: "size",
};

export default thTHGrid;
