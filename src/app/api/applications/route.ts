import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const applicationSchema = z.object({
    company: z.string().min(1, "Company is required"),
    position: z.string().min(1, "Position is required"),
    status: z.enum(
        ["APPLIED", "INTERVIEWING", "OFFERED", "REJECTED"],
        {
            error: "Invalid application status",
        }
    ),
    appliedDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid application date",
    }),
    url: z.string().url("Invalid URL").optional().nullable(),
    location: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
});

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    const applications = await prisma.application.findMany({
        where: {
            userId: user.id,
        },
        orderBy: {
            appliedDate: "desc",
        },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {

    const user = await getCurrentUser();
    if(!user){
        return NextResponse.json(
            {error: "Unauthorized"},
            {status: 401}
        );
    }
    const body = await request.json();
    
    const result = applicationSchema.safeParse(body);

    if (!result.success) {
        return NextResponse.json(
            {
                error: "Invalid application data",
                details: result.error.issues.map(
                    (issue) => issue.message
                ),
            },
            { status: 400 }
        );
    }

    const validatedData = result.data;

    const application = await prisma.application.create({
      data: {
        company: validatedData.company,
        position: validatedData.position,
        status: validatedData.status,
        appliedDate: new Date(validatedData.appliedDate),
        url: validatedData.url || null,
        location: validatedData.location || null,
        notes: validatedData.notes || null,
        userId: user.id,
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}