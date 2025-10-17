import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

import ChatHistory from "../sidebar/ChatHistory";
import NavLinks from "../sidebar/NavLinks";
import UserProfile from "../sidebar/UserProfile";

const Sidebar = async () => {
  const cookieStore = cookies();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const user_data = user?.user_metadata ?? {};

  return (
    <aside className="fixed top-[72px] left-0 z-10 w-[260px] bottom-0 bg-white border-r border-gray-200 p-4">
      <div className="flex flex-col h-full">
        <UserProfile user_data={user_data}></UserProfile>
        <NavLinks></NavLinks>
        <ChatHistory></ChatHistory>
        {/* <AccountActions></AccountActions> */}
      </div>
    </aside>
  );
};

export default Sidebar;
