import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { useAuth } from "@clerk/nextjs";
import { stringify } from "querystring";

export async function POST(req: NextRequest) {
    try {
      const { title, userId, name} = await req.json();

      const existingUser = await db.user.findUnique({
        where: {
          id: userId
        }
      });
      if (existingUser){
        const flow = await db.reactFlow.create({
            data: {
              title,
              userId,
              flow: {}
            }
        });
        console.log(flow);
        return NextResponse.json({ message: "Flow created successfully", flow }, { status: 200 });
      }
      const newUser = await db.user.create({
        data: {
          name,
          id: userId
        }
      });

      const flow = await db.reactFlow.create({
        data: {
          title,
          userId,
          flow: { id: "1", position: { x: 0, y: 0 }, data: { title: 'New Note', status: "In Progress", duedate: "2024-01-01" }, type: 'customNode', isHovered: false, isSelected: false },
          nodes: [],
          edges: []
        }
    });
    return NextResponse.json({ message: "Flow and User created successfully", flow, nodes: flow.nodes, edges: flow.edges}, { status: 200 });

    } catch (error) {
      console.error("Failed to create flow:", error);
      return NextResponse.json({ message: "Failed to create flow", error: (error as Error).message }, { status: 500 });
    }
  }

  export async function GET(req: NextRequest) {
    try {
        const flowId = parseInt(req.nextUrl.searchParams.get('id') || '', 10);
        console.log("Received flowId:", flowId); 

        if (flowId) {
            const flow = await db.reactFlow.findUnique({
                where: {
                    id: parseInt(req.nextUrl.searchParams.get('id') || '', 10)
                }
            });
            console.log("Queried flow:", flow); 
            return flow ? NextResponse.json({ flow, edges: flow.edges, nodes: flow.nodes }, { status: 200 }) : NextResponse.json({ message: "Flow not found" }, { status: 404 });
        } else {
            const flows = await db.reactFlow.findMany({
                where: {
                    userId: req.nextUrl.searchParams.get('userId') as string
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            console.log("Queried all flows:", flows); 
            return NextResponse.json({ flows }, { status: 200 });
        }
    } catch (error) {
        console.error("Failed to fetch flows:", error);
        return NextResponse.json({ message: "Failed to fetch flows", error: (error as Error).message }, { status: 500 });
    }
}