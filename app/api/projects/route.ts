import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import Project from "@/models/Project";

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 },
      );
    }

    const { idea } = await request.json();

    if (!idea?.trim()) {
      return NextResponse.json(
        { error: "Project idea is required" },
        { status: 400 },
      );
    }

    await connectDB();

    const project = await Project.create({
      userId: session.userId,
      idea: idea.trim(),
      currentStep: "discovery",
      data: {
        idea: idea.trim(),
      },
    });

    return NextResponse.json({
      success: true,
      projectId: project._id.toString(),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 },
      );
    }

    const { projectId } = await request.json();

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 },
      );
    }

    await connectDB();

    const project = await Project.findOneAndDelete({
      _id: projectId,
      userId: session.userId,
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Delete project error:", error);

    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 },
    );
  }
}
