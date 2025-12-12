"use client";

import { usePathname } from "next/navigation";

export default function MainLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLanding = pathname === "/";
    const isAdmin = pathname.startsWith("/admin");

    return (
        <main
            className={`w-full flex-1 mx-auto ${isLanding
                ? ""
                : isAdmin
                    ? "sm:w-[1320px] mt-[70px]"
                    : "sm:w-[1200px] mt-[70px]"
                }`}
        >
            {children}
        </main>
    );
}
