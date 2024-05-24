"use client"
import { useParams, useRouter } from "next/navigation"
import Item from "./space"
import { ReactFlow } from "@prisma/client"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Box, StickyNoteIcon } from "lucide-react"
import { useAuth } from "@clerk/nextjs";

interface ItemListProps {
    userId?: string
    level?: number
    data?: ReactFlow["title"][] 
}

const ItemList = ({ userId, level = 0 }: ItemListProps) => {
    const params = useParams();
    const router = useRouter();

    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [flows, setFlows] = useState<ReactFlow[]>([])

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getFlows = async () => {
            try {
                const response = await fetch(`/api/Flows?userId=${userId}`);
                const data = await response.json();
                if (data.flows) {
                    setFlows(data.flows);
                } else {
                    setFlows([]); // Set to an empty array if data.flows is undefined
                }
            } catch (error) {
                console.error("Failed to fetch flows:", error);
                setFlows([]); // Set to an empty array in case of error
            } finally {
                setIsLoading(false);
            }
        };
        getFlows();
    }, [userId]);

    const onRedirect = (id: ReactFlow["id"]) => {
        router.push(`/editor/${id}?id=${id}`);
    };

    if (isLoading) {
        return <Item.Skeleton />;
    }

    return (
        <>
            {flows.map(flow => (
                <div key={flow.id}>
                    <Item type="flow" id={flow.id} label={flow.title} onClick={() => onRedirect(flow.id)} icon={Box}
                        active={Number(params.id) === flow.id} level={level} />
                </div>
            ))}
        </>
    );
};

export default ItemList;