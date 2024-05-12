"use client";
import NoteEditor from "@/components/blocknote/editor";
import React from "react";
import Navbar1 from "@/components/sidebar";
import NoteHeader from "@/components/noteHeader";
import { useState } from "react";



function NoteEditorPage() {
    const [isOpen, setIsOpen] = useState(true);
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };


  return (
    <>
    <div className="flex">
      <div className="h-[calc(100vh+6rem)] sticky top-0">
        <Navbar1 isOpen={isOpen} setIsOpen={toggleSidebar}/>
      </div>
      <div className="flex-grow">
      <div className="w-full mt-4 sticky top-0 mr-10 z-[99999999]">
        <NoteHeader Sidebar={isOpen}/>
      </div>
      <div className="flex-grow mt-8">
        <NoteEditor Sidebar={isOpen}/>
        </div>
    </div>
    </div>
    </>
  )
}

export default NoteEditorPage;


