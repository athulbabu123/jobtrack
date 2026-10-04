import {NextResponse} from "next/server";
import {z} from "zod";
import { prisma } from "@/lib/prisma";
import { comparePassword, generateToken } from "@/lib/auth";
import { cookies } from "next/headers";


const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
})

export async function POST(request: Request){
    try{
        const body = await request.json();

        const result = loginSchema.safeParse(body);

        if(!result.success){
            return NextResponse.json(
                {
                    error: "Invalid request data",
                    details: result.error.issues.map((issue) => issue.message),
                },
                {status: 400}
            );
        }

        const { email, password } = result.data;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if(!user){
            return NextResponse.json(
                {error: "Invalid email or password"},
                {status: 401}
            );
        }

        const isPasswordValid = await comparePassword(
            password,
            user.passwordHash
        );

        if(!isPasswordValid){
            return NextResponse.json(
                {error: "Invalid email or password"},
                {status: 401}
            );
        }

        const token = generateToken(user.id);

        const cookieStore = await cookies();

        cookieStore.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        return NextResponse.json(
            {message: "Login successful"},
            {status: 200}
        );
    }
    catch(error){
        console.error(error);
        return NextResponse.json(
            {error: "Failed to login"},
            {status: 500}
        );
    }
}