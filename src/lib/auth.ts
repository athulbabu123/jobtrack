import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

export async function generatePasswordHash(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: string): string {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
    );
}

export function verifyToken(token: string): { userId: string } | null {
    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        );

        if (
            typeof decoded === "object" &&
            decoded !== null &&
            "userId" in decoded &&
            typeof decoded.userId === "string"
        ) {
            return { userId: decoded.userId };
        }

        return null;
    } catch {
        return null;
    }
}

export async function getCurrentUser() {
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) {
        return null;
    }

    const payload = verifyToken(token);

    if (!payload) {
        return null;
    }

    const user = await prisma.user.findUnique({
        where: {
            id: payload.userId,
        },
        select: {
            id: true,
            name: true,
            email: true,
        }
    });

    return user;
}