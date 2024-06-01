import { Network, Search, X } from "lucide-react";
import { Input } from "./ui/input";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import { useState } from "react";
import { revalidatePath } from "next/cache";


export default function WikiSearch(){
    const [inputValue, setInputValue] = useState('');
    const searchParams = useSearchParams();
    const query = searchParams.getAll('search_context');
    const router = useRouter();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const searchQuery = inputValue.trim();
        setInputValue('');
        if (searchQuery) {
            const searchParams = new URLSearchParams(window.location.search);
            const existingSearchContexts = searchParams.getAll('search_context');
            const updatedSearchContexts = [...existingSearchContexts, searchQuery];
            const searchId = uuidv4(); // Using UUID as a unique search ID
            const newUrl = `/wiki?q=${encodeURIComponent(searchQuery)}&search_context=${updatedSearchContexts.map(encodeURIComponent).join('&search_context=')}&id=${searchId}`;
            router.push(newUrl);
            
           
        }
    };

    const onClearContext = () => {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.delete('search_context');
        const newUrl = `/wiki?${searchParams.toString()}`;
        router.refresh();
        router.push(newUrl);
    };
    return(
        <div className="flex justify-between items-center mr-14">
            <div className="flex flex-col items-center mx-14 mt-6 bg-white">
                <div className="flex items-center space-x-2">
                    <div className="flex justify-between items-center space-x-14">
                        <div className="flex flex-col items-center">
                            <p className="text-xs">Find what you want to learn quickly</p>
                        </div>
                        <div className="flex items-center">
                            <button type="button" className="text-black border-t-2 border-l-2 border-neutral-700 rounded-l px-1 py-0.5 hover:bg-neutral-200 active:bg-neutral-300 text-sm">Default</button>
                            <button type="button" className="text-black border-t-2 border-l-2 border-neutral-700 px-1 py-0.5 hover:bg-neutral-200 active:bg-neutral-300 flex items-center justify-center gap-1 text-sm">
                                <div className="bg-indigo-700 text-white rounded px-1 text-xs font-bold">Pro</div>
                                Turbo
                            </button>
                            <button type="button" className="text-black border-t-2 border-l-2 border-r-2 border-neutral-700 rounded-r px-1 py-0.5 hover:bg-neutral-200 active:bg-neutral-300 flex items-center justify-center gap-1 text-sm">
                                <div className="bg-indigo-700 text-white rounded px-1 text-xs font-bold">Pro</div>
                                Research
                            </button>
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
                    {query.map((q, index) => (
                        <div className="flex flex-row my-1" key={index}>
                            <div className="mx-3 min-w-[100px] text-center text-xs p-1 rounded bg-neutral-200">{q}</div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end w-full">
                    <button onClick={onClearContext} className="text-xs text-neutral-500"><span className="text-xs text-neutral-500 hover:underline">clear context</span></button>
                </div>
            </div>
            <div role="button" className="flex justify-between items-center bg-indigo-700 hover:bg-indigo-600 gap-2 rounded text-white p-2 text-xs antialiased font-bold mt-6">
                <Network className="w-3 h-3"/>
                graph view
            </div>
        </div>
    )
}