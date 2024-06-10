import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";




export async function GET(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get('userId');
    const history = await db.wiki.findMany({ 
        where: { userId: userId as string },
        orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(history);
}

