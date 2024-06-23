import { Download, Network, Search, X } from "lucide-react";
import { Input } from "./ui/input";
import { useSearchParams, useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import { useState } from "react";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export default function WikiSearch() {
    const [inputValue, setInputValue] = useState('');
    const searchParams = useSearchParams();
    const search = searchParams.get('q');
    const query = searchParams.getAll('search_context');
    const id = searchParams.get('id');
    const router = useRouter();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const onRemoveContext = (q: string) => {
        const filteredContext = query.filter((context) => context !== q);
        const updatedSearchContext = filteredContext.map(encodeURIComponent).join('&search_context=');
        const newUrl = `/wiki?q=${search}&search_context=${updatedSearchContext}&id=${id}`;
        router.push(newUrl);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const searchQuery = inputValue.trim();
        const searchQueryCap = Capitalize(searchQuery);
        setInputValue('');
        if (searchQuery) {
            const searchParams = new URLSearchParams(window.location.search);
            const existingSearchContexts = searchParams.getAll('search_context');
            const updatedSearchContexts = [...existingSearchContexts, searchQueryCap];
            const searchId = uuidv4();
            const newUrl = `/wiki?q=${encodeURIComponent(searchQueryCap)}&search_context=${updatedSearchContexts.map(encodeURIComponent).join('&search_context=')}&id=${searchId}`;
            router.push(newUrl);
        }
    };

    function Capitalize(str: string) {
        return str.replace(/\b\w/g, (l) => l.toUpperCase());
    }

    const onExport = async () => {
        const mainWikiElement = document.getElementById('main-wiki');
        if (mainWikiElement) {
            const canvas = await html2canvas(mainWikiElement, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgProps = pdf.getImageProperties(imgData);
            const imgWidth = pdfWidth;
            const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            pdf.save('main-wiki.pdf');
        }
    };

    const onClearContext = () => {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.delete('search_context');
        const newUrl = `/wiki?${searchParams.toString()}`;
        router.refresh();
        router.push(newUrl);
    };

    return (
        <div className="flex justify-between items-center mr-14">
            <div className="flex flex-col items-center mx-14 mt-6 bg-white">
                <div className="flex items-center space-x-2">
                    <div className="flex justify-between items-center space-x-14">
                        <div className="flex flex-col items-center">
                            <p className="text-xs">Find what you want to learn quickly</p>
                        </div>
                        <div className="flex items-center">
                            <button type="button" className="text-white border-t-2 border-l-2 border-neutral-700 rounded-l px-1 py-0.5 bg-indigo-600 active:bg-neutral-300 text-sm">Default</button>
                            <HoverCard>
                                <HoverCardTrigger>
                                    <button type="button" className="text-black border-t-2 border-l-2 border-neutral-700 px-1 py-0.5 hover:bg-neutral-200 active:bg-neutral-300 flex items-center justify-center gap-1 text-sm">
                                        <div className="bg-indigo-700 text-white rounded px-1 text-xs font-bold">Pro</div>
                                        Turbo
                                    </button>
                                </HoverCardTrigger>
                                <HoverCardContent className="bg-neutral-800 text-white rounded px-2 py-1 text-xs w-[200px]">
                                    <p className="text-xs font-bold underline">Turbo</p>
                                    <div className="mt-2 flex-col space-y-2">
                                        <p className="text-[10px]">Turbo is <span className="font-bold">3x</span> smarter and <span className="font-bold">5x</span> faster than our default model.</p>
                                    </div>
                                    <p className="text-[8px] mt-2 italic">Currently unavailable, but let us know if you want this!</p>
                                </HoverCardContent>
                            </HoverCard>
                            <HoverCard>
                                <HoverCardTrigger>
                                    <button type="button" className="text-black border-t-2 border-l-2 border-r-2 rounded-r border-neutral-700 px-1 py-0.5 hover:bg-neutral-200 active:bg-neutral-300 flex items-center justify-center gap-1 text-sm">
                                        <div className="bg-indigo-700 text-white rounded px-1 text-xs font-bold">Pro</div>
                                        Research
                                    </button>
                                </HoverCardTrigger>
                                <HoverCardContent className="bg-neutral-800 text-white rounded px-2 py-1 text-xs w-[200px]">
                                    <p className="text-xs font-bold underline">Research</p>
                                    <div className="mt-2 flex-col space-y-2">
                                        <p className="text-[10px]">Research is <span className="font-bold">5x</span> smarter than our default model.</p>
                                    </div>
                                    <p className="text-[8px] mt-2 italic">Currently unavailable, but let us know if you want this!</p>
                                </HoverCardContent>
                            </HoverCard>
                        </div>
                    </div>
                </div>
                <form action="" className="flex items-center space-x-2" onSubmit={handleSubmit}>
                    <div className="relative w-[500px]">
                        <Input placeholder="I want to learn about..." className="rounded h-10 border-2 w-full pr-16 font-bold placeholder:text-gray-500" onChange={handleInputChange} value={inputValue}/>
                        <button type="submit" className="absolute right-4 top-0 h-full flex items-center justify-center"><Search className="h-4 w-4" /></button>
                    </div>
                </form>
            </div>
            <div className="flex flex-col justify-start items-center mt-6">
                <p className="text-xs font-medium antialiased">Search Context</p>
                <div className="flex flex-row justify-start mt-3 items-center gap-2 overflow-x-auto no-scrollbar fade-edges w-[500px] border-[1px] border-neutral-300 min-h-[40px] rounded">
                    {query.length > 1 && query.map((q, index) => (
                        <div className="flex flex-row my-1" key={index}>
                            <div className="mx-3 min-w-[100px] text-center flex justify-between items-center gap-2 p-1 rounded bg-neutral-200 truncate">
                                <p className="text-xs ml-1">{q}</p>
                                <button onClick={() => onRemoveContext(q)}><X className="w-3 h-3 mr-1"/></button>
                            </div>
                        </div>
                    ))}
                    {query.length === 1 && query.map((q, index) => (
                        <div className="flex flex-row my-1" key={index}>
                            <div className="mx-3 min-w-[100px] text-center flex justify-between items-center gap-2 p-1 rounded bg-neutral-200 truncate">
                                <p className="text-xs ml-1">{q}</p>
                                <button onClick={() => onClearContext()}><X className="w-3 h-3 mr-1"/></button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end w-full">
                    <button onClick={onClearContext} className="text-xs text-neutral-500"><span className="text-xs text-neutral-500 hover:underline">clear context</span></button>
                </div>
            </div>
            <div role="button" onClick={onExport} className="flex justify-between items-center bg-indigo-600 hover:bg-indigo-500 gap-2 rounded text-white p-2 text-xs antialiased font-bold mt-6">
                <Download className="w-3 h-3"/>
                Export
            </div>
        </div>
    )
}