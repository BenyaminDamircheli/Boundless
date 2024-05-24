import React, { memo, useEffect, useState } from 'react';
import CustomHandle from './customHandle';
import { Position } from 'reactflow';
import NoteEditor from "@/components/blocknote/editor";
import Link from "next/link";
import CustomHandle2 from './CustomHandle2';
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

function InitialNode({data, selected}: {data: {title: string, status: string, duedate: string, isHovered: boolean, isSelected: boolean}, selected: boolean}) {
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("Material science is the study of the properties and applications of various materials, including metals, ceramics, polymers, and composites. It involves understanding the atomic, molecular, and microstructural characteristics of materials, and how these influence their overall performance and behavior.");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [summaryDone, setSummaryDone] = useState(false);
    const boundless = "-... --- ..- -. -.. .-.. . ... ..."
    const resources = [
        { url: "https://towardsdatascience.com/the-definitive-perceptron-guide-fd384eb93382", label: "The Definitive Perceptron Guide" },
        { url: "https://www.datacamp.com/tutorial/multilayer-perceptrons-in-machine-learning", label: "Multilayer Perceptrons in Machine Learning" },
        { url: "https://matt.might.net/articles/hello-perceptron/", label: "Hello Perceptron" },
        { url: "https://www.toptal.com/machine-learning/an-introduction-to-deep-learning-from-perceptrons-to-deep-networks", label: "An Introduction to Deep Learning" },
        { url: "https://towardsdatascience.com/what-is-a-perceptron-basics-of-neural-networks-c4cfea20c590", label: "What is a Perceptron?" }
    ];

    useEffect(() => {
        const text = data.title;
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                setTitle(text.slice(0, i + 1));
                i++;
            } else {
                clearInterval(timer);
            }
        }, 20);
        return () => clearInterval(timer);
    }, [data.title]);

    useEffect(() => {
        if (isDialogOpen) {
            let i = 0;
            const ticker = setInterval(() => {
                if (i < boundless.length) {
                    setSummary(boundless.slice(0, i + 1));
                    i++;
                } else {
                    clearInterval(ticker);
                    setTimeout(() => {
                        i = 0;
                        const summaryticker = setInterval(() => {
                            if (i < summary.length) {
                                setSummary(summary.slice(0, i + 1));
                                i++;
                            } else {
                                clearInterval(summaryticker);
                                
                            }
                        }, 5);
                    }, 20);
                }
            }, 20);
        }
    }, [isDialogOpen, summaryDone]);

    return (
        <>
    <div className={`bg-neutral-800 min-w-[2700px] min-h-[800px] rounded-[12px] relative px-2 border-2 flex justify-center items-center transition-all duration-300 node-enter-animation ${
            data.isSelected ? 'border-indigo-600' : 'border-indigo-400'
          }`}>
            <div className='absolute top-4 right-4'>
                <Dialog onOpenChange={setIsDialogOpen}>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <DialogTrigger>
                        <div className='flex justify-center items-center gap-2 rounded-full p-2'>
                            <Info className='w-[110px] h-[110px] text-indigo-500'/>
                            <p className='text-indigo-500 text-[70px]'>Learn More</p>
                        </div>
                    </DialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent className='bg-neutral-800 text-white text-[60px] rounded py-2 px-4 border-indigo-500 border-2'>
                            <p>Learn more</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                    <DialogContent className='bg-neutral-900 text-white rounded py-2 px-4 border-neutral-700 border-[1px] max-h-[800px] overflow-auto'>
                        <DialogHeader>
                            <DialogTitle className='text-[30px]'>{title}</DialogTitle>
                            <DialogDescription>
                                <button className='text-indigo-500 text-sm italic'>Deeper search on {title}?</button>
                            </DialogDescription>
                        </DialogHeader>
                        <div className='text-white break-words'>
                            <p className='text-neutral-400 text-xs'>Concept summary</p>
                            <p className='text-sm my-1'>{summary}</p>
                            
                        </div>
                        <div className='text-white break-words'>
                            <p className='text-neutral-400 text-xs'>Resources for further learning</p>
                            <ul className='text-sm my-1'>
                                {resources.map((resource, index) => (
                                    <li key={index}>
                                        <a href={resource.url} className='text-indigo-500 underline' target="_blank" rel="noopener noreferrer">{resource.label}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <p className='text-neutral-400 text-xs'>Image</p>
                        <div className='flex justify-center'>
                            <img className='rounded' src="https://starship-knowledge.com/wp-content/uploads/2020/10/Perceptrons-1024x724.jpeg" alt="" />
                        </div>
                        

                    </DialogContent>
                </Dialog>
            </div>
            <div className=''><CustomHandle2 type="source" position={Position.Top} isHovered={data.isHovered}/></div>
            <div className=''><CustomHandle2 type="target" position={Position.Bottom} isHovered={data.isHovered}/></div>
            <div className='flex justify-center items-center p-[150px]'><h1 className='text-white text-[210px] text-center font-bold'>{title}</h1></div>
    </div>
    </>
    );
}

export default InitialNode;
