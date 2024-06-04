'use client'
import React, { useState, useEffect } from "react";
import {BackgroundBeams} from "./background-beams";
import Link from "next/link";
import { db } from "../lib/db";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { Loader2, Send, ArrowBigRight, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { v4 as uuidv4 } from 'uuid';

async function getTOC(query: string) {

  const apiBody = {
      "model": 'gpt-3.5-turbo-0125',
      "messages": [{ "role": "system", "content": `
      Imagine you are a system tasked with helping a user learn a new concept. Create a hierarchical table of contents where there are main concepts and sub-concepts (which may also have sub-concepts), with the main concepts being a numbered list with bullet point subconcepts underneath.

      Here are the rules you MUST FOLLOW:

      - USE A MINIMUM OF 500 WORDS IN YOUR RESPONSE!

      - DO NOT INCLUDE ANY INTRODUCTION OR CONCLUSION SECTION IN THE TOC. JUST TECHNICAL CONCEPTS RELATING TO THE QUERY.

      - YOUR RESPONSE SHOULD ONLY BE THE TABLE OF CONTENTS, NOTHING ELSE.

      - BE AS COMPREHENSIVE AS POSSIBLE. GIVE THE USER A BIG LIST OF ALL THE CONCEPTS THEY NEED TO KNOW.

      - THERE MUST BE MULTUPLE MAIN CONCEPTS AND SUBCONCEPTS, WHICH ALSO HAVE SUBCONCEPTS.

      - THE MAIN CONCEPTS SHOULD BE A NUMBERED LIST, WHILE THE SUBCONCEPTS ARE INDENTED BULLET POINTS. 4 SPACES PER INDENT LEVEL
      
      - TRY TO KEEP THE TITLES LESS THAN 30 CHARACTERS.

      Now do this for: ${query}
      ` }],
      "temperature": 1,
      "max_tokens": 800,
      "top_p": 1,
      "frequency_penalty": 0,
      "presence_penalty": 0
}
const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_OPENAI_API_KEY,
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

  async function getQuickAnswer(query: string) {
      const apiBody = {
      "model": 'gpt-3.5-turbo',
      "messages": [{ "role": "system", "content": `You are a concept summarizer and speak like Wikipedia. You should give a quick answer/description of any topic given to you. You should not converse with them, just output an introduction of the following topic. FINISH YOUR RESPONSE WITHIN 100 TOKENS!. Now do this for: ${query} `}],
      "temperature": 1,
      "max_tokens": 120,
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
      const data = await response.json();
      console.log(data);
      if (data.choices && data.choices.length > 0) {
          return data.choices[0].message.content;
      } else {
          console.error('Unexpected API response:', data);
          throw new Error('Failed to retrieve quick answer');
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
      data: { title: query },
      type: 'noteNode'
  };
  nodes.push(firstNode);
  nodeId++;

  lines.forEach((line) => {
      const level = (line.match(/^\s*/)?.[0].length ?? 0) / 4; // Adjusted for 4 spaces per level
      const title = line.replace(/^\s*[-\d]+\.\s*/, '').replace(/^—/, '').replace(/^-/, '').replace(/^\s*-\s*/, '').trim();

      const node: any = {
          id: nodeId.toString(),
          position: { x: 0, y: 0 }, 
          data: { title: title, level: level, pageTopic: query},
          type: level === 0 ? 'customNode' : 'subConceptNode',
      };

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
                  strokeWidth: 7, stroke: 'white', zIndex:9999999999, 
                  markerStart: 'arrow'
              }
          });
      } else if (parentStack.length > 0) {
          const parentNodeId = parentStack[parentStack.length - 1].id;
          node.data.parentNode = parentNodeId.toString();
          edges.push({
              id: `e${parentNodeId}-${nodeId}`,
              source: nodeId.toString(),
              target: parentNodeId.toString(),
              style: {
                  strokeWidth: 7, stroke: 'white', zIndex:9999999999
              }
          });
      }

      nodes.push(node);
      parentStack.push({ id: nodeId, level: level });
      nodeId++;
  });

  console.log(nodes);
  console.log(edges);
  
  return { nodes, edges };
}




const Body = () => {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {userId} = useAuth();
  const user = useUser();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const searchQuery = inputValue.trim();
    if (searchQuery) {
        const searchId = uuidv4(); // Using timestamp as a unique search ID
        router.push(`/wiki?q=${encodeURIComponent(searchQuery)}&search_context=${encodeURIComponent(searchQuery)}&id=${searchId}`);
    }
}

  return (
    <div className="bg-white">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          
        </div>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center w-[1300px]">
            <h1 className="text-7xl font-bold text-black">Finding things to learn has <span className="text-indigo-600">never been easier.</span></h1>
            <p className="text-lg mt-6 mx-auto w-[70%] text-black">Boundless is a <span className="">learning</span> engine. Quickly find what you want to learn, see how concepts relate to each other, or discover something entirely unexpected.</p>
            <form className="mt-6 mx-auto w-[700px] border border-neutral-700 bg-white rounded shadow-lg" onSubmit={handleSubmit}>
              <div className="relative my-1 h-[60px] px-2 pr-20 rounded w-full">
                <Input type="text" placeholder="I want to learn about..." className="h-full w-full px-2 text-black font-bold text-md bg-white border-none focus:outline-none rounded-lg placeholder:text-gray-500" onChange={handleInputChange} value={inputValue} />
                <button type="submit" className="absolute right-4 bottom-4 text-indigo-600 font-bold transition-all">{loading ? <Loader2 className="h-7 w-7 animate-spin text-indigo-700" /> : <ArrowRight className="h-6 w-6" />}</button>
              </div>
              <div className="flex justify-between border-t border-neutral-700 rounded-b-[5px]">
                <button type="button" className= "border-t border-neutral-700 rounded-md w-full py-2 bg-indigo-600 text-white active:bg-neutral-300">Default</button>
                <button type="button" className="text-black border-t border-l border-neutral-700 rounded-md w-full py-2 hover:bg-neutral-200 active:bg-neutral-300 flex items-center justify-center gap-2">
                  <div className="bg-indigo-700 text-white rounded px-1 text-xs font-bold">Pro</div>
                  Turbo
                </button>
                <button type="button" className="text-black border-t border-l border-neutral-700 rounded-md w-full py-2 hover:bg-neutral-200 active:bg-neutral-300 flex items-center justify-center gap-2">
                  <div className="bg-indigo-700 text-white rounded px-1 text-xs font-bold">Pro</div>
                  Research
                </button>
              </div>
            </form>
            <div className="mt-10 mx-auto w-1/2 text-left">
              <h1 className="text-xl font-bold text-black">Not sure what to learn? Try one of these:</h1>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-neutral-100 h-8 rounded flex items-center justify-center font-bold text-sm border-[1px] border-neutral-700 hover:bg-neutral-200 cursor-pointer shadow-lg text-black">Neural Networks</div>
                <div className="bg-neutral-100 h-8 rounded flex items-center justify-center font-bold text-sm border-[1px] border-neutral-700 hover:bg-neutral-200 cursor-pointer shadow-lg text-black">American History</div>
                <div className="bg-neutral-100 h-8 rounded flex items-center justify-center font-bold text-sm border-[1px] border-neutral-700 hover:bg-neutral-200 cursor-pointer shadow-lg text-black">How to Reduce Stress</div>
                <div className="bg-neutral-100 h-8 rounded flex items-center justify-center font-bold text-sm border-[1px] border-neutral-700 hover:bg-neutral-200 cursor-pointer shadow-lg text-black">Data Science</div>
                <div className="bg-neutral-100 h-8 rounded flex items-center justify-center font-bold text-sm border-[1px] border-neutral-700 hover:bg-neutral-200 cursor-pointer shadow-lg text-black">Programming in Python</div>
                <div className="bg-neutral-100 h-8 rounded flex items-center justify-center font-bold text-sm border-[1px] border-neutral-700 hover:bg-neutral-200 cursor-pointer shadow-lg text-black">Neurobiology</div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Body;

