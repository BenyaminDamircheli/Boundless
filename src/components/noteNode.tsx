import React, { memo, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import CustomHandle2 from './CustomHandle2';
import { Position } from 'reactflow';
import dynamic from "next/dynamic";
const NoteEditor = dynamic(() => import("./blocknote/editor"), { ssr: false });

function NoteNode({data}: {data: {title: string}}) {
    const [streamedText, setStreamedText] = useState('');
    const searchParams = useSearchParams();
    const id = searchParams.get("id")

    useEffect(() => {
        async function getQuickAnswer() {
            try {
                const quickAnswer = await fetch(`/api/Flows?id=${id}`);
                const data = await quickAnswer.json();
                console.log(data.flow.quickAnswer);
                if (quickAnswer.ok) {
                    setStreamedText(data.flow.quickAnswer);
                } else {
                    console.error('Failed to fetch flow data:', data.message);
                }
            } catch (error) {
                console.error('Error fetching quick answer:', error);
            }
        }
        if (id) {
            getQuickAnswer();
        }
    }, [id]);
    
    useEffect(() => {
        const text = streamedText
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                setStreamedText(text.slice(0, i + 1));
                i++;
            } else {
                clearInterval(timer);
            }
        }, 5);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className=''>
            <div className={`bg-neutral-900 rounded-[20px] relative border-2 transition-all duration-3000 border-blue-700 w-[16000px] min-h-[4000px] node-enter-animation`}>
                <div><CustomHandle2  type="target" position={Position.Bottom}/></div>
                
                <div className='flex justify-center'><h1 className='text-white text-[500px] italic text-center font-bold pt-20 px-10'>{data.title}</h1></div>
                <div>
                    <div className='text-white bg-neutral-800 rounded-[12px] shadow-lg p-[80px]  m-[100px] border-2 border-neutral-700 break-words'>
                        <h1 className='text-neutral-400 text-[300px] font-light mt-3 ml-3'>quick answer</h1>
                        <p className='p-4 ml-10 mt-3 text-[320px] leading-snug break-words'>
                            {streamedText}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NoteNode;


