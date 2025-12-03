// components/Header.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import HeaderClient from "@/components/layout/HeaderClient";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Header() {
  const cookieStore = await cookies();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("[Header] User:", user?.email || "Not logged in");
  console.log("[Header] User ID:", user?.id || "No ID");

  return <HeaderClient user={user} />;
}
