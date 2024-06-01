"use client"
import React, { useEffect, useState } from "react";
import Navbar1 from "@/components/sidebar";
import { Input } from "@/components/ui/input";
import {Network, Search} from "lucide-react";
import Header from "@/components/header";
import WikiSidebar from "@/components/wikiSidebar";
import Wiki from "@/components/wiki";
import WikiSearch from "@/components/searchwiki";
import { useSearchParams } from "next/navigation";




export default function WikiPage() {
    const [toc, setToc] = useState(() => {
        const savedToc = localStorage.getItem(`toc_${window.location.href}`);
        return savedToc ? JSON.parse(savedToc) : { nodes: [], edges: [] };
    });
    const [quickAnswer, setQuickAnswer] = useState(() => {
        const savedQuickAnswer = localStorage.getItem(`quickAnswer_${window.location.href}`);
        return savedQuickAnswer || '';
    });
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        const savedToc = localStorage.getItem(`toc_${window.location.href}`);
        const savedQuickAnswer = localStorage.getItem(`quickAnswer_${window.location.href}`);
        
        if (!savedToc || !savedQuickAnswer) {
            async function fetchData() {
                const startTime = performance.now();
                console.log("fetched data");
                const response = await fetch(`/api/fetchData`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query }),
                });
                const { TOC, quickAnswer } = await response.json();
                setToc(TOC);
                setQuickAnswer(quickAnswer);
                localStorage.setItem(`toc_${window.location.href}`, JSON.stringify(TOC));
                localStorage.setItem(`quickAnswer_${window.location.href}`, quickAnswer);
                const endTime = performance.now();
                console.log(`done data in ${endTime - startTime} ms`);
            }
            fetchData();
        } else {
            setToc(JSON.parse(savedToc));
            setQuickAnswer(savedQuickAnswer);
        }
    }, [query]);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };
    
    return (
        <div className="overflow-x-hidden">
            <Header />
            <WikiSearch />
            <div className="sticky top-0 flex flex-row pl-14 pr-14 w-full mt-4">
                <WikiSidebar isOpen={isOpen} setIsOpen={setIsOpen} Nodes={toc.nodes} query={query} />
                <Wiki isSidebarOpen={isOpen} initialNodes={toc.nodes} quickAnswer={quickAnswer}/>
            </div>
        </div>
    );
}


