import React from "react";
import { Handle, HandleProps } from "reactflow";

interface CustomHandleProps extends HandleProps {
    isHovered: boolean;
    
}
function CustomHandle(props: CustomHandleProps) {
    if (props.isHovered) {
        return <div className="ml-2"><Handle {...props} className={`!bg-white !rounded-full !w-[40px] !h-[12px] !border-black !border-3 z-[999999]`}/></div>
    } else {
        return <div className="ml-2"><Handle {...props} className={`!bg-white !rounded-full !w-[40px] !h-[12px] !border-black !border-3 !opacity-0 transition-opacity duration-300 z-[999999]`}/></div>
    }
}

export default CustomHandle;



