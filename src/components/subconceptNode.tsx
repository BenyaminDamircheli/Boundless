// For a feature I am working on that I may add in the future. Not complete.

import React, {useEffect, useState} from "react";
import { Handle, Position } from "reactflow";
import CustomHandle2 from "./CustomHandle2";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import {
      Tooltip,
      TooltipContent,
      TooltipProvider,
      TooltipTrigger,
    } from "@/components/ui/tooltip"  
  import { Info } from 'lucide-react';

function SubConceptNode({data}: {data: {title: string, parentNode: string, pageTopic:string}}) {
    const [title, setTitle] = useState(data.title);
    const [summary, setSummary] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false); 
    const [summaryDone, setSummaryDone] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false)
    const [responseTime, setResponseTime] = useState(0)
    const boundless = "-... --- ..- -. -.. .-.. . ... ..."
    const [image, setImage] = useState("");
    const [resources, setResources] = useState<{ title: string, url: string }[]>([]);
    const [hasFetched, setHasFetched] = useState(false);

    useEffect(() => {
        async function getQuickAnswer() {
            const apiBody = {
            "model": 'gpt-3.5-turbo',
            "messages": [{ "role": "system", "content": `You are a concept summarizer and speak like Wikipedia. You should give a quick answer/description of any topic given to you. You should not converse with them, just output an introduction of the following topic. BE CONCISE IN LESS THAN 100 WORDS. Now do this for ${data.title} as it relates to ${data.pageTopic}.`}],
            "temperature": 1,
            "max_tokens": 200,
            "top_p": 1,
            "frequency_penalty": 0,
            "presence_penalty": 0
        }
            console.log('fetching quick answer');
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_OPENAI_API_KEY,
                },
                body: JSON.stringify(apiBody),
            
            });
            const info = await response.json();
            if (info.choices && info.choices.length > 0) {
                setSummary(info.choices[0].message.content)
                setHasFetched(true);
            } else {
                console.error('Unexpected API response:', data);
                throw new Error('Failed to retrieve quick answer');
            }
        }
        async function getTavily(){
            const response = await fetch("https://api.tavily.com/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    api_key: "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",
                    query: `${data.title} as it relates to ${data.pageTopic}`,
                    search_depth: "basic",
                    include_answer: false,
                    include_images: true,
                    include_raw_content: false,
                    max_results: 5,
                }),
            });
            const info = await response.json();
            console.log(info);
            setImage(info.images[0]);
            setResources(info.results);
            setResponseTime(info.response_time)
            setIsLoaded(true)
        }
        if(isDialogOpen && !hasFetched){
            getTavily();
            getQuickAnswer();
            setHasFetched(true);
        }
    }, [isDialogOpen, hasFetched]);
    
    useEffect(() => {
        if (isDialogOpen) {
            let i = 0;
            const timer = setInterval(() => {
                if (i < boundless.length) {
                    setSummary(boundless.slice(0, i + 1));
                    i++;
                } else {
                    clearInterval(timer);
                    setTimeout(() => {
                        i = 0;
                        const summarytimer = setInterval(() => {
                            if (i < summary.length) {
                                setSummary(summary.slice(0, i + 1));
                                i++;
                            } else {
                                clearInterval(summarytimer);
                                
                            }
                        }, 5);
                    }, 20);
                }
            }, 20);
        }
    }, [isDialogOpen, summaryDone]);
    return (
        <>
        <div className={`bg-neutral-800 min-w-[500px] min-h-[400px] max-w-[1000px] max-h-[900px] rounded-[8px] relative px-2 border-2 transition-al flex justify-center items-center duration-3000 node-enter-animation border-orange-700`}>
        
            <div className='opacity-0'><CustomHandle2 type="source" position={Position.Top}/></div>
            <div className='opacity-0'><CustomHandle2 type="target" position={Position.Bottom}/></div>
            <div className='my-[100px] mx-10 flex items-center justify-center'><h1 className='text-white text-[100px] text-center'>{data.title}</h1></div>
            <div className='absolute top-4 right-4'>
            <Dialog onOpenChange={setIsDialogOpen}>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <DialogTrigger>
                        <div className='flex justify-center items-center gap-2 rounded-full p-2'>
                            <Info className='w-[90px] h-[90px] text-indigo-500'/>
                            <p className='text-indigo-500 text-[50px]'>Learn More</p>
                        </div>
                    </DialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent className='bg-neutral-800 text-white text-[60px] rounded py-2 px-4 border-indigo-500 border-2'>
                            <p>Learn more</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                    <DialogContent className='bg-white text-black rounded py-2 px-4 border-neutral-300 border-[1px] max-h-[800px] overflow-auto'>
                        <DialogHeader>
                            <DialogTitle className='text-[30px]'>{title}</DialogTitle>
                            <DialogDescription>
                                <button className='text-indigo-500 text-sm italic'>Deeper search on {title}?</button>
                                {!isLoaded && (
                                    <p className="text-neutral-600 italic text-xs">Searching...</p>
                                )}
                                {isLoaded && (
                                    <p className="text-neutral-600 italic text-xs">Search time: {responseTime}s</p>
                                )}
                            </DialogDescription>
                        </DialogHeader>
                        <div className='text-black break-words'>
                            <p className='text-sm my-1'>{summary}</p>
                            
                        </div>
                        <div className='text-black break-words'>
                            <p className='text-neutral-600 text-xs'>Resources for further learning</p>
                            <ul className='text-sm my-1'>
                                {resources.map((resource, index) => (
                                    <li key={index}>
                                        <a href={resource.url} className='text-indigo-500 underline' target="_blank" rel="noopener noreferrer">{resource.title}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <p className='text-neutral-600 text-xs'>Image</p>
                        <div className='flex justify-center'>
                            <img className='rounded' src={image} alt="" />
                        </div>
                    </DialogContent>
                </Dialog>
                </div>
            
            
        </div>
    </>
    );
}


export default SubConceptNode;


