import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
      const { title, userId, name } = await req.json();

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
              flow: { id: "1", position: { x: 0, y: 0 }, data: { title: 'New Note', status: "In Progress", duedate: "2024-01-01" }, type: 'customNode', isHovered: false, isSelected: false }
            }
        });
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
          flow: { id: "1", position: { x: 0, y: 0 }, data: { title: 'New Note', status: "In Progress", duedate: "2024-01-01" }, type: 'customNode', isHovered: false, isSelected: false }
        }
    });
    return NextResponse.json({ message: "Flow and User created successfully", flow }, { status: 200 });

    } catch (error) {
      console.error("Failed to create flow:", error);
      return NextResponse.json({ message: "Failed to create flow", error: error.message }, { status: 500 });
    }
  }

export async function GET(req: NextRequest){
    const flowId = req.nextUrl.searchParams.get('id');
    if(flowId){
        const flow = await db.reactFlow.findUnique({
            where: {
                id: Number(flowId)
            }
        });
        return flow ? NextResponse.json({ flow }, { status: 200 }) : NextResponse.json({ message: "Flow not found" }, { status: 404 });
    } else {
        const flows = await db.reactFlow.findMany({});
        return NextResponse.json({ flows }, { status: 200 });
    }
}

