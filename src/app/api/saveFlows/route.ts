// For a feature I am working on that I may add in the future. Not complete.
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import Dagre from "@dagrejs/dagre"
import { Position } from 'reactflow';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { nodes, edges, id, quickAnswer } = body;

        const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
        const getLayoutedElements = (
            nodes: { id: string; position: { x: number; y: number }; data: any; type?: string }[],
            edges: { source: string; target: string }[],
        ) => {
            console.log('Nodes before layout:', nodes);
            console.log('Edges before layout:', edges);
            g.setGraph({ rankdir: "BT", nodesep: 400, ranksep: 600 });

            edges.forEach((edge) => g.setEdge(edge.source, edge.target));
            nodes.forEach((node) => {
                if (node.type === 'noteNode') {
                    g.setNode(node.id, { width: 1000, height: 8000, ranksep: 0, nodesep: 0 });
                } else if (node.type === 'customNode') {
                    g.setNode(node.id, { width: 2700, height: 800 });
                } else if (node.type === 'subConceptNode') {
                    g.setNode(node.id, { width: 1000, height: 900 });
                } else {
                    g.setNode(node.id, { width: 1000, height: 900 });
                }
            });

            Dagre.layout(g);
            console.log('Graph after layout:', g);

            return {
                nodes: nodes.map((node) => {
                    const { x, y } = g.node(node.id);
                    console.log(`Node ${node.id} position:`, { x, y });
                    return { ...node, position: { x, y } };
                }),
                edges: edges.map((edge, index) => ({
                    ...edge,
                    id: `e${edge.source}-${edge.target}-${index}`,
                })),
            };
        };

        if (!id || !nodes || !edges) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const flow = await db.reactFlow.update({
            where: { id: parseInt(id.toString(), 10) },
            data: { nodes: getLayoutedElements(nodes, edges).nodes, edges: getLayoutedElements(nodes, edges).edges, quickAnswer: quickAnswer }
        });

        return NextResponse.json({ message: "Flow updated successfully", flow }, { status: 200 });
    } catch (error) {
        console.error("Failed to save flow:", error);
        return NextResponse.json({ message: "Failed to save flow", error: (error as Error).message }, { status: 500 });
    }
}

