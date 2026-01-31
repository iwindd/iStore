import { NextRequest, NextResponse } from "next/server";

export async function PermissionMiddleware(request: NextRequest) {
  // NOTE: ใช้กันไว้ในแต่ละ actions แทน เพื่อป้องกันการเข้าถึงโดยตรงและ การใช้ middleware จะทำให้ query
  // ซ้ำซ้อนในแต่ละหน้ากับ layout ตรวจสอบ permissions
  return NextResponse.next();
}
