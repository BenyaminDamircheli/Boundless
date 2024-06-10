import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const POST = async (req: NextRequest, res: NextResponse) => {
    const { query, id, url, userId, nodes } = await req.json();
    const existingWiki = await db.wiki.findUnique({
        where: {
            id: id
        }
    })
    if (existingWiki){
        return NextResponse.json({error: "Wiki already exists"});
    }
    const newWiki = await db.wiki.create({
        data: {
            id: id,
            title: query,
            url: url,
            userId: userId,
            nodes: nodes
        }
    })
    return NextResponse.json("Wiki Created!")
}

