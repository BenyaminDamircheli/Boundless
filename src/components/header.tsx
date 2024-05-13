"use client"
import React, {useState, useEffect} from "react";
import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, UserButton} from "@clerk/nextjs";


const Header = () => {

  return (
    <div className="flex justify-between items-center w-full  mx-auto pt-5">
      <div className="flex items-center ml-14">
        <Link href="/"><Image src="/Cogni.png" alt="Cogni" width={32} height={32} className="border-2 border-indigo-600 rounded p-1" /></Link>
        <h1 className="text-3xl font-bold ml-3"><Link href="/">Boundless</Link></h1>
      </div>
            <nav className="flex justify-end gap-x-3 items-center">
                <SignedOut>
                    <SignInButton mode="modal">
                        <button className="bg-indigo-600 text-white font-bold
                            px-4 py-1 rounded hover:bg-indigo-500 transition-all mr-14 mt-4 text-lg">Log in</button>
                    </SignInButton>
                </SignedOut>
                
                <SignedIn>
                <div className="mr-14">
                    <UserButton 
                    afterSignOutUrl="/"
                    />
                </div>
                </SignedIn>
                
            </nav>
        </div>
  );
};

export default Header;

