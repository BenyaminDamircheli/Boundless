'use client'
import React, { useState, useEffect } from "react";
import {BackgroundBeams} from "./background-beams";
import Link from "next/link";
import { db } from "../lib/db";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";

const Body = () => {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const {userId} = useAuth();
  const user = useUser();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const response = await fetch("/api/Flows", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({title: inputValue, userId: userId as string, name: user.user?.fullName})
    });
    const body = await response.json();
    const id = body.id;
    console.log(body);
    router.push(`/editor/${id}`);
}

  return (
    <div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <BackgroundBeams />
        </div>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center w-[1300px]">
            <h1 className="text-7xl font-bold">We are entering a new era of <span className="text-indigo-600">information discovery.</span></h1>
            <p className="text-xl mt-6 mx-auto w-[70%]">Boundless is a <span className="line-through">search</span> <span className="font-bold underline">learning</span> engine. Quickly find what you want to learn, see how concepts relate to eachother, or discover something entirely unexpected, with <span className="font-bold text-indigo-600">Boundless.</span></p>
            <form className="mt-6 mx-auto w-1/2" onSubmit={handleSubmit}>
              <div className="relative mt-2">
                <input type="text" placeholder="What do you want to learn?" className="h-14 px-4 pr-20 rounded w-full border-[1px] border-neutral-700 bg-neutral-900" onChange={handleInputChange} value={inputValue} />
                <button type="submit" className="absolute right-4 inset-y-0 my-auto text-indigo-600 font-bold transition-all">{loading ? <Loader2 className="absolute right-4 inset-y-0 my-auto h-6 w-6 animate-spin text-indigo-700" /> : <Send className="absolute right-4 inset-y-0 my-auto h-5 w-5" />}</button>
              </div>
            </form> 
            <div className="mt-10 mx-auto w-1/2 text-left">
              <h1 className="text-xl font-bold">Not sure what to learn? Try one of these:</h1>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-neutral-900 h-8 rounded flex items-center justify-center font-bold text-sm border-[1px] border-neutral-700 hover:bg-neutral-950 cursor-pointer shadow-lg">Neural Networks</div>
                <div className="bg-neutral-900 h-8 rounded flex items-center justify-center font-bold text-sm border-[1px] border-neutral-700 hover:bg-neutral-950 cursor-pointer shadow-lg">American History</div>
                <div className="bg-neutral-900 h-8 rounded flex items-center justify-center font-bold text-sm border-[1px] border-neutral-700 hover:bg-neutral-950 cursor-pointer shadow-lg">How to Reduce Stress</div>
                <div className="bg-neutral-900 h-8 rounded flex items-center justify-center font-bold text-sm border-[1px] border-neutral-700 hover:bg-neutral-950 cursor-pointer shadow-lg">Data Science</div>
                <div className="bg-neutral-900 h-8 rounded flex items-center justify-center font-bold text-sm border-[1px] border-neutral-700 hover:bg-neutral-950 cursor-pointer shadow-lg">Programming in Python</div>
                <div className="bg-neutral-900 h-8 rounded flex items-center justify-center font-bold text-sm border-[1px] border-neutral-700 hover:bg-neutral-950 cursor-pointer shadow-lg">Neurobiology</div>
              </div>
            </div>
          </div>
        </div>
        {showScrollIndicator && (
                    <div className="fixed bottom-5 right-5 p-2 bg-neutral-900 rounded shadow-lg transition-opacity duration-50 ease-in-out opacity-100 flex items-center justify-center animate-bounce">
            <p className="text-white font-bold">Learn more below</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        )}
    </div>
  );
};

export default Body;

