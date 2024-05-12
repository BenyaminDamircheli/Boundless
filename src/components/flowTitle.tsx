"use client"
import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const FlowTitle = ({ Sidebar }: { Sidebar: boolean}) => {
    const titleStyle = Sidebar ? "ml-60" : "ml-0";

    return (
        <div className="flex justify-between">
            <div className={`p-[11px] mt-3 bg-neutral-800 border-2 border-indigo-500 rounded-[100px] z-[99999] ${titleStyle} transition-all duration-200 ease-in-out`}>
                <p className="text-white font-bold text-sm">Tranformers and Neural Networks</p>
            </div>
        </div>
    )
}

export default FlowTitle
