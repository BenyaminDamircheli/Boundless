"use client"
import Dagre from '@dagrejs/dagre';
import React, { useCallback, useState, useEffect, useRef, use } from "react";
import ReactFlow, { useReactFlow,Background, ReactFlowProvider, useNodesState, useEdgesState, addEdge, Connection, Handle, MarkerType } from "reactflow";
import 'reactflow/dist/style.css';
import { useSearchParams } from 'next/navigation';
import InitialNode from "@/components/customNode";
import NoteNode from "@/components/noteNode";
import Navbar1 from "@/components/sidebar";
import FlowTitle from "@/components/flowTitle";
import SubConceptNode from "@/components/subconceptNode";
import SubSubConceptNode from "@/components/subsubconcept";


// To remove reactFlow Attribution
type Viewport = {
  x: number;
  y: number;
  zoom: number;
};

const proOptions = { hideAttribution: true };
const defaultViewport: Viewport = { x: 0, y: 100, zoom: 0.025 };

const x1 = window.innerWidth / 2;
const y1 = window.innerHeight / 2;

const nodeTypes = {
    customNode: InitialNode,
    noteNode: NoteNode,
    subConceptNode: SubConceptNode,
    subSubConceptNode: SubSubConceptNode
}





const EditorPage = () => {
    const searchParams = useSearchParams();
    const [dataLoaded, setDataLoaded] = useState(false);
    const [layouted, setLayouted] = useState(false); 
    const [nodes, setNodes ] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const id = searchParams.get("id");
                console.log('bigga id:', id);
                const response = await fetch(`/api/Flows?id=${id}`);
                const data = await response.json();
                if (response.ok) {
                    setNodes(data.nodes);
                    setEdges(data.edges);
                    setDataLoaded(true);
                    setLayouted(true);
                } else {
                    console.error('Failed to fetch flow data:', data.message);
                }
            } catch (error) {
                console.error('Error fetching flow data:', error);
            }
        };

        fetchData();
    }, []);

    
    
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);

    useEffect(() => {
        if (reactFlowInstance && layouted) {
            reactFlowInstance.fitView();
        }
    }, [reactFlowInstance, layouted]);
    const [isOpen, setIsOpen] = useState(true);
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };


    const handleNodeClick = (event: any, node: any) => {
        const zoomLevel = reactFlowInstance?.getZoom();
        if (zoomLevel < 0.2 && (node.type === "customNode")) {
            if (isOpen) {
            const x = node.position.x + 1300;
            const y = node.position.y + 300;
            const zoom = 0.18;
            reactFlowInstance?.setCenter(x, y, { zoom, duration: 1000 });
            }
            else if(!isOpen){
                const x = node.position.x + 1000;
                const y = node.position.y + 300;
                const zoom = 0.18;
                reactFlowInstance?.setCenter(x, y, { zoom, duration: 1000 });  
            }
        } else if (zoomLevel < 0.2 && node.type === "noteNode") {
            if (isOpen){
            const x = node.position.x + 5500;
            const y = node.position.y + 2000;
            const zoom = 0.06;
            reactFlowInstance?.setCenter(x, y, { zoom, duration: 1000 });
        } else{
            const x = node.position.x + 7700;
            const y = node.position.y + 2000;
            const zoom = 0.06;
            reactFlowInstance?.setCenter(x, y, { zoom, duration: 1000 });
        }
        } else {
             if (isOpen){
                const x = node.position.x + 200
                const y = node.position.y + 200;
                reactFlowInstance?.setCenter(x, y, { zoom: 0.2, duration: 1000 });
            } else{
                const x = node.position.x + 620;
                const y = node.position.y + 200;
                const zoom = 0.2;
                reactFlowInstance?.setCenter(x, y, { zoom, duration: 1000 });
            }
            
        }
    };

    const handleToNodeClick = (nodeId: string) => {
        const node = nodes.find(n => n.id === nodeId);
        console.log(node)
        if (node) {
            handleNodeClick(null, node);
        }
    };





  
return (
    <>
    <div className="fixed top-0 left-0 h-full z-[99999]"><Navbar1 isOpen={isOpen} setIsOpen={toggleSidebar} handleFlowClick={handleToNodeClick}/></div>
    <div className={`fixed ${isOpen ? 'right-[40%]' : 'right-[45%]'} transition-all duration-100 ease-in-out top-3 z-[99999] text-white shadow-lg`}><FlowTitle Sidebar={isOpen} /></div>
        <ReactFlowProvider>
            <div ref={reactFlowWrapper} className="w-[100vw] h-[100vh] bg-neutral-950">
                <Background variant={"dots" as any} gap={20} size={1}></Background>
                <ReactFlow
                    onNodeClick={handleNodeClick}
                    nodes={nodes}
                    edges={edges}
                    proOptions={proOptions}
                    nodeTypes={nodeTypes}
                    maxZoom={0.35}
                    minZoom={0.009}
                    onInit={setReactFlowInstance}
                    fitView={true}
                    
                ></ReactFlow>
            </div>
        </ReactFlowProvider>
        
    </>
    );
};

export default EditorPage;








