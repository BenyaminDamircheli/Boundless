import React from "react";
import { Handle, HandleProps } from "reactflow";

interface CustomHandleProps extends HandleProps {
    isHovered: boolean;
}
function CustomHandle(props: CustomHandleProps) {
    if (props.isHovered) {
        return <div className="ml-2"><Handle {...props} className='!bg-white !rounded-full !w-[12px] !h-[40px] !border-black !border-3'/></div>
    } else {
        return <div className="ml-2"><Handle {...props} className='!bg-white !rounded-full !w-[12px] !h-[40px] !border-black !border-3 !opacity-0 transition-opacity duration-300'/></div>
    }
}

export default CustomHandle;



