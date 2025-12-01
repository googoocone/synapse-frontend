"use client";

import { createClient } from "@/utils/supabase/client";
import { Image as ImageIcon, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ImageUploadProps {
    label: string;
    value: string;
    onChange: (url: string) => void;
    bucketName?: string;
}

const ImageUpload = ({
    label,
    value,
    onChange,
    bucketName = "images",
}: ImageUploadProps) => {
    const [isUploading, setIsUploading] = useState(false);
    const supabase = createClient();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);

        try {
            const fileExt = file.name.split(".").pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);

            onChange(data.publicUrl);
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("이미지 업로드에 실패했습니다.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = () => {
        onChange("");
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>

            {value ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                    <Image
                        src={value}
                        alt="Upload preview"
                        fill
                        className="object-cover"
                    />
                    <button
                        onClick={handleRemove}
                        className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                        type="button"
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <div className="w-full">
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {isUploading ? (
                                <Loader2 className="w-8 h-8 text-gray-400 animate-spin mb-2" />
                            ) : (
                                <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                            )}
                            <p className="text-sm text-gray-500">
                                {isUploading ? "업로드 중..." : "클릭하여 이미지 업로드"}
                            </p>
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleUpload}
                            disabled={isUploading}
                        />
                    </label>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
