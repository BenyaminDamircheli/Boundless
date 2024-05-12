import React from "react";
import {ArrowLeft, ArrowRight} from "lucide-react"

function NoteHeader({Sidebar}: {Sidebar: boolean}) {
    const titleStyle = Sidebar ? "mr-10" : "mr-60";
  return (
    <div className={`flex ml-2 mr-10 py-1 justify-between sticky top-0 z-[99999999] bg-neutral-950 ${titleStyle} transition-all duration-200 ease-in-out`}>
        <div className="flex gap-2">
            <ArrowLeft role="button" className="w-4 h-4 cursor-pointer"/>
            <ArrowRight role="button" className="w-4 h-4 cursor-pointer"/>
        </div>
        <div className="">
            <p className=" font-bold">Transformers and Neural Networks</p>
        </div>
        <div>
            <p className="font-bold">2024-02-09</p>
        </div>
    </div>
  );
}

export default NoteHeader;

