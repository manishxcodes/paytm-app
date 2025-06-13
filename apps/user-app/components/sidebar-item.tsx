"use client"

import { usePathname, useRouter } from "next/navigation"
import React from "react"

interface SidebarItemProps {
    href: string
    title: string 
    icon: React.ReactNode
}

export function SidebarItem ({href, title, icon}: SidebarItemProps) {
    const router = useRouter();
    const pathname = usePathname();
    const selected = pathname === href;

    return (
        <div className={`flex hover:text-secondary ${selected ? "text-secondary" : "text-slate-500"} cursor-pointer p-2 pl-8 transition-colors duration-150 ease-in-out group`} 
        onClick={() => {router.push(href)}}>
            <div className="pr-2 group-hover:scale-105">{icon}</div>
            <div className={`font-semibold group-hover:scale-105`}>{title}</div>
        </div>
    )
}   