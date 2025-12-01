import { createClient } from "@/utils/supabase/server";
import { FileText, Users } from "lucide-react";
import Link from "next/link";

const AdminPage = async () => {
    const supabase = await createClient();

    // Fetch simple stats
    const { count: storyCount } = await supabase
        .from("stories")
        .select("*", { count: "exact", head: true });

    const { count: userCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Story Stat Card */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 font-medium">총 콘텐츠</h3>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <FileText size={20} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{storyCount || 0}</p>
                    <div className="mt-4">
                        <Link
                            href="/admin/contents"
                            className="text-sm text-blue-600 hover:underline"
                        >
                            콘텐츠 관리하기 &rarr;
                        </Link>
                    </div>
                </div>

                {/* User Stat Card */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 font-medium">총 회원수</h3>
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                            <Users size={20} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{userCount || 0}</p>
                    <div className="mt-4">
                        <Link
                            href="/admin/users"
                            className="text-sm text-green-600 hover:underline"
                        >
                            회원 관리하기 &rarr;
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
