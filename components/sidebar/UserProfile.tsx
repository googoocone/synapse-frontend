import testImage from "@/assets/test.png";
import Image from "next/image";

const UserProfile = ({ user_data }) => {
  const user_profile = user_data.avatar_url;
  const user_datas = user_data;
  console.log("user_datas", user_datas);

  return (
    <div className="w-full h-[62px] flex items-center justify-start border rounded-full p-2 border-black/10 gap-2 ">
      <div className="rounded-full">
        <Image
          src={user_profile ?? testImage}
          alt="user_profile"
          width={44}
          height={44}
          className="rounded-full"
        ></Image>
      </div>
      <div className=" flex flex-col  items-start justify-center ">
        <div className="text-md">{user_data.full_name}</div>
        <div className="text-xs">{user_data.email}</div>
      </div>
    </div>
  );
};

export default UserProfile;
