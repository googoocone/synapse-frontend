"use client";

import { createClient } from "@/utils/supabase/client";
import { Bookmark, Heart, Share2, Gift } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface StoryHeaderProps {
    story: {
        id: number;
        title: string;
        tags?: string[];
        badges?: string[];
        founder_image_url?: string;
        created_at: string;
    };
}

const StoryHeader = ({ story }: StoryHeaderProps) => {
    const supabase = createClient();
    const router = useRouter();
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0); // Mock count for now, or fetch if available
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        checkLikeStatus();
        // In a real app, we would fetch the actual like count here
        setLikeCount(Math.floor(Math.random() * 100) + 10); // Random mock count for demo
    }, [story.id]);

    const checkLikeStatus = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (user) {
            const { data } = await supabase
                .from("likes")
                .select("id")
                .eq("user_id", user.id)
                .eq("story_id", story.id)
                .single();

            if (data) {
                setIsLiked(true);
            }
        }
    };

    const toggleLike = async () => {
        if (isLoading) return;

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            if (
                confirm(
                    "로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?"
                )
            ) {
                router.push("/login");
            }
            return;
        }

        setIsLoading(true);

        // Optimistic update
        const previousState = isLiked;
        setIsLiked(!previousState);
        setLikeCount((prev) => (previousState ? prev - 1 : prev + 1));

        try {
            if (previousState) {
                // Unlike
                const { error } = await supabase
                    .from("likes")
                    .delete()
                    .eq("user_id", user.id)
                    .eq("story_id", story.id);

                if (error) throw error;
            } else {
                // Like
                const { error } = await supabase
                    .from("likes")
                    .insert({ user_id: user.id, story_id: story.id });

                if (error) throw error;
            }
        } catch (error) {
            console.error("좋아요 처리 실패:", error);
            setIsLiked(previousState); // Rollback
            setLikeCount((prev) => (previousState ? prev + 1 : prev - 1));
            alert("오류가 발생했습니다. 다시 시도해주세요.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            alert("링크가 복사되었습니다!");
        } catch (err) {
            console.error("URL 복사 실패:", err);
        }
    };

    return (
        <header className="mb-12 md:w-[620px] mx-auto">
            {/* Top Badges */}
            <div className="flex items-center gap-2 mb-6">
                {story.badges && story.badges.length > 0 ? (
                    <span className="px-3 py-1.5 bg-[#e4c487] text-[#5c4008] text-sm font-bold rounded-lg">
                        {story.badges[0]}
                    </span>
                ) : (
                    <span className="px-3 py-1.5 bg-[#e4c487] text-[#5c4008] text-sm font-bold rounded-lg">
                        Synapse PICK
                    </span>
                )}
                <span className="px-3 py-1.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg bg-white">
                    Story
                </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-[28px] font-extrabold text-gray-900 leading-tight mb-4 sm:mb-8 break-keep">
                {story.title}
            </h1>

            {/* Tags & Actions Row */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-gray-100">
                {/* Left: Tags & Author */}
                <div className="space-y-6">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-3">
                        {story.tags?.map((tag, index) => (
                            <span
                                key={index}
                                className="text-[#00bfa5] font-bold text-base hover:underline cursor-pointer"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Author Profile */}
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-100">
                            {story.founder_image_url ? (
                                <img
                                    src={story.founder_image_url}
                                    alt="Founder"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-gray-900">창업자 인터뷰</span>
                            <span className="text-sm text-gray-500">
                                {new Date(story.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-4">
                    {/* Like Button */}
                    <button
                        onClick={toggleLike}
                        className="flex items-center gap-1.5 group"
                    >
                        <Heart
                            className={`w-6 h-6 transition-colors ${isLiked ? "fill-black text-black" : "text-gray-400 group-hover:text-black"
                                }`}
                        />
                        <span className="font-medium text-lg text-gray-900">
                            {likeCount}
                        </span>
                    </button>

                    <div className="w-px h-4 bg-gray-300 mx-2" />

                    {/* Bookmark (Visual only) */}
                    <button className="text-gray-400 hover:text-black transition-colors">
                        <Bookmark className="w-6 h-6" />
                    </button>

                    {/* Share */}
                    <button
                        onClick={handleShare}
                        className="text-gray-400 hover:text-black transition-colors"
                    >
                        <Share2 className="w-6 h-6" />
                    </button>

                    {/* Gift (Visual only) */}
                    <button className="text-gray-400 hover:text-black transition-colors">
                        <Gift className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default StoryHeader;
