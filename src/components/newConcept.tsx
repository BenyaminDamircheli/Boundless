import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle, Send, Loader2 } from "lucide-react";
import { useHotkeys } from 'react-hotkeys-hook'
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";


const API_KEY = 'sk-proj-fxy6JA8psNtnNZsHHxihT3BlbkFJqnQy7VPNj78kHdW0Iy1X'
const apiBody = {
         "model": 'gpt-3.5-turbo-0125',
         "messages": [{ "role": "system", "content": `
         Imagine you are a system tasked with helping a user learn a new concept from start to finish. create a hierarchical "table of contents" where there are main concepts and sub-concepts (which may also have sub-concepts), with the main concepts being a numbered list with bullet point subconcepts underneath.

         Here are the rules you MUST FOLLOW:

         - YOUR RESPONSE SHOULD ONLY BE THE TABLE OF CONTENTS, NOTHING ELSE.

         - BE AS COMPREHENSIVE AS POSSIBLE, we want this person to have a proper list of everything they need to learn to master the subject. 

         - THERE MUST BE MAIN CONCEPTS AND SUBCONCEPTS, WHICH ALSO HAVE SUBCONCEPTS.

         - THE MAIN CONCEPTS SHOULD BE A NUMBERED LIST, WHILE THE SUBCONCEPTS ARE INDENTED BULLET POINTS. 4 SPACES PER INDENT LEVEL

         - TRY TO KEEP THE TITLES LESS THAN 35 CHARACTERS. DO NOT GO OVER 10 - 13 MAIN CONCEPTS

         Now do this for Neuroscience
         ` }],
         "temperature": 1,
         "max_tokens": 500,
         "top_p": 1,
         "frequency_penalty": 0,
         "presence_penalty": 0
}

async function getTOC(query: string) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + API_KEY,
        },
        body: JSON.stringify(apiBody),
        
    });
    const data = await response.json();
    console.log(data);
    if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
    } else {
        console.error('Unexpected API response:', data);
        throw new Error('Failed to retrieve table of contents');
    }
}

function parseTOC(toc: string, query: string) {
    const lines = toc.split('\n').filter(line => line.trim() !== '');
    const nodes: any[] = [];
    const edges: any[] = [];
    let nodeId = 0;
    const parentStack: { id: number, level: number }[] = [];

    // Add the very first node as a noteNode with the title being the query
    const firstNode = {
        id: nodeId.toString(),
        position: { x: 0, y: 0 },
        data: { title: query, status: 'In Progress', duedate: '2024-01-01' },
        type: 'noteNode'
    };
    nodes.push(firstNode);
    nodeId++;

    lines.forEach((line) => {
        const level = (line.match(/^\s*/)?.[0].length ?? 0) / 4; // Adjusted for 4 spaces per level
        const title = line.replace(/^\s*[-\d]+\.\s*/, '').replace(/^—/, '').replace(/^-/, '').replace(/^\s*-\s*/, '').trim();

        const node = {
            id: nodeId.toString(),
            position: { x: 0, y: 0 }, // Default position, can be adjusted as needed
            data: { title: title, status: 'In Progress', duedate: '2024-01-01' },
            type: level === 0 ? 'customNode' : 'subConceptNode',
            
        };
        nodes.push(node);

        while (parentStack.length > 0 && parentStack[parentStack.length - 1].level >= level) {
            parentStack.pop();
        }

        if (level === 0) {
            // Connect all main concept nodes to the first noteNode
            edges.push({
                id: `e0-${nodeId}`,
                source: nodeId.toString(),
                target: '0',
                style: {
                    strokeWidth: 7, stroke: 'white', zIndex:9999999999
                }
            });
        } else if (parentStack.length > 0) {
            const parentNodeId = parentStack[parentStack.length - 1].id;
            edges.push({
                id: `e${parentNodeId}-${nodeId}`,
                source: nodeId.toString(),
                target: parentNodeId.toString(),
                style: {
                    strokeWidth: 7, stroke: 'white', zIndex:9999999999
                }
            });
        }

        parentStack.push({ id: nodeId, level: level });
        nodeId++;
    });

    console.log(nodes);
    console.log(edges);
    
    return { nodes, edges };
}



export default function NewConcept({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) {
    const router = useRouter();
    const [inputValue, setInputValue] = useState("");
    const [formOn, setFormOn] = useState(true);
    

    const {userId} = useAuth();
    const user = useUser();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formOn) return; // Prevent further submissions if the form is already processing
    setFormOn(false); // Disable the form immediately on submission

    try {
      const OpenAIResponse = await getTOC(inputValue);
      const toc = parseTOC(OpenAIResponse, inputValue);
      const { nodes, edges } = toc;
      console.log("Nodes:", nodes); // Debugging log
      console.log("Edges:", edges); // Debugging log

      const response = await fetch("/api/Flows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: inputValue,
          userId: userId as string,
          name: user.user?.fullName,
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const body = await response.json();
      const id = body.flow.id;
      console.log(id);

      const saveFlows = await fetch("/api/saveFlows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: id,
          nodes: nodes,
          edges: edges
        })
      });

      console.log(saveFlows)

      setIsOpen(false);
      router.push(`/editor/${id}?id=${id}`);
    } catch (error) {
      console.error("Error during form submission:", error);
      setFormOn(true); // Re-enable the form if an error occurs
    }
  }

  
  return (
    <div className="flex justify-center items-center bg-neutral-800 rounded-[20px]">
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="text-white font-bold bg-indigo-600 p-2 rounded w-full flex justify-between items-center gap-2 hover:bg-indigo-700 transition-all duration-300 ease-in-out">
          <PlusCircle className="h-5 w-5 font-bold" /> New Search  <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-3 rounded border-2 border-neutral-700 bg-neutral-800 px-1"><span className="text-[10px] text-neutral-400">⌘k</span></kbd>
        </button>
      </DialogTrigger>
      <DialogContent className="bg-neutral-900 rounded-[20px] border-2 border-indigo-400 w-[1000px] h-[400px]">
        <DialogHeader>
          <DialogTitle className="font-bold text-6xl text-center italic">Boundless Explorer</DialogTitle>
          <DialogDescription className="text-center  text-sm text-neutral-400 pt-2">
            Quickly find what you are trying to learn, see how concepts connect, or discover something new entirely.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-[-20px]">
          <div className="relative">
            <input
              type="text"
              placeholder="Find everything humans know about..."
              disabled={!formOn}
              className="h-12 px-4 pr-20 rounded-[10px] w-full border-[1px] border-neutral-700 bg-neutral-950"
              onChange={handleInputChange}
              value={inputValue}
            />
            <button className="text-indigo-700 font-bold transition-all" disabled={!formOn}> {formOn ? <Send className="absolute right-4 inset-y-0 my-auto h-5 w-5" /> : <Loader2 className="absolute right-4 inset-y-0 my-auto h-6 w-6 animate-spin text-indigo-700" />} </button>
          </div>
          <p className="text-neutral-400 text-sm mt-4 font-bold">Don't know what to learn next? Try one of these instead.</p>
          <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-neutral-900 h-8 rounded flex items-center justify-center font-bold text-sm border-[1px] border-neutral-700 hover:bg-neutral-950 cursor-pointer transition-all duration-300 ease-in-out shadow-lg">Neural Networks</div>
                <div className="bg-neutral-900 h-8 rounded flex items-center justify-center font-bold text-sm border-[1px] border-neutral-700 hover:bg-neutral-950 cursor-pointer transition-all duration-300 ease-in-out shadow-lg">American History</div>
                <div className="bg-neutral-900 h-8 rounded flex items-center justify-center font-bold text-sm border-[1px] border-neutral-700 hover:bg-neutral-950 cursor-pointer transition-all duration-300 ease-in-out shadow-lg">How to Reduce Stress</div>
                <div className="bg-neutral-900 h-8 rounded flex items-center justify-center font-bold text-sm border-[1px] border-neutral-700 hover:bg-neutral-950 cursor-pointer transition-all duration-300 ease-in-out shadow-lg">Data Science</div>
                <div className="bg-neutral-900 h-8 rounded flex items-center justify-center font-bold text-sm border-[1px] border-neutral-700 hover:bg-neutral-950 cursor-pointer transition-all duration-300 ease-in-out shadow-lg">Programming in Python</div>
                <div className="bg-neutral-900 h-8 rounded flex items-center justify-center font-bold text-sm border-[1px] border-neutral-700 hover:bg-neutral-950 cursor-pointer transition-all duration-300 ease-in-out shadow-lg">Neurobiology</div>
              </div>
        </form>
      </DialogContent>
    </Dialog>
    </div>
  );
}