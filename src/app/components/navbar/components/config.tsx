import { AddShoppingCart, Category, Dashboard, Home, Inventory, ManageHistory, People, Store } from "@mui/icons-material"
import { DrawerCategory } from "./typings"

export const DrawerItems: DrawerCategory[] = [
  {
    name: "main",
    label: "เมนูหลัก",
    items: [
      { name: "index", route: "/", label: "หน้าแรก", icon: <Home /> },
      { name: "dashboard", route: "/dashboard", label: "แดชบอร์ด", icon: <Dashboard />, desc: "การแสดงข้อมูลสรุปและกราฟที่สำคัญในรูปแบบกราฟิก หรือตาราง ที่เกี่ยวข้องกับการติดตามสถานะทางธุรกิจ, การวิเคราะห์ข้อมูล, หรือการรายงานผลการดำเนินงานในรูปแบบที่มีประสิทธิภาพ" }
    ]
  },
  {
    name: "store",
    label: "ร้านค้าของฉัน",
    items: [
      { name: "cashier", label: 'ขายสินค้า', route: "/cashier", icon: <AddShoppingCart />, desc: "การนำสินค้าหรือบริการของธุรกิจไปขายให้กับลูกค้าหรือผู้บริโภค ซึ่งรวมถึงกิจกรรมต่าง ๆ เช่น การตลาด, การส่งเสริมการขาย, การสร้างความสนใจ, การเจรจาต่อรอง, และการทำธุรกรรมการขายเอง" },
      { name: "products", label: 'สินค้า', route: "/products", icon: <Inventory />, desc: "การจัดการสินค้าภายในร้านเป็นส่วนสำคัญที่สำคัญในการให้บริการและเพิ่มประสิทธิภาพในการขายของธุรกิจของคุณ. นี่คือบางแนวทางที่คุณสามารถพิจารณาเพื่อจัดการสินค้าของคุณ" },
      { name: "categories", label: 'ประเภทสินค้า', route: "/categories", icon: <Category />, desc: "การแบ่งสินค้าออกเป็นกลุ่มหรือประเภทต่าง ๆ ตามลักษณะ, ลักษณะการใช้งาน, หรือลักษณะทางธุรกิจ เพื่อให้การจัดการสินค้าเป็นไปอย่างมีระเบียบและง่ายต่อการค้นหา" },
      { name: "histories", label: 'ประวัติการขาย', route: "/histories", icon: <ManageHistory />, desc: "การบันทึกหรือประวัติเหตุการณ์ที่เกี่ยวข้องกับกระบวนการขายสินค้าของธุรกิจ. ประวัติการขายสินค้ามักจะรวมถึงข้อมูลต่าง ๆ เกี่ยวกับการตลาด, การสร้างความสนใจ, การส่งเสริมการขาย, การทำธุรกรรม, และผลการขายเพื่อให้ภาพรวมทั่วไปเกี่ยวกับประสิทธิภาพของกิจการ" }
    ]
  },
  {
    name: "account",
    label: "บัญชี",
    items: [
      { name: "profile", label: "ร้านค้า", route: "/account/store", icon: <Store/>, desc: "", shortcut: false},
      { name: "employees", label: "พนักงาน", route: "/employees", icon: <People/>, desc: "", shortcut: false}
    ]
  }
]