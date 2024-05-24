"use client"
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

const FlowTitle = ({ Sidebar }: { Sidebar: boolean}) => {
    const { userId } = useAuth();
    const params = useParams();
    const id = params.id;
    const titleStyle = Sidebar ? "ml-60" : "ml-0";
    const [title, setTitle] = useState(" ");

    useEffect(() => {
        const fetchFlow = async () => {
            if (id) {
                console.log("Fetching flow with id:", id); // Add this line
                const response = await fetch(`/api/Flows?id=${id}`);
                const data = await response.json()
                console.log("Fetched data:", data); // Add this line
                if (data.flow.title) {
                    setTitle(data.flow.title);
                }
            }
        };

        fetchFlow();
    }, [id]);

    return (
        <div className="flex justify-between node-enter-animation z-[999999]">
            <div className={`p-[15px] px-4 mt-3 bg-neutral-800 border-2 border-indigo-500 rounded-[100px] z-[99999] ${titleStyle} transition-all duration-200 ease-in-out`}>
                <p className="text-white font-bold text-center text-md">{title}</p>
                <div className="pt-1 flex justify-center items-center gap-2 text-xs text-center text-neutral-400 w-full">
                    <p className="text-center">New Search</p>
                    <kbd className="pointer-events-none inline-flex h-4 select-none items-center gap-3 rounded border-2 border-neutral-700 bg-neutral-800 px-1"><span className="text-[10px] text-neutral-400">⌘k</span></kbd>
                </div>
            </div>
        </div>
    )
}

export default FlowTitle