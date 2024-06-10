import React, { useEffect, useState } from "react";
import MainWiki from "./mainwiki";
import { TracingBeam } from "./ui/tracingBeam";




const Wiki = ({ isSidebarOpen, initialNodes, quickAnswer }: { isSidebarOpen: boolean, initialNodes: any, quickAnswer: string }) => {

    return (
        <div id="main-wiki" className={`flex flex-col ml-10 w-full `}>
            <div className="relative text-sm mb-10 mt-4 flex-grow bg-white border border-gray-200 rounded p-5 max-h-[170px]">
                <p className="absolute text-[0.8rem] top-1 left-2 text-neutral-500 font-medium">quick summary</p>
                <p className="antialiased mt-4">{quickAnswer}</p>
            </div>
                <MainWiki nodes={initialNodes} />
        </div>
    );
    };
export default Wiki;

