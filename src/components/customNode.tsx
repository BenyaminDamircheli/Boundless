import React, { memo } from 'react';
import CustomHandle from './customHandle';
import { Position} from 'reactflow';
import NoteEditor from "@/components/blocknote/editor";
import Link from "next/link";

 



function InitialNode({data, selected}: {data: {title: string, status: string, duedate: string, isHovered: boolean, isSelected: boolean}, selected: boolean}) {

    return (
        <div className={`bg-neutral-800 w-[300px] h-[150px] rounded-[8px] relative px-2 border-2 transition-all duration-300 node-enter-animation ${
            data.isSelected ? 'border-indigo-600' : 'border-indigo-400'
          }`}>
             <div className=''><CustomHandle type="target" position={Position.Right} isHovered={data.isHovered}/></div>
            <div className=''><CustomHandle type="source" position={Position.Left} isHovered={data.isHovered}/></div>
            <div className='mt-3 mb-2'><h1 className='text-white text-xl font-bold'>{data.title}</h1></div>
            <div className='flex justify-between mt-[60px]'>
                <div className=''><Link href={`/noteEditor`}><button className={'bg-indigo-600 text-white p-2 rounded font-bold hover:cursor-pointer ' + (data.isHovered ? 'hover:bg-indigo-500' : '')}>Create Note</button></Link></div>
                <div className='flex justify-center items-center mr-2'><p className='font-bold text-green-400'>{data.status}</p></div>
            </div>
            
            
        </div>
    );
}


export default memo(InitialNode);








