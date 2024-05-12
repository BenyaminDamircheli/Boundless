import React, { memo } from 'react';
import CustomHandle from './customHandle';
import { Position, NodeResizer } from 'reactflow';

import dynamic from "next/dynamic";
 
const NoteEditor = dynamic(() => import("./blocknote/editor"), { ssr: false });

function NoteNode({data, selected}: {data: {title: string, status: string, duedate: string, isHovered: boolean}, selected: boolean}) {
        
    return (
        <>
        <div><CustomHandle type="target" position={Position.Right} isHovered={data.isHovered}/></div>
        <div><CustomHandle type="source" position={Position.Left} isHovered={data.isHovered}/></div>
        <div className={`bg-neutral-950 rounded-[8px] relative border-2 transition-all duration-3000 border-indigo-400 min-w-[400px] min-h-[200px] w-full`}>
            <NoteEditor/>
        </div>
        </>
    )
}

export default NoteNode;
