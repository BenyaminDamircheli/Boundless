"use client"
import React, { useCallback, useState, useEffect } from "react";
import ReactFlow, { Background, ReactFlowProvider, useNodesState, useEdgesState, addEdge, Connection, Handle, MarkerType } from "reactflow";
import 'reactflow/dist/style.css';
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import InitialNode from "@/components/customNode";
import NoteNode from "@/components/noteNode";
import Navbar1 from "@/components/sidebar";
import FlowTitle from "@/components/flowTitle";




const proOptions = { hideAttribution: true };

const x1 = window.innerWidth / 2;
const y1 = window.innerHeight / 2;

const nodeTypes = {
    customNode: InitialNode,
    noteNode: NoteNode
}




const EditorPage = () => {

    const [nodes, setNodes, onNodesChange] = useNodesState([
        { id: "1", position: { x: x1 - 100, y: y1 + 100 }, data: { title: 'New Note', status: "In Progress", duedate: "2024-01-01" }, type: 'customNode', isHovered: false, isSelected: false }
    ]);
    

    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [nodeCount, setNodeCount] = useState(3);

    function addNoteNode() {
        const lastNode = nodes[nodes.length - 1];
        const newNode = {
            id: nodeCount.toString(),
            position: { x: lastNode.position.x + 300, y: lastNode.position.y },
            data: { title: 'New Note', status: "In Progress", duedate: "2024-01-01", isHovered: false, isSelected: false },
            type: 'noteNode',
        };
        setNodes((nds) => nds.concat(newNode));
        setNodeCount(nodeCount + 1);
    }

    function addNode(){
        if (nodes.length === 0) {
            const newNode = {
                id: "1",
                position: { x: x1 - 100, y: y1 + 100 },
                data: { title: 'New Note', status: "In Progress", duedate: "2024-01-01" },
                type: 'customNode',
                isHovered: false,
                isSelected: false,
            };
            setNodes([newNode]);
            return;
        }
        const lastNode = nodes[nodes.length - 1];
        const newNode = {
            id: nodeCount.toString(),
            position: { x: lastNode.position.x + 500, y: lastNode.position.y -200 },
            data: { title: 'New Note', status: "In Progress", duedate: "2024-01-01" },
            type: 'customNode'
        };
        setNodes((nds) => nds.concat(newNode));
        setNodeCount(nodeCount + 1);
    }

    const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge({
        ...params, 
        markerStart: {type: MarkerType.Arrow, width: 20, height: 10, color: 'white'},
        style: {strokeWidth: 3, stroke: 'white', zIndex:9999999999}
    }, eds)), [setEdges]);

    const handleNodeMouseEnter = (node:any) => {
        setNodes((els:any) =>
          els.map((el:any) => {
            if (el.id === node.id) {
              el.data = {
                ...el.data,
                isHovered: true,
              };
            }
            return el;
          })
        );
      };
      
      const handleNodeMouseLeave = (node:any) => {
        setNodes((els:any) =>
          els.map((el:any) => {
            if (el.id === node.id) {
              el.data = {
                ...el.data,
                isHovered: false,
              };
            }
            return el;
          })
        );
      };

      const handleNodeClick = (node:any) => {
        setNodes((els:any) =>
          els.map((el:any) => {
            if (el.id === node.id) {
                el.data = {
                ...el.data,
                isSelected: true,
              };
            }
            return el;
          })
        );
      };
    const [isOpen, setIsOpen] = useState(true);
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const [flows, setFlows] = useState([]);
    useEffect(() => {
        const getFlows = async () => {
            const response = await fetch("/api/Flows", {
                method: "GET",
            });
            const data = await response.json();
            setFlows(data.flows);
        };
        getFlows();
    }, []);
    
      
    return (
        <>
        <div className="fixed top-0 left-0 h-full z-[99999]"><Navbar1 flows={flows} isOpen={isOpen} setIsOpen={toggleSidebar}/></div>
        <div className="flex justify-center items-center z-[99999] text-white shadow-lg"><FlowTitle Sidebar={isOpen} /></div>
            <ReactFlowProvider>
                <div className="w-[100vw] h-[100vh] bg-neutral-950">
                    <Background variant={"dots" as any} gap={20} size={1}></Background>
                    <ReactFlow
                        onNodeMouseEnter={(event, node) => handleNodeMouseEnter(node)}
                        onNodeMouseLeave={(event, node) => handleNodeMouseLeave(node)}
                        onNodeClick={(event, node) => handleNodeClick(node)}
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        proOptions={proOptions}
                        nodeTypes={nodeTypes}
                        maxZoom={1.5}
                        minZoom={0.2}
                    ></ReactFlow>
                </div>
            </ReactFlowProvider>
            <button onClick={addNode} className="fixed right-1/2 bottom-5 bg-indigo-600 text-white p-2 font-bold rounded z-[999999] hover:bg-indigo-500 transition-all duration-300 ease-in-out">Add Concept</button>
            
        </>
    );
};

export default EditorPage;







