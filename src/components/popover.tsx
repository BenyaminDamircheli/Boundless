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
    <div>
        <h1>Popover</h1>
    </div>
  );
}

