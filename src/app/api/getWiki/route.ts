import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/db';

export const GET = async (req: NextRequest) => {
    const id = await req.nextUrl.searchParams.get('id');
    
    const response = await db.wiki.findFirst({
        where: {
            id: id!
        }
    });

    if (!response) {
        return NextResponse.json({ message: "No data found" }, { status: 404 });
    }

    return NextResponse.json(response, { status: 200 });
};
