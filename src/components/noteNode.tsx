import React, { memo, useEffect, useState } from 'react';
import CustomHandle2 from './CustomHandle2';
import { Position } from 'reactflow';
import dynamic from "next/dynamic";
const NoteEditor = dynamic(() => import("./blocknote/editor"), { ssr: false });

function NoteNode({data, selected}: {data: {title: string, status: string, duedate: string, isHovered: boolean}, selected: boolean}) {
    const [streamedText, setStreamedText] = useState('Neural Networks are a type of machine learning model that are used to predict the output of a given input. They are used in a wide range of applications, from natural language processing to image recognition.');
    const [topic, setTopic] = useState(data.title);
    // const API_KEY = 'sk-proj-fxy6JA8psNtnNZsHHxihT3BlbkFJqnQy7VPNj78kHdW0Iy1X'
    // const apiBody = {
    //     "model": 'gpt-3.5-turbo',
    //     "messages": [{ "role": "system", "content": "You are a concept summarizer and speak like Wikipedia. You should give a quick answer/description of any topic given to you. You should not converse with them, just output an introduction of the following topic: " + topic }],
    //     "temperature": 1,
    //     "max_tokens": 80,
    //     "top_p": 1,
    //     "frequency_penalty": 0,
    //     "presence_penalty": 0
    // }
    // useEffect(() => {
    //     async function getQuickAnswer() {
    //         console.log('fetching quick answer');
    //         const response = await fetch('https://api.openai.com/v1/chat/completions', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': 'Bearer ' + API_KEY,
    //             },
    //             body: JSON.stringify(apiBody),
    //         }).then(data => data.json()).then(data => {
    //             console.log(data);
    //             setStreamedText(data.choices[0].message.content);
    //         });
    //     }
    //     getQuickAnswer();
    // }, [topic]);

    setTimeout(() => {
        
    }, 100);
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
        }, 10);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className=''>
            <div className={`bg-neutral-900 rounded-[20px] relative border-2 transition-all duration-3000 border-blue-700 w-[14000px] min-h-[3000px] node-enter-animation`}>
                <div><CustomHandle2  type="target" position={Position.Bottom} isHovered={data.isHovered}/></div>
                
                <div className='flex justify-center'><h1 className='text-white text-[450px] italic font-bold pt-20 ml-8'>Transformers and Neural Networks</h1></div>
                <div>
                    <div className='text-white bg-neutral-800 rounded-[12px] shadow-lg p-[80px]  m-[100px] border-2 border-neutral-700 break-words'>
                        <h1 className='text-neutral-400 text-[200px] font-light mt-3 ml-3'>quick answer</h1>
                        <p className='p-4 ml-7 mt-3 text-[250px] leading-snug break-words'>
                            {streamedText}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NoteNode;


