import React, { useState } from "react";
import { ChevronsLeft, ChevronsRight, SquareMenu, Plus, Box, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { ReactFlow } from "@prisma/client";
import Item from "./space";

function Navbar1({isOpen, setIsOpen, flows}: {isOpen: boolean, setIsOpen: (isOpen: boolean) => void, flows: ReactFlow[]}){
    const router = useRouter();
    const handleFlowClick = (id: number) => {
        router.push(`/editor/${id}`);
    }

    function onMouseDown(e: React.MouseEvent<HTMLDivElement, MouseEvent>){
        e.preventDefault();
        e.stopPropagation();
    }
    

    const style = isOpen ? 'h-6 w-6 text-muted-foreground rounded hover:bg-neutral-700 top-3 right-3 cursor-pointer absolute' : 'h-6 w-6 text-muted-foreground rounded hover:bg-neutral-700 top-3 right-3 cursor-pointer fixed';

    const sidebarStyle = isOpen ? 'translate-x-0' : '-translate-x-[200px] bg-opacity-0 transition-all duration-300 ease-in-out ml-3';
    const { user } = useUser();
    return(
        <aside className={`bg-neutral-900 h-full w-60 overflow-hidden z-[0] relative transition-all duration-4500 ease-in-out ${sidebarStyle}`}>
            <div className="flex mt-3 ml-4">
            <div
            role="button"
            className={style}
            onClick={() => setIsOpen(!isOpen)}
            >
                <SquareMenu className={`h-6 w-6 `}/>
            </div>
            <UserButton />
            <p className="text-white ml-2 text-xs font-bold flex items-center">Welcome {user?.firstName}</p>
            </div>
            <div className={`${isOpen ? 'block' : 'hidden'} mt-10 ml-4 mr-4`}>
                <Link href="/editor">
                   <button className="text-white font-bold bg-indigo-600 p-2 rounded w-full flex justify-center items-center gap-2 hover:bg-indigo-500 transition-all duration-300 ease-in-out"><PlusCircle className="h-5 w-5" /> New Space</button>
                </Link>
            </div>
            <div className={`mt-4 ml-4 ${isOpen ? 'block' : 'hidden'}`}>
                <p className="text-white font-bold flex items-center gap-2">Spaces</p>
                {flows.map((flow) => (
                    <Item key={flow.id} onClick={() => {handleFlowClick(flow.id)}} label={flow.title} type="flow" icon={Box}/>
                ))}
            </div>
        </aside>
    )
}

export default Navbar1;







