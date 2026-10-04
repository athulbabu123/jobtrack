import {NextResponse} from "next/server";
import {z} from "zod";
import {generatePasswordHash, generateToken} from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

const signupSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});

export async function POST(request: Request){
    try{
        const body = await request.json();
        const result = signupSchema.safeParse(body);

        if(!result.success){
            return NextResponse.json(
                {
                    error: "Invalid request data",
                    details: result.error.issues.map((issue) => issue.message),
                },
                {status: 400}
            );
        }

        
        const {name, email, password} = result.data;
        const existingUser = await prisma.user.findUnique({
            where: {email},
        });
        if(existingUser){
            return NextResponse.json(
                {error: "User with this email already exists"},
                {status: 409}
            );
        }
        const passwordHash = await generatePasswordHash(password);
        
        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
            },
        });

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
            {message: "User created successfully", user:{
                name,email
            }},
            {status: 201}
        );
    }
    catch(error){
        console.error(error);
        return NextResponse.json(
            {error: "Failed to signup"},
            {status: 500}
        );
    }
}