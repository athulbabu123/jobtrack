import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const updateApplicationSchema = z.object({
  company: z.string().optional(),
  position: z.string().optional(),
  status: z.enum([
    "APPLIED",
    "INTERVIEWING",
    "OFFERED",
    "REJECTED",
  ]).optional(),

  appliedDate: z.string().refine(
    (date) => !isNaN(Date.parse(date)),
    "Invalid application date"
  ).optional(),

  url: z.string().url().optional().nullable(),
  location: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: Request,
  { params }: Params
) {
  try {

    const user = await getCurrentUser();

  if (!user) {
      return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
      );
  }
    const { id } = await params;

    const application = await prisma.application.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 }
    );
  }
}

export async function PATCH(
    request: Request,
    { params }: Params
){
    try{

        const user = await getCurrentUser();

        

        if(!user){
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            );
        }

        

        const { id } = await params;
        const existingApplication = await prisma.application.findFirst({
          where: {
              id,
              userId: user.id,
            },
          });

          if (!existingApplication) {
            return NextResponse.json(
              { error: "Application not found" },
              { status: 404 }
            );
        }
        const body = await request.json();


        const result = updateApplicationSchema.safeParse(body);
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

        const appliedDate = validatedData.appliedDate === undefined
        ? undefined
        : new Date(validatedData.appliedDate);



        const application = await prisma.application.update({
          where: { id },
          data: {
            ...(validatedData.company !== undefined ? { company: validatedData.company } : {}),
            ...(validatedData.position !== undefined ? { position: validatedData.position } : {}),
            ...(validatedData.status !== undefined ? { status: validatedData.status } : {}),
            ...(appliedDate ? { appliedDate } : {}),
            ...(validatedData.url !== undefined ? { url: validatedData.url || null } : {}),
            ...(validatedData.location !== undefined ? { location: validatedData.location || null } : {}),
            ...(validatedData.notes !== undefined ? { notes: validatedData.notes || null } : {}),
          },
        });

        return NextResponse.json(
            {application},
            {status: 200}
        );
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Failed to update application" },
            { status: 500 }
        );
    }
}

export async function DELETE(
  request: Request,
  { params }: Params
){
   

    try{
        const user = await getCurrentUser();

        if(!user){
            return NextResponse.json(
              {error: "Unauthorized"},
              {status: 401}
            );
        }
        const { id } = await params;
        const existingApplication = await prisma.application.findFirst({
          where: {
            id,
            userId: user.id,
          },
        });

        if (!existingApplication) {
          return NextResponse.json(
            { error: "Application not found" },
            { status: 404 }
          );
        }

        const application = await prisma.application.delete({
            where: {
                id,
            }
        });

        return NextResponse.json(
            {application},
            {status: 200}
        );
    }

    catch(error){
        console.log(error);

        return NextResponse.json(
            {error: "Failed to delete application"},
            {status: 500}
        )
    }

}