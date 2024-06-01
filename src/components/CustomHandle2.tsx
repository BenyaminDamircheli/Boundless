import React from "react";
import { Handle, HandleProps } from "reactflow";

function CustomHandle2(props: HandleProps) {
    return (
        <div className="ml-2">
            <Handle {...props} className={`!bg-white !rounded-full !w-[60px] !h-[30px] !border-black !border-3 z-[999999]`} />
        </div>
    );
}

export default CustomHandle2;
