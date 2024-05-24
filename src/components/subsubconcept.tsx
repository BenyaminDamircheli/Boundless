import React from "react";
import { Handle, Position } from "reactflow";
import CustomHandle2 from "./CustomHandle2";


function SubConceptNode({data, selected}: {data: {title: string, status: string, duedate: string, isHovered: boolean, isSelected: boolean}, selected: boolean}) {

    return (
        <div className={`bg-neutral-800 min-w-[320px] max-w-[320px] max-h-[200px] min-h-[100px] rounded-[8px] relative px-2 border-2 transition-all duration-300 node-enter-animation ${
            data.isHovered ? 'cursor-pointer border-green-600' : 'border-green-700'
          }`}>
            <div className=''><CustomHandle2 type="source" position={Position.Top} isHovered={data.isHovered}/></div>
            <div className=''><CustomHandle2 type="target" position={Position.Bottom} isHovered={data.isHovered}/></div>
            <div className='p-3'><h1 className='text-white text-[40px] text-center'>{data.title}</h1></div>
            
            
        </div>
    );
}


export default SubConceptNode;

