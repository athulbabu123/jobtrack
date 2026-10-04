import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    try {
        const cookieStore = await cookies();

        cookieStore.delete("token");

        return NextResponse.json(
            { message: "Logout successful" },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Failed to logout" },
            { status: 500 }
        );
    }
}