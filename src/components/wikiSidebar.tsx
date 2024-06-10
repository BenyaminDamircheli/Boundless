import { ArrowLeftFromLine, ArrowRightFromLine, ChevronDown } from "lucide-react";
import React, { useState, useEffect } from "react";
import { TracingBeam } from "./ui/tracingBeam";

export default function WikiSidebar({ Nodes, query }: { Nodes:any, query: string}) {
  const [nodes, setNodes] = useState(Nodes);
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    setNodes(Nodes);
  }, [Nodes]);

  function toggleCollapse(nodeId: string) {
    setCollapsedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }

  function handleItemClick(nodeId: string) {
    const element = document.getElementById(`node-${nodeId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('focused');
      setTimeout(() => element.classList.remove('focused'), 3000); 
    }
  }

  function generateTOC(nodes: any) {
    const nodeMap = new Map();
    
    nodes.forEach((node: any) => {
      if (node && node.id) {
        nodeMap.set(node.id, node);
      }
    });

    const buildNestedDivs = (node: any, level: number) => {
      if (!node || !node.id) return null;

      const isCollapsed = collapsedNodes.has(node.id);
      const hasSubconcept = nodes.some((childNode: any) => childNode?.data.parentNode === node.id);

      return (
        <div key={node.id} className={`flex flex-col mt-4`}>
          <div className="flex flex-row items-center" style={{paddingLeft: `${level * 20}px`}}>
            <div role="button" tabIndex={0} className="hover:bg-neutral-200 rounded" onClick={() => toggleCollapse(node.id)}>
              {hasSubconcept && (
                <ChevronDown className={`transition-transform ${isCollapsed ? 'rotate-90' : ''} w-4 h-4`} />
              )}
            </div>
            <a onClick={() => handleItemClick(node.id)} className={`text-neutral-800 hover:underline cursor-pointer text-xs ${hasSubconcept ? 'font-bold' : ''}`}>{node.data.title}</a>
          </div>
          {!isCollapsed && (
            <div>
              {nodes
                .filter((childNode: any) => childNode?.data?.parentNode === node.id)
                .map((childNode: any) => buildNestedDivs(childNode, level + 1))}
            </div>
          )}
        </div>
      );
    };

    return nodes
      .filter((node: any) => !node?.data.parentNode)
      .map((node: any) => buildNestedDivs(node, 0));
  }

  return (
    <aside className={`w-[250px] sticky top-0 h-full bg-none transform transition-transform pb-8 duration-100`}>
      <div className="flex flex-row sticky top-2 transition-all ">
        <div className="border-l border-neutral-300 border-[1px]"/>
        <div className="px-3 text-sm text-neutral-800 max-w-64">
          <div className="flex flex-row justify-between items-center gap-8">
            <h1 className="font-bold text-[0.9rem] text-neutral-800 truncate overflow-ellipsis whitespace-nowrap">{query}</h1>
          </div>
          {/* TOC Format Start */}
          <div className="flex flex-col mt-2">
            {generateTOC(nodes)}
          </div>
          {/* TOC Format End */}
        </div>
      </div>
    </aside>
  );
}