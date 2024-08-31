"use client"
import React, { useEffect, useState } from "react";
import Header from "@/components/header";
import WikiSidebar from "@/components/wikiSidebar";
import Wiki from "@/components/wiki";
import WikiSearch from "@/components/searchwiki";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import useLoading from '@/hooks/useLoading';

type TocType = {
    nodes: Array<{
        id: string;
        data: {
            title: string;
            parentNode?: string;
            level: number;
            pageTopic: string;
            hasChildren: boolean;
        };
        position: { x: number; y: number };
        type: string;
    }>;
    edges: Array<{
        id: string;
        source: string;
        target: string;
        style?: {
            strokeWidth: number;
            stroke: string;
            zIndex: number;
            markerStart?: string;
        };
    }>;
};

function parseTOC(toc: string, query: string): TocType {
    const endMarker = "<END>";
    const lines = toc.split('\n').filter(line => line.trim().endsWith(endMarker));
    const nodes: any[] = [];
    const edges: any[] = [];
    let nodeId = 0;
    const parentStack: { id: number, level: number }[] = [];

    
    lines.forEach((line) => {
        const cleanLine = line.replace(endMarker, '').trim();
        const level = (line.replace(endMarker, '').match(/^\s*/)?.[0].length ?? 0) / 4; // Adjusted for 4 spaces per level
        const title = cleanLine.replace(/^\s*[-\d]+\.\s*/, '').replace(/^/, '').replace(/^-/, '').replace(/^\s*-\s*/, '').replace(/^\s*\*\s*/, '').trim();
        
        const node: any = {
            id: nodeId.toString(),
            position: { x: 0, y: 0 },
            data: { title: title, level: level, pageTopic: query, hasChildren: false },
            type: level === 0 ? 'customNode' : 'subConceptNode',
        };

        while (parentStack.length > 0 && parentStack[parentStack.length - 1].level >= level) {
            parentStack.pop();
        }

        if (level === 0) {
            edges.push({
                id: `e0-${nodeId}`,
                source: nodeId.toString(),
                target: '0',
                style: {
                    strokeWidth: 7, stroke: 'white', zIndex: 9999999999,
                    markerStart: 'arrow'
                }
            });
        } else if (parentStack.length > 0) {
            const parentNodeId = parentStack[parentStack.length - 1].id;
            node.data.parentNode = parentNodeId.toString();
            nodes[parentNodeId].data.hasChildren = true; 
            edges.push({
                id: `e${parentNodeId}-${nodeId}`,
                source: nodeId.toString(),
                target: parentNodeId.toString(),
                style: {
                    strokeWidth: 7, stroke: 'white', zIndex: 9999999999
                }
            });
        }

        nodes.push(node);
        parentStack.push({ id: nodeId, level: level });
        nodeId++;
    });

    nodes.forEach((node) => {
        node.data.hasChildren = nodes.some((childNode) => childNode.data.parentNode === node.id);
    });
    return { nodes, edges };
}

export default function WikiPage() {
    const [toc, setToc] = useState<TocType>({ nodes: [], edges: [] });
    const [quickAnswer, setQuickAnswer] = useState('');
    const isLoading = useLoading();
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [isOpen, setIsOpen] = useState(true);
    const context = searchParams.getAll('search_context');
    const id = searchParams.get('id');
    const user = useUser();
    const userid = user?.user?.id;

    useEffect(() => {
        async function fetchData() {
            try {
                const cachedTOC = localStorage.getItem(`toc_${window.location}`);
                if (cachedTOC) {
                    setToc(JSON.parse(cachedTOC));
                    return;
                } else {
                    const response = await fetch(`/api/getWiki?id=${id}`);
                    if (response.status === 200) {
                        const data = await response.json();
                        console.log(data);
                        if (data.nodes) {
                            setToc({ nodes: data.nodes, edges: [] });
                            return;
                        }
                    }

                    const response2 = await fetch('/api/fetchData', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ query: query, id: id }),
                    });

                    if (!response2.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const reader = response2.body?.getReader();
                    const decoder = new TextDecoder();
                    let content = '';
                    parsedTOC = parseTOC(content, query);
                    setToc(parsedTOC);

                    await fetch('/api/saveWiki', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ query: query, id: id, url: window.location.href, userId: userid, nodes: parsedTOC.nodes }),
                    });

                    localStorage.setItem(`toc_${window.location}`, JSON.stringify(parsedTOC));
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        }

        async function fetchQuickAnswer() {
            try {
                const cachedQuickAnswer = localStorage.getItem(`quickAnswer_${window.location}`);
                if (cachedQuickAnswer) {
                    setQuickAnswer(cachedQuickAnswer);
                    return;
                } else {
                    const response = await fetch('/api/fetchQuickAnswer', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ query: query, context: context }),
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const reader = response.body?.getReader();
                    const decoder = new TextDecoder();
                    let content = '';

                    while (true) {
                        const { done, value } = await reader?.read() || {};
                        if (done) break;
                        content += decoder.decode(value, { stream: true });
                        setQuickAnswer(content); // Update quickAnswer state with each chunk
                    }

                    localStorage.setItem(`quickAnswer_${window.location}`, content);
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        }

        if (query) {
            fetchData();
            fetchQuickAnswer();
        }
    }, [query, id]);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="overflow-x-hidden h-screen overflow-y-auto">
            <Header />
            <WikiSearch />
            {isLoading ? (
                <div className="flex items-center justify-center h-screen">Loading...</div>
            ) : (
                <div className="flex flex-row pl-14 pr-14 w-full mt-4">
                    <WikiSidebar isOpen={isOpen} setIsOpen={setIsOpen} Nodes={toc.nodes} query={query} />
                    <Wiki isSidebarOpen={isOpen} initialNodes={toc.nodes} quickAnswer={quickAnswer} />
                </div>
            )}
        </div>
    );
}