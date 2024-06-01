import { ChevronDown, Info } from "lucide-react";
import React, { useEffect, useState } from "react";
import { TracingBeam } from "./ui/tracingBeam";
import Popover from "./popover";
export default function MainWiki({ nodes }: { nodes: any[] }) {

  const generateMainWiki = (nodes: any[]) => {
    const [collapsedNodes, setCollapsedNodes] = useState(new Set());
    const [displayedNodes, setDisplayedNodes] = useState(nodes);

    useEffect(() => {
        setDisplayedNodes(nodes);
    }, [nodes]);

    const toggleCollapsed = (nodeId: string) => {
        setCollapsedNodes((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(nodeId)) {
                newSet.delete(nodeId);
            } else {
                newSet.add(nodeId);
            }
            return newSet;
        });
    }
    const renderNodes = (parentNodeId: string | null, level: number) => {
      return nodes
        .filter((node) => node.data.parentNode === parentNodeId || parentNodeId === null && !node.data.parentNode)
        .map((node) => {
          const hasChildren = nodes.some((childNode) => childNode.data.parentNode === node.id);
          if (!hasChildren) {
            return (
              <div key={node.id} style={{ minWidth: '250px', maxWidth: '400px', minHeight: '250px', maxHeight: '400px', marginTop: '0.5rem', marginLeft: '1.25rem', marginRight: '1.25rem' }} className="scroll-p-64 scroll-m-64 outline-offset-4 target:outline target:outline-4 target:outline-indigo-500 bg-white transition-all duration-75 rounded-[2px] flex flex-col ">
                <div className="flex flex-col justify-between items-start">
                  <button className="transition-all duration-100 text-[0.8rem] font-medium pb-0.5 whitespace-pre-wrap pl-1 leading-[0.95] text-start text-black group">
                    <span className="text-indigo-700 underline hidden group-hover:inline">deeper search on: </span>
                    <span className="fade-in">{node.data.title}<span className=" hidden group-hover:inline">?</span></span>
                  </button>
                  <div className="border-t-[1.5px] transition-all duration-100 border-black shadow-md mt-2">
                    <div className="flex flex-row justify-center flex-wrap pt-[0.15rem] border-b border-x border-neutral-100 rounded-b-[2px] bg-white">
                      <Popover title={node.data.title}/>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
          return (
            <div key={node.id} className="bg-white relative w-fit h-fit mb-4 border shadow-sm rounded-[3px] mx-2">
              <div style={{ top: 0, zIndex: 18 - level }} className="scroll-p-32 scroll-m-32 outline-offset-4 target:outline target:outline-4 target:outline-indigo-500 sticky transition-colors duration-100 border-b-[1.5px] bg-zinc-100 border-neutral-200 flex flex-col w-full">
                <div className="flex flex-row items-end justify-between gap-1">
                  <div className="flex flex-row items-center gap-1">
                    <button className="group">
                      <span className="text-indigo-700 text-[0.8rem] pl-2 underline hidden group-hover:inline">deeper search on:</span>
                      <span className={`mt-0.5 text-start text-[0.8rem] pl-2 fade-in ${collapsedNodes.has(node.id) ? 'font-bold' : 'font-normal'}`}>{node.data.title} <span className="hidden group-hover:inline">?</span></span>
                    </button>
                    <button onClick={() => toggleCollapsed(node.id)} className="hover:bg-neutral-200 rounded">
                      <ChevronDown className="w-4 h-4 text-neutral-500" />
                    </button>
                  </div>
                  <button className="mr-2 my-1">
                    <Info className="text-neutral-600 w-[14px] h-[14px] font-bold" />
                  </button>
                </div>
              </div>
              {!collapsedNodes.has(node.id) && hasChildren && (
                <div className="relative border-neutral-400 bg-white">
                  <div className="relative py-3 px-2 w-full flex flex-row flex-wrap flex-grow justify-start rounded-bl-[4px]">
                    {renderNodes(node.id, level + 1)}
                  </div>
                </div>
              )}
            </div>
          );
        });
    };

    return renderNodes(null, 0);
  };

  return (<>
    {generateMainWiki(nodes)}
  </>);
}