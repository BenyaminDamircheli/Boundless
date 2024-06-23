'use client'

import React, { useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { v4 as uuidv4 } from 'uuid';
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@radix-ui/react-hover-card";

const Body = () => {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const searchQuery = inputValue.trim();
    const searchQueryCap = Capitalize(searchQuery);
    if (searchQuery) {
      const searchId = uuidv4();
      router.push(`/wiki?q=${encodeURIComponent(searchQueryCap)}&search_context=${encodeURIComponent(searchQueryCap)}&id=${searchId}`);
    }
  }

  function Capitalize(str: string) {
    return str.replace(/\b\w/g, (l) => l.toUpperCase());
  }

  const handleSuggestionClick = (suggestion: string) => {
    const searchId = uuidv4();
    router.push(`/wiki?q=${encodeURIComponent(suggestion)}&search_context=${encodeURIComponent(suggestion)}&id=${searchId}`);
  };

  return (
    <div className="bg-white">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10"></div>
      <div className="flex items-center justify-center h-screen">
        <div className="text-center w-[1300px]">
          <h1 className="text-7xl font-bold text-black">Finding things to learn has <span className="text-indigo-600">never been easier.</span></h1>
          <p className="text-lg mt-6 mx-auto w-[70%] text-black">Boundless is a <span className="">learning</span> engine. Quickly find what you want to learn, see how concepts relate to each other, or discover something entirely unexpected.</p>
          <form className="mt-6 mx-auto w-[700px] border border-neutral-700 bg-white rounded shadow-lg" onSubmit={handleSubmit}>
            <div className="relative my-1 h-[60px] px-2 pr-20 rounded w-full">
              <Input 
                type="text" 
                placeholder="I want to learn about..." 
                className="h-full w-full px-2 text-black font-bold text-md bg-white border-none focus:outline-none rounded-lg placeholder:text-gray-500" 
                onChange={handleInputChange} 
                value={inputValue} 
              />
              <button type="submit" className="absolute right-4 bottom-4 text-indigo-600 font-bold transition-all">
                {loading ? <Loader2 className="h-7 w-7 animate-spin text-indigo-700" /> : <ArrowRight className="h-6 w-6" />}
              </button>
            </div>
            <div className="flex justify-between border-t border-neutral-700 rounded-b-[5px]">
              <HoverCard>
                <HoverCardTrigger className="w-full">
                  <button type="button" className="border-t border-l border-neutral-700 rounded-md w-full py-2 bg-indigo-600 text-white flex items-center justify-center gap-2">
                    Default
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className="bg-neutral-800 text-white rounded px-2 py-1 text-xs w-[200px]">
                  <p className="text-xs font-bold underline">Default</p>
                  <div className="mt-2 flex-col space-y-2">
                    <p className="text-[10px]">Default is our base model that delivers excellent results, <span className="font-bold text-indigo-400">for free!</span></p>
                  </div>
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger className="w-full">
                  <button type="button" className="text-black border-t border-l border-neutral-700 rounded-md w-full py-2 hover:bg-neutral-200 active:bg-neutral-300 flex items-center justify-center gap-2">
                    <div className="bg-indigo-700 text-white rounded px-1 text-xs font-bold">Pro</div>
                    Turbo
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className="bg-neutral-800 text-white rounded px-2 py-1 text-xs w-[200px]">
                  <p className="text-xs font-bold underline">Turbo</p>
                  <div className="mt-2 flex-col space-y-2">
                    <p className="text-[10px]">Turbo is <span className="font-bold">3x</span> smarter and <span className="font-bold">5x</span> faster than our default model.</p>
                  </div>
                  <p className="text-[8px] mt-2 italic">Currently unavailable, but let us know if you want this!</p>
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger className="w-full">
                  <button type="button" className="text-black border-t border-l border-neutral-700 rounded-md w-full py-2 hover:bg-neutral-200 active:bg-neutral-300 flex items-center justify-center gap-2">
                    <div className="bg-indigo-700 text-white rounded px-1 text-xs font-bold">Pro</div>
                    Research
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className="bg-neutral-800 text-white rounded px-2 py-1 text-xs w-[200px]">
                  <p className="text-xs font-bold underline">Research</p>
                  <div className="mt-2 flex-col space-y-2">
                    <p className="text-[10px]">Research is <span className="font-bold">5x</span> smarter than our default model.<span className="font-bold text-indigo-400"> It also supports searching with images!</span></p>
                  </div>
                  <p className="text-[8px] mt-2 italic">Currently unavailable, but let us know if you want this!</p>
                </HoverCardContent>
              </HoverCard>
            </div>
          </form>
          <div className="mt-10 mx-auto w-1/2 text-left">
            <h1 className="text-xl font-bold text-black">Not sure what to learn? Try one of these:</h1>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {["Neural Networks", "American History", "Jet Engines", "Data Science", "Programming in Python", "Neuroscience"].map((suggestion) => (
                <div
                  key={suggestion}
                  className="bg-neutral-100 h-8 rounded flex items-center justify-center font-bold text-sm border-[1px] border-neutral-700 hover:bg-neutral-200 cursor-pointer shadow-lg text-black"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
