import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Popover({title, isPopoverOpen}: { title: string, isPopoverOpen: boolean }) {
    const [images, setImages] = useState("")
    const [resources, setResources] = useState([])
    const [hasFetched, setHasFetched] = useState(false)
    const [quickSummary, setQuickSummary] = useState("")
    const boundless = "-... --- ..- -. -.. .-.. . ... ..."
    const searchParams = useSearchParams()

    // useEffect(() => {
    //     const context = searchParams.get("q")
    //     async function getImages() {
    //         const response = await fetch("https://google.serper.dev/images", {
    //             method: "POST",
    //             headers: {
    //                 'X-API-KEY': 'e3520e4d7978ea9e2236226351fce38eef0943a1',
    //                 "Content-Type": "application/json"
    //             },
    //             body: JSON.stringify({
    //                 q: `${title} in ${context}`
    //             })
    //         })
    //         const data = await response.json()
    //         setImages(data.images[0].imageUrl)
    //         
    //     }
    //     if (!hasFetched) {
    //         getImages()
    //         setHasFetched(true)
    //     }
    // }, [hasFetched, window.location])

  return (
    <Dialog open={isPopoverOpen}>
        <DialogTrigger>
        <div className="h-fit w-fit">
                        
            <img src={images} alt="" className="fade-in" style={{ width: '100%', height: 'auto' }} />
                       
        </div>
        </DialogTrigger>
        <DialogContent className='bg-white text-black rounded w py-2 px-4 border-neutral-300 border-[1px] max-h-[800px] overflow-auto'>
            <DialogHeader>
                <DialogTitle className='text-[30px]'>{title}</DialogTitle>
                <DialogDescription>
                    <button className='text-indigo-500 text-sm italic'>Deeper search on {title}?</button>
                </DialogDescription>
            </DialogHeader>
            <div className='text-black break-words'>
                <p className='text-sm my-1'>{}</p>
            </div>
            <div className='text-indigo-700 break-words'>
                <p className='text-neutral-600 text-xs'>Resources for further learning</p>
                <ul className='text-sm my-1'>
                   <li>hdsaiudhwai</li>
                   <li>iashiudhwihf</li>
                </ul>
            </div>
            <div className="flex flex-row shadow-lg justify-start items-center flex-wrap pt-[0.15rem] border border-neutral-300 rounded bg-white">
                <div className="h-fit w-[550px]">
                    <a href=""><img src={images} alt="" className="" style={{ width: '100%', height: 'auto' }} /></a>
                </div>
            </div>
        </DialogContent>
    </Dialog>
  );
}

