import React, { useEffect, useState } from "react";
import {useUser} from "@clerk/clerk-react";
import Link from "next/link";

interface HistoryProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function History({ isOpen, setIsOpen }: HistoryProps) {

    const [history, setHistory] = useState<{ title: string, url: string, date: string }[]>([])
    const user = useUser();
    const userId = user?.user?.id;
    const searchHistory = async () => {
        const response = await fetch(`/api/getHistory?userId=${userId}`)
        const data = await response.json()
        setHistory(data.map((wiki: any) => ({ 
            title: decodeURIComponent(wiki.url.split('search_context=').slice(1).join(' → ').split("id")[0].replace(/&/g, ' ')), 
            url: wiki.url,
            date: (() => {
                const createdAtDate = new Date(Date.parse(wiki.createdAt));
                const today = new Date();
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);

                if (createdAtDate.toDateString() === yesterday.toDateString()) {
                    return "Yesterday";
                } else {
                    return createdAtDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }
            })()
        })))
    }
    useEffect(() => {
        if (isOpen) {
            searchHistory()
        }
    }, [isOpen])

    return (
        <div className={`history-panel ${isOpen ? "open" : ""} fixed history-scrollbar overflow-auto top-[20%] right-0 z-[99999999] !w-[300px] h-[600px] bg-zinc-100 rounded border-zinc-500 border-[1px] mr-3`}>
            <div className="text-[15px] font-bold px-3 pt-2 flex justify-between items-center sticky top-0 bg-zinc-100 z-10">
                <p>Search History</p>
                <button onClick={() => setIsOpen(false)} className="text-neutral-500 px-2 hover:underline py-1 text-xs">Close</button>
            </div>
            {!history.length ? (
                <div className="flex items-center justify-center h-[450px]">
                    <p className="text-xs">No history</p>
                </div>
            ) : (
                <>
                {history.map((wiki, index) => (
                    <Link href={wiki.url} key={index}>
                    <div role="button" className="flex mt-1 mx-2 rounded justify-start items-center hover:bg-zinc-200 px-3 py-2 cursor-pointer">
                        <p className="text-xs mr-2 w-[90px] text-center">{wiki.date}</p>
                        <p className="text-xs w-[200px] break-words">{wiki.title}</p>
                    </div>
                    </Link>
                ))}
                </>
            )}
        </div>
    );
}

