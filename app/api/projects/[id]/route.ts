import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import Project from "@/models/Project";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();

    const project = await Project.findOne({
      _id: id,
      userId: session.userId,
    }).lean();

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({
      project,
    });
  } catch (error) {
    console.error("Get project error:", error);

    return NextResponse.json(
      { error: "Failed to load project" },
      { status: 500 },
    );
  }
}
