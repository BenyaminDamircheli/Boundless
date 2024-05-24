"use client"
import React, { useEffect, useState } from "react"
import { LucideIcon, ChevronRight, ChevronDown } from "lucide-react"
import { ReactFlow } from "@prisma/client"
import { cn } from "@/lib/utils"
import { Skeleton } from "./ui/skeleton"

interface SpaceProps {
    id?: ReactFlow["id"]
    type: "flow" | "note"
    icon: LucideIcon
    expanded?: boolean
    level?: number
    active?: boolean
    label: string
    onExpand?: () => void
    onClick: (id: number) => void
}

const Item = ({ id, type, onClick, label, icon: Icon, level = 0, active, expanded, onExpand }: SpaceProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const ChevronIcon = expanded ? ChevronDown : ChevronRight
    let itemContent;
    switch (type) {
        case "flow":
            itemContent = <p>Flow: {label}</p>
            break;
        case "note":
            itemContent = <p>Note: {label}</p>
            break;
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 50); // 100ms delay

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={cn(
            "bg-neutral-900 py-2 rounded pr-2 flex justify-between items-center gap-2 hover:bg-neutral-800 cursor-pointer transition-opacity duration-300 ease-in-out w-[90%] text-muted-foreground",
            active ? "bg-neutral-800" : "",
            active && "background-primary/5 text-primary",
            isVisible ? "opacity-100" : "opacity-0"
        )}
            style={{ paddingLeft: level ? `${(level * 12) + 12}px` : "12px" }}>
            <div role="button" onClick={onClick} className="flex items-center gap-2 truncate">
                <Icon className="h-[18px] w-[18px] shrink-0" />
                <p className="text-muted-foreground/5 text-sm font-bold truncate">{label}</p>
            </div>
            <div role="button" onClick={onExpand} className="bg-neutral-700 rounded h-full p-1 hover:bg-neutral-900 cursor-pointer transition-all duration-300 ease-in-out z-[999999]">
                <ChevronIcon className="h-[18px] w-[18px]"/>
            </div>
        </div>
    )
}

Item.Skeleton = function ItemSkeleton() {
    return (
        <div>
            <Skeleton className="h-[30px] w-[90%] bg-neutral-800 rounded animate-pulse my-2" />
            <Skeleton className="h-[30px] w-[90%] bg-neutral-800 rounded animate-pulse my-2" />
            <Skeleton className="h-[30px] w-[90%] bg-neutral-800 rounded animate-pulse my-2" />
            <Skeleton className="h-[30px] w-[90%] bg-neutral-800 rounded animate-pulse my-2" />
        </div>
    )
}

export default Item