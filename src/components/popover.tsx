import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Info } from "lucide-react";

export default function Popover({title}: { title: string }) {
  return (
    <Dialog >
        <DialogTrigger>
        <div className="h-fit w-fit">
                        
            <img src="https://www.oist.jp/sites/default/files/photos/20200424-diagram-synaptic-transmission.jpg" alt="" className="fade-in" style={{ width: '100%', height: 'auto' }} />
                       
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
                    <a href=""><img src="https://www.oist.jp/sites/default/files/photos/20200424-diagram-synaptic-transmission.jpg" alt="" className="fade-in" style={{ width: '100%', height: 'auto' }} /></a>
                </div>
            </div>
        </DialogContent>
    </Dialog>
  );
}

