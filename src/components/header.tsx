"use client"
import React, {useState, useEffect} from "react";
import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, UserButton} from "@clerk/nextjs";
import { BackgroundBeams } from "./background-beams";
import { Matrix } from "./dotMatrix";
import { AnimatePresence} from "framer-motion";
import { ArrowUpRight, ChevronDown, Cpu, FileQuestionIcon, GraduationCap, SquareArrowUpRight, Wifi } from "lucide-react";
import History from "./history";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"





const Header = () => {
  const userButtonAppearance = {
    elements: {
      userButtonAvatarBox: "w-4 h-4",
    },
  };
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  return (
    <AnimatePresence>
      <div className="relative w-full h-[90px]">
        <Matrix
          animationSpeed={12}
          containerClassName="absolute inset-0 z-0"
          colors={[
            [147, 51, 234],
          ]}
          opacities={[0.7, 0.4, 0.1, 0.2, 0.2, 0.4, 0.4, 0.4, 0.4, 1]}
          dotSize={3.5}
        />
        <div className="relative flex justify-between items-center w-full mx-auto pt-5 bg-transparent z-10">
          <div className="flex items-center ml-14">
            <Link href="/"><Image src="/Cogni.png" alt="Cogni" width={32} height={32} className="border-2 border-indigo-600 rounded p-1" /></Link>
            <h1 className="text-3xl font-bold ml-3 text-black "><Link href="/" className="text-black">Boundless</Link></h1>
          </div>
          <nav className="flex justify-end gap-x-3 items-center">
            
            <SignedOut>
              
            <div className="flex items-center gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="bg-indigo-600 flex justify-center items-center w-21 font-bold px-4 py-1 rounded hover:bg-indigo-500 transition-all text-xs underline text-white">
                  
                    Try Pro
                    <SquareArrowUpRight className="ml-1 w-4 h-4" />
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-white border-2 border-zinc-500">
                  <DialogHeader>
                    <DialogTitle>Our Road Map for Boundless Pro</DialogTitle>
                    <DialogDescription>
                      Try Pro is a premium feature that allows you to search the web using your own context.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
               
              <SignInButton mode="modal">
                <button className="bg-indigo-600 text-white w-22 font-bold px-4 text-xs py-1 rounded hover:bg-indigo-500 transition-all mr-14">Log in</button>
              </SignInButton>
            </div>
            </SignedOut>
            <SignedIn>
            <div className="flex items-center gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="bg-indigo-600 flex justify-center items-center w-21 font-bold px-4 py-1 rounded hover:bg-indigo-500 transition-all text-xs underline text-white">
                    Try Pro
                    <SquareArrowUpRight className="ml-1 w-4 h-4" />
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-white border-2 border-zinc-700">
                  <DialogTitle>
                    <div className="flex justify-center items-center pt-9 pb-3">
                      <div className="text-xl flex items-center gap-3">
                        <h1 className="text-black text-5xl font-bold">Boundless</h1>
                        <div className="bg-indigo-600 text-[20px] mb-4 text-white px-2 py-[1px] rounded">Pro</div>
                      </div>
                    </div>
                  </DialogTitle>
                  <DialogDescription>
                    <div className="text-[13px] flex items-center justify-center">
                      <p>
                        A collection of features that we will add to Boundless Pro in the near future. 
                      </p>
                    </div>
                  </DialogDescription>
                  <div className="flex justify-center items-center mx-4 my-4">
                    <div className="grid gap-x-10 gap-y-10 grid-cols-2">
                      <div className="">
                        <div className="flex items-center gap-2">
                          <Cpu className="w-5 h-5" />
                          <h1 className="font-bold text-lg">Better AI Models</h1>
                        </div>
                        <div className="mt-2">
                          <p className="text-[13px]">
                            Our <span className="font-bold">Turbo</span> model would use <a href="groq.com" className="hover:underline text-indigo-600">Groq's</a> LPU inference to give you results faster than the page even loads! Perfect for users who want to click through Boundless and find things visually.
                          </p>
                          <p className="text-[13px] mt-2">
                            Our <span className="font-bold">Research</span> model would be a combination of Anthropic's <a href="https://www.anthropic.com/claude" className="hover:underline text-indigo-600">Claude 3 Opus</a> and Open AI's <a href="https://openai.com/index/hello-gpt-4o/" className="hover:underline text-indigo-600">GPT 4o</a> to give you more accurate and thorough, research grade results.
                          </p>
                        </div>
                      </div>
                      <div className="">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-5 h-5" />
                          <h1 className="font-bold text-lg">Learn Faster</h1>
                        </div>
                        <div className="mt-2">
                          <p className="text-[13px]">
                            Start with our <span className="font-bold">Turbo</span> model to get a quick glance, then use our <span className="font-bold">Research</span> model to gain a deeper understanding. Switch between the two at any time.
                          </p>
                        </div>
                      </div>
                      <div className="">
                      <div className="flex items-center gap-2">
                          <Wifi className="w-5 h-5" />
                          <h1 className="font-bold text-lg">Internet Access</h1>
                        </div>
                        <div className="mt-2">
                          <p className="text-[13px]">
                            Both of our pro models will use RAG to retrieve web results, providing you with the most accurate and relevant results. Summaries will have their sources cited.
                          </p>
                        </div>
                      </div>
                      <div className="">
                        <div className="flex items-center gap-2">
                            <FileQuestionIcon className="w-5 h-5" />
                            <h1 className="font-bold text-lg">Interested?</h1>
                          </div>
                          <div className="mt-2">
                            <p className="text-[13px]">
                              Let us know if you want this by answering yes on this <a href="https://forms.gle/Xx7QMpTQWSrJWvgZ6" className="hover:underline text-indigo-600">Google Form</a>. It will take <span className="font-bold"> less than 10 seconds.</span>
                            </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <div className="flex gap-2 mr-14 bg-zinc-100 p-1.5 rounded border border-zinc-500">
                <UserButton appearance={userButtonAppearance} afterSignOutUrl="/" />
                <div onClick={() => setIsHistoryOpen(!isHistoryOpen)} role="button" className="flex justify-center items-center">
                  <div className="text-xs">History</div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isHistoryOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </div>
            </SignedIn>
          </nav>
        </div>
      </div>
      <History isOpen={isHistoryOpen} setIsOpen={setIsHistoryOpen} />
    </AnimatePresence>
  );
};

export default Header;

