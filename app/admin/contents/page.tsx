"use client";

import { createClient } from "@/utils/supabase/client";
import { Edit, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Story = {
    id: string;
    title: string;
    created_at: string;
    metric: string;
};

const ContentsPage = () => {
    const supabase = createClient();
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        const { data, error } = await supabase
            .from("stories")
            .select("id, title, created_at, metric")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching stories:", error);
        } else {
            setStories(data || []);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("정말로 이 콘텐츠를 삭제하시겠습니까?")) return;

        const { error } = await supabase.from("stories").delete().eq("id", id);

        if (error) {
            alert("삭제 중 오류가 발생했습니다.");
            console.error(error);
        } else {
            alert("삭제되었습니다.");
            fetchStories();
        }
    };

    if (loading) {
        return <div className="p-8">로딩 중...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">콘텐츠 관리</h1>
                <Link
                    href="/admin/write"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                    <Plus size={18} />
                    <span>새 콘텐츠 작성</span>
                </Link>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                제목
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                핵심 지표
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                작성일
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                                관리
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {stories.map((story) => (
                            <tr key={story.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div
                                        className="text-sm font-medium text-gray-900 max-w-md truncate"
                                        title={story.title}
                                    >
                                        {story.title}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{story.metric}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">
                                        {new Date(story.created_at).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end gap-3">
                                        <Link
                                            href={`/admin/edit/${story.id}`}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <Edit size={18} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(story.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {stories.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                    등록된 콘텐츠가 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ContentsPage;
