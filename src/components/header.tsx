"use client"
import React, {useState, useEffect} from "react";
import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, UserButton} from "@clerk/nextjs";
import { BackgroundBeams } from "./background-beams";
import { Matrix } from "./dotMatrix";
import { AnimatePresence} from "framer-motion";
import { ArrowUpRight, SquareArrowUpRight } from "lucide-react";



const Header = () => {

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
              <button className="bg-indigo-600 flex justify-center items-center w-21 font-bold px-4 py-1 rounded hover:bg-indigo-500 transition-all mt-4 text-xs underline text-white">
                Try Pro
                <SquareArrowUpRight className="ml-1 w-4 h-4" />
              </button>
              <SignInButton mode="modal">
                <button className="bg-indigo-600 text-white w-22 font-bold px-4 text-xs py-1 rounded hover:bg-indigo-500 transition-all mr-14 mt-4">Log in</button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <button className="bg-indigo-600 flex justify-center items-center mb-5 mr-3 font-bold px-4 py-1 rounded hover:bg-indigo-500 transition-all mt-4 text-xs underline text-white">
                Try Pro
                <SquareArrowUpRight className="ml-1 w-4 h-4" />
              </button>
              <div className="mr-14">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </nav>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default Header;

