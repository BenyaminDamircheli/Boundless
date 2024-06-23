import { ChevronDown, Info } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogHeader } from "./ui/dialog";


export default function MainWiki({ nodes }: { nodes: any[] }) {
    const [displayedNodes, setDisplayedNodes] = useState(nodes);
    const [collapsedNodeStates, setCollapsedNodeStates] = useState<{ [key: string]: boolean }>({});
    const [nodeStates, setNodeStates] = useState<{ [key: string]: { clicked: boolean, loading: boolean, quickSummary: string, boundlessText: string } }>({});
    const [nodeImages, setNodeImages] = useState<{ [key: string]: string }>({});
    const [newNode, setNewNode] = useState(null);
    const [dialogOpenStates, setDialogOpenStates] = useState<{ [key: string]: boolean }>({});
    const [nodeSummaries, setNodeSummaries] = useState<{ [key: string]: string }>({});
    const [nodeResources, setNodeResources] = useState<{ [key: string]: string }>({});
    const [searchCount, setSearchCount] = useState(0);
    const router = useRouter();
    const searchParams = useSearchParams();
    const boundless = "-... --- ..- -. -.. .-.. . ... ..."
    const context = searchParams.get('q');
    const id = searchParams.get('id');
    const processedNodes = useRef(new Set());
    

    useEffect(() => {
        nodes.forEach(node => {
            const storedImage = localStorage.getItem(`nodeImage_${id}_${node.id}`);
            if (storedImage) {
                setNodeImages((prev) => ({ ...prev, [node.id]: storedImage }));
            }
        });
    }, [id]);

    useEffect(() => {
        setSearchCount((prevCount) => {
            const newCount = prevCount + 1;
            if (newCount >= 5) {
                localStorage.clear();
                return 0;
            }
            return newCount;
        });
    }, [id]);

    useEffect(() => {
        processedNodes.current.clear();
    }, [context]);

    useEffect(() => {
        setDisplayedNodes(nodes);
    }, [nodes]);

    useEffect(() => {
        setNodeStates({});
    }, [nodes]);
    

    

    useEffect(() => {
        const newNodes = nodes.filter(node => !processedNodes.current.has(node.id));
        if (newNodes.length > 0) {
            setNewNode(newNodes[0]);
            processedNodes.current.add(newNodes[0].id);
        }
    }, [nodes]);

    useEffect(() => {
        const fetchImageForNode = async (node: any) => {
            if (node) {
                try {
                    
                   if (!node.data.hasChildren) {
                    
                    const response = await fetch("https://api.tavily.com/search", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                api_key: process.env.NEXT_PUBLIC_TAVILY_API_KEY,
                                query: `${node.data.title} as it relates to ${node.data.parentTitle} and ${context}`,
                                search_depth: "basic",
                                include_answer: false,
                                include_images: true,
                                include_raw_content: false,
                                max_results: 5,
                            }),
                        });
                        const data = await response.json();
                        setNodeResources((prev) => ({ ...prev, [node.id]: data.results }));
                        if (data.images && data.images.length > 0) {
                            const imageUrl = data.images[Math.floor(Math.random() * 2)];
                            setNodeImages((prev) => ({ ...prev, [node.id]: imageUrl }));
                            localStorage.setItem(`nodeImage_${id}_${node.id}`, imageUrl);
                        }
                        
                   }
                   
                } catch (error) {
                    console.error('Failed to fetch image:', error);
                }
            }
        };

        if (newNode && nodes.length < 10) {
            fetchImageForNode(newNode);
        }
        if (nodes.length > 10) {
            nodes.forEach(node => {
                fetchImageForNode(node);
            });
        }
    }, [newNode, id, context]);
  
    const toggleCollapsed = (nodeId: string) => {
        setCollapsedNodeStates((prev) => {
          const newState = { ...prev };
          newState[nodeId] = !newState[nodeId];
          return newState;
        });
      };

    const onClick = (title: any) => {
        const id = uuidv4();
        const existingSearchContexts = searchParams.getAll('search_context');
        const updatedSearchContexts = [...existingSearchContexts, title];
        router.push(`/wiki?q=${title}&search_context=${updatedSearchContexts.map(encodeURIComponent).join('&search_context=')}&id=${id}`);
    };

    const onInfoClick = async (nodeId: string, title: any) => {
            try {
                setNodeStates((prev) => ({
                    ...prev,
                    [nodeId]: {
                        clicked: true,
                        quickSummary: "",
                        loading: true,
                        boundlessText: ""
                    }
                }));

                let i = 0;
                const timer = setInterval(() => {
                    if (i < boundless.length) {
                        setNodeStates((prev) => ({
                            ...prev,
                            [nodeId]: {
                                ...prev[nodeId],
                                boundlessText: boundless.slice(0, i + 1)
                            }
                        }));
                        i++;
                    } else {
                        i = 0;
                    }
                }, 20);

                const response = await fetch(`/api/quickSummary`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query: title, context:context }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const { quickSummary } = await response.json();

                setNodeStates((prev) => ({
                    ...prev,
                    [nodeId]: {
                        clicked: true,
                        quickSummary,
                        loading: false,
                        boundlessText: ""
                    }
                }));

                clearInterval(timer);
            } catch (error) {
                console.error('Failed to fetch quick summary:', error);
            }
    }

    const handleDialogOpenChange = async (nodeId: string, open: boolean, title: string) => {
        setDialogOpenStates((prev) => ({ ...prev, [nodeId]: open }));
        if (open && !nodeSummaries[nodeId]) {
            let i = 0;
            const timer = setInterval(() => {
                if (i < boundless.length) {
                    setNodeSummaries((prev) => ({
                        ...prev,
                        [nodeId]: boundless.slice(0, i + 1)
                    }));
                    i++;
                } else {
                    i = 0;
                }
            }, 20);

            try {
                const response = await fetch(`/api/quickSummary`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query: title, context: context }),
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const { quickSummary } = await response.json();
                setNodeSummaries((prev) => ({ ...prev, [nodeId]: quickSummary }));
            } catch (error) {
                console.error('Failed to fetch quick summary:', error);
            } finally {
                clearInterval(timer);
            }
        }
    };
  
    const renderNodes = (parentNodeId: string | null, level: number, visitedNodes = new Set()) => {
        if (visitedNodes.has(parentNodeId)) {
            return null; // Prevent infinite recursion
        }
        visitedNodes.add(parentNodeId);
      
        return displayedNodes
            .filter((node) => node.data.parentNode === parentNodeId || (parentNodeId === null && !node.data.parentNode))
            .map((node) => {
                const hasChildren = displayedNodes.some((childNode) => childNode.data.parentNode === node.id);
                const childrenHaveChildren = displayedNodes.some((childNode) => 
                    childNode.data.parentNode === node.id && 
                    displayedNodes.some((grandChildNode) => grandChildNode.data.parentNode === childNode.id)
                );
                const isCollapsed = collapsedNodeStates[node.id];
                const nodeState = nodeStates[node.id] || { clicked: false, quickSummary: "", boundlessText: "", loading: false };
                const nodeImage = nodeImages[node.id] || "";
                const isDialogOpen = dialogOpenStates[node.id] || false;
                const nodeSummary = nodeSummaries[node.id] || "";
                const resources = nodeResources[node.id] || [];

                if (!hasChildren) {
                    return (
                        <div id={`node-${node.id}`} key={node.id + "-" + level} style={{ minWidth: '150px', minHeight: '150px', marginTop: '0.5rem', marginLeft: '1.25rem', marginRight: '1.25rem' }} className="scroll-p-64 scroll-m-64 outline-offset-4 mb-4 target:outline target:outline-4 target:outline-indigo-500 bg-white transition-all duration-75 rounded-[2px] flex flex-col ">
                            <div className="flex flex-col justify-between items-start">
                                <button onClick={() => onClick(node.data.title)} className="transition-all duration-100 text-[0.8rem] font-medium pb-0.5 whitespace-pre-wrap pl-1 leading-[1] text-start text-black group">
                                    <span className="text-indigo-700 underline hidden group-hover:inline">deeper search on: </span>
                                    <span className="fade-in">{node.data.title}<span className=" hidden group-hover:inline">?</span></span>
                                </button>
                                <div className="border-t-[1.5px] transition-all duration-100 border-black shadow-md mt-2">
                                    <div className="flex flex-row justify-center flex-wrap pt-[0.15rem] border-b border-x border-neutral-100 rounded-b-[2px] bg-white">
                                        <Dialog open={isDialogOpen} onOpenChange={(open) => handleDialogOpenChange(node.id, open, node.data.title)}>
                                            <DialogTrigger>
                                                <div className="h-fit w-fit">
                                                    {nodeImage ? (
                                                        <img src={nodeImage} alt="" className="fade-in" style={{ width: '100%', height: 'auto', maxWidth: '250px', maxHeight: '250px' }} />
                                                    ) : (
                                                        <div className="w-[250px] h-[250px] bg-gray-300 animate-pulse"></div>
                                                    )}
                                                </div>
                                            </DialogTrigger>
                                            <DialogContent className="bg-white text-black rounded w py-2 px-4 border-neutral-700 border-2 max-h-[800px] overflow-auto">
                                                <DialogHeader>
                                                    <DialogTitle className="text-[30px]">{node.data.title}</DialogTitle>
                                                </DialogHeader>
                                                <div className="text-black break-words">
                                                    <p className="text-sm my-1">{nodeSummary}</p>
                                                </div>
                                                {!nodeImage && null}
                                                {nodeImage && 
                                                <div className="flex flex-col">
                                                    <p className="text-neutral-600 italic text-xs ">Resources for further learning</p>
                                                    {resources.map((resource) => (
                                                        <div key={resource.id}>
                                                            <a className="text-xs text-indigo-600" href={resource.url} target="_blank" rel="noopener noreferrer">{resource.title}</a>
                                                        </div>
                                                    ))}
                                                </div>}
                                                
                                                <div className="flex flex-row shadow-lg justify-start items-center flex-wrap pt-[0.15rem] border rounded bg-white">
                                                    <div className="h-fit w-[550px]">
                                                        <img src={nodeImage} alt="" className="fade-in" style={{ width: '100%', height: 'auto' }}/>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }
                return (
                    <div id="parent-div">
                        <div id={`node-${node.id}`} key={node.id} className={`bg-white relative w-fit h-fit mb-4 border shadow-sm rounded-[3px] mx-2 `}>
                            <div style={{ top: 0 + level*25, zIndex: 18 - level }} className="scroll-p-32 scroll-m-32 outline-offset-4 sticky transition-colors duration-100 border-b-[1.5px] bg-zinc-100 border-neutral-200 flex flex-col w-full">
                                <div className="flex flex-row items-end justify-between gap-1">
                                    <div className="flex flex-row items-center gap-1">
                                        <button onClick={() => onClick(node.data.title)} className="group">
                                            <span className="text-indigo-700 text-[0.8rem] pl-2 underline hidden group-hover:inline">deeper search on:</span>
                                            <span className={`mt-0.5 text-start text-[0.8rem] pl-2 fade-in ${isCollapsed ? "font-bold": "font-normal"}`}>{node.data.title} <span className="hidden group-hover:inline">?</span></span>
                                        </button>
                                        {hasChildren && (
                                            <button onClick={() => toggleCollapsed(node.id)} className="hover:bg-neutral-200 rounded">
                                                <ChevronDown className="w-4 h-4 text-neutral-500" />
                                            </button>
                                        )}
                                    </div>
                                    <button onClick={() => onInfoClick(node.id, node.data.title)} className="mr-2 my-1">
                                        <Info className="text-neutral-600 w-[14px] h-[14px] font-bold" />
                                    </button>
                                </div>
                                {nodeState.clicked && nodeState.loading && <div className="text-xs bg-zinc-100 p-2 rounded-[2px] shadow-sm">{nodeState.boundlessText}</div>}
                                {nodeState.clicked && nodeState.quickSummary && <div className="text-xs bg-zinc-100 p-2 rounded-[2px] shadow-sm">{nodeState.quickSummary}</div>}
                            </div>
                            {hasChildren && !isCollapsed && (
                                <div className="relative border-neutral-400 bg-white">
                                    <div className="relative py-3 px-2 w-full flex flex-row flex-wrap flex-grow justify-start rounded-bl-[4px]">
                                        {renderNodes(node.id, level + 1, new Set(visitedNodes))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            });
    };
  
    return <div>{renderNodes(null, 0)}</div>;
}
