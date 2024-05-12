"use client"
import React from "react"
import { LucideIcon, ChevronRight, ChevronDown } from "lucide-react"


interface SpaceProps {
    type: string
    icon: LucideIcon
    expanded?: boolean
    level?: number
    active?: boolean
    label: string
    onExpand?: () => void
    onClick: () => void
}

const Item = ({onClick, label, icon:Icon, level=0, active, expanded, onExpand}: SpaceProps) => {
    const ChevronIcon = expanded ? ChevronDown : ChevronRight
    return (
        <div className="bg-neutral-900 py-2  rounded pr-2 flex  
        items-center gap-2 hover:bg-neutral-800 cursor-pointer transition-all duration-300 ease-in-out w-[90%] text-muted-foreground"
        style={{paddingLeft: level ? `${(level * 12) + 12}px` : "12px"}}>
            <Icon className="h-[18px] w-[18px]"/>
            <p className="text-white text-sm font-bold truncate">{label}</p>
        </div>
    )
}

export default Item
