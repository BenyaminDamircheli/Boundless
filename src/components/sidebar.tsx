import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { UserButton, useUser, useAuth } from "@clerk/nextjs";
import { ReactFlow } from "@prisma/client";
import Item from "./space";
import ItemList from "./itemList";
import { SquareMenu, ChevronDown } from "lucide-react";
import NewConcept from "./newConcept";
import { useHotkeys } from 'react-hotkeys-hook'

function Navbar1({isOpen, setIsOpen, handleFlowClick}: {isOpen: boolean, setIsOpen: (isOpen: boolean) => void, handleFlowClick: (id: string) => void}){
    const [nodes, setNodes] = useState<Node[]>([]);
    const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());
    const [title, setTitle] = useState<string>("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    useEffect(() => {
        async function fetchNodes(){
            const response = await fetch(`/api/Flows?id=${id}`);
            const data = await response.json();
            console.log("data.flow.nodes.slice(1):", data.flow.nodes.slice(1))
            setNodes(data.flow.nodes)
            setTitle(data.flow.title)
        }
        fetchNodes();
    }, [id])

    function toggleCollapse(nodeId: string) {
        setCollapsedNodes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(nodeId)) {
                newSet.delete(nodeId);
            } else {
                newSet.add(nodeId);
            }
            return newSet;
        });
    }

    function generateTOC(nodes: any) {
        const nodeMap = new Map();
    
        // Create a map of nodes by their id for easy lookup
        nodes.forEach((node: any) => {
            nodeMap.set(node.id, node);
        });
    
        // Helper function to recursively build the TOC
        function buildTOC(node: any, index: number = 0) {
            const isCollapsed = collapsedNodes.has(node.id);
            const hasSubconcept = nodes.some((childNode: any) => childNode.data.parentNode === node.id);
            return (
                <div key={node.id} style={{ paddingLeft: `${node.data.level * 10}px`, animation: `fadeIn 0.1s ease-in ${index * 0.08}s forwards` }} className={`cursor-pointer py-2 opacity-0`}>
                    {hasSubconcept && <div style={{ display: 'flex', alignItems: 'center' }} className="hover:bg-neutral-700 rounded">
                        <ChevronDown onClick={() => toggleCollapse(node.id)} className={`transition-transform ${isCollapsed ? 'rotate-90' : ''} w-4 h-4 mr-2 hover:bg-neutral-800 rounded`} />
                        <div role="button" onClick={() => handleFlowClick(node.id)} className="flex items-center text-white">
                            {node.data.title}
                        </div>
                    </div>}
                    {!hasSubconcept && 
                    <div className="ml-4 border-l-2 border-l-neutral-700 hover:bg-neutral-700 text-neutral-300">
                        <div role="button" onClick={() => handleFlowClick(node.id)} style={{ display: 'flex', alignItems: 'center' }} className="cursor-pointer pl-2">
                            {node.data.title}
                        </div>
                    </div>}
                    {!isCollapsed && (
                        <div>
                            {nodes
                                .filter((childNode: any) => childNode.data.parentNode === node.id)
                                .map((childNode: any, childIndex: number) => buildTOC(childNode, index + childIndex + 1))
                                .sort((a, b) => a.props.style.paddingLeft - b.props.style.paddingLeft)}
                        </div>
                    )}
                </div>
            );
        }

        // Add CSS for fadeIn animation
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes fadeIn {
                from { opacity: 0}
                to { opacity: 1}
            }
        `;
        document.head.appendChild(style);
    
        // Find all main concept nodes (nodes with a parent)
        const mainConceptNodes = nodes.filter((node: any) => !node.data.parentNode);
    
        // Build TOC for each main concept node
        return mainConceptNodes.map((mainConceptNode: any) => buildTOC(mainConceptNode));
    }

    function onMouseDown(e: React.MouseEvent<HTMLDivElement, MouseEvent>){
        e.preventDefault();
        e.stopPropagation();
    }
    const [isModalOpen, setIsModalOpen] = useState(false);
    useHotkeys('meta+k', () => 
    setIsModalOpen(true));

    const sidebarStyle = isOpen ? 'translate-x-0 duration-100' : '-translate-x-full duration-100'; // Move sidebar off-screen when closed
    const { user } = useUser();
    const { userId } = useAuth();

    return (
        <>
        {!isOpen && ( 
            <div
                role="button"
                className="h-6 w-6 text-muted-foreground rounded hover:bg-neutral-700 top-3 left-3 cursor-pointer fixed z-20 "
                onClick={() => setIsOpen(!isOpen)}
            >
                <SquareMenu className="h-6 w-6" />
            </div>)}
            <aside className={`bg-neutral-900 h-full w-60 overflow-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-neutral-700 absolute top-0 transition-all duration-300 ease-in-out ${sidebarStyle}`}>
            
                <div className="flex mt-3 ml-4">
                    
                    <UserButton />
                    <p className="text-white ml-2 text-xs font-bold flex items-center">Welcome {user?.firstName}</p>
                    {isOpen && (
                        <div
                            role="button"
                            className="h-6 w-6 ml-6 t text-muted-foreground rounded hover:bg-neutral-700 cursor-pointer"
                            onClick={() => setIsOpen(false)}
                        >
                            <SquareMenu className="h-6 w-6" />
                        </div>
                    )}
                </div>
                <div className={`${isOpen ? 'block' : 'hidden'} mt-10 ml-4 mr-4`}>
                    <NewConcept isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
                </div>

                <div className={`ml-4 mt-4 text-sm font-bold rounded ${isOpen ? 'block' : 'hidden'}`}>
                    <div className="sticky top-0 py-2 bg-neutral-900 flex justify-between items-center z-[99999]">
                        <div className="text-xl text-white mb-2 font-bold mr-4">{title}</div>
                    </div>
                    <div className="text-white whitespace-pre-wrap text-xs mr-6">{generateTOC(nodes)}</div>
                </div>
                <div className={`mt-4 ml-4 ${isOpen ? 'block' : 'hidden'}`}>
                    <ItemList userId={userId} />
                </div>
            </aside>
        </>
    );
}

export default Navbar1;
