import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import Project from "@/models/Project";
import { askGemini } from "@/lib/gemini";
import { discoverySchema, architectureSchema } from "@/types/architect";

const discoveryJsonSchema = {
  type: "object",
  properties: {
    summary: { type: "string" },

    facts: {
      type: "array",
      items: { type: "string" },
    },

    assumptions: {
      type: "array",
      items: { type: "string" },
    },

    unknowns: {
      type: "array",
      items: { type: "string" },
    },

    questions: {
      type: "array",
      maxItems: 4,
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          question: { type: "string" },
          reason: { type: "string" },
        },
        required: ["id", "question", "reason"],
      },
    },
  },

  required: ["summary", "facts", "assumptions", "unknowns", "questions"],
};

const architectureJsonSchema = {
  type: "object",
  properties: {
    projectName: { type: "string" },

    overview: { type: "string" },

    requirements: {
      type: "object",
      properties: {
        functional: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              requirement: { type: "string" },
              reason: { type: "string" },
            },
            required: ["id", "requirement", "reason"],
          },
        },

        nonFunctional: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              requirement: { type: "string" },
              reason: { type: "string" },
            },
            required: ["id", "requirement", "reason"],
          },
        },
      },
      required: ["functional", "nonFunctional"],
    },

    scope: {
      type: "object",
      properties: {
        v1: {
          type: "array",
          items: { type: "string" },
        },
        v2: {
          type: "array",
          items: { type: "string" },
        },
        outOfScope: {
          type: "array",
          items: { type: "string" },
        },
      },
      required: ["v1", "v2", "outOfScope"],
    },

    architecture: {
      type: "object",
      properties: {
        style: { type: "string" },
        description: { type: "string" },

        components: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              purpose: { type: "string" },
            },
            required: ["name", "purpose"],
          },
        },
      },
      required: ["style", "description", "components"],
    },

    techStacks: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },

          technologies: {
            type: "array",
            items: { type: "string" },
          },

          pros: {
            type: "array",
            items: { type: "string" },
          },

          cons: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: ["name", "description", "technologies", "pros", "cons"],
      },
    },

    recommendedStack: {
      type: "string",
    },

    database: {
      type: "object",
      properties: {
        type: { type: "string" },
        description: { type: "string" },

        collections: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              purpose: { type: "string" },
              fields: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: ["name", "purpose", "fields"],
          },
        },
      },
      required: ["type", "description", "collections"],
    },

    projectStructure: {
      type: "array",
      items: {
        type: "object",
        properties: {
          path: { type: "string" },
          purpose: { type: "string" },
        },
        required: ["path", "purpose"],
      },
    },

    roadmap: {
      type: "array",
      items: {
        type: "object",
        properties: {
          phase: { type: "string" },

          tasks: {
            type: "array",
            items: { type: "string" },
          },

          doneWhen: { type: "string" },
        },
        required: ["phase", "tasks", "doneWhen"],
      },
    },

    srs: {
      type: "object",
      properties: {
        introduction: { type: "string" },
        purpose: { type: "string" },
        scope: { type: "string" },

        stakeholders: {
          type: "array",
          items: { type: "string" },
        },

        userRoles: {
          type: "array",
          items: { type: "string" },
        },

        dataRequirements: {
          type: "array",
          items: { type: "string" },
        },

        interfaces: {
          type: "array",
          items: { type: "string" },
        },

        securityRequirements: {
          type: "array",
          items: { type: "string" },
        },

        constraints: {
          type: "array",
          items: { type: "string" },
        },

        assumptions: {
          type: "array",
          items: { type: "string" },
        },

        acceptanceCriteria: {
          type: "array",
          items: { type: "string" },
        },
      },

      required: [
        "introduction",
        "purpose",
        "scope",
        "stakeholders",
        "userRoles",
        "dataRequirements",
        "interfaces",
        "securityRequirements",
        "constraints",
        "assumptions",
        "acceptanceCriteria",
      ],
    },
  },

  required: [
    "projectName",
    "overview",
    "requirements",
    "scope",
    "architecture",
    "techStacks",
    "recommendedStack",
    "database",
    "projectStructure",
    "roadmap",
    "srs",
  ],
};

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 },
      );
    }

    const { projectId, answers, action } = await request.json();

    await connectDB();

    const project = await Project.findOne({
      _id: projectId,
      userId: session.userId,
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    /*
     * STEP 1
     *
     * First request:
     * Analyze the idea and ask exactly 4 questions.
     */
    if (!project.data?.discovery) {
      const prompt = `
You are an AI Software Project Architect.

Analyze this software idea:

${project.idea}

Ask EXACTLY 4 questions.

These are the ONLY questions the user will ever be asked
during project creation.

Choose the 4 questions that have the biggest effect on:

- project requirements
- users
- platform
- scope
- scale
- important constraints

Do not ask technical questions if the user does not need
to answer them.

Do not ask about programming languages, databases,
frameworks or architecture.

The user should not need to be a technical person.

Rules:

- Never invent facts.
- Separate facts, assumptions and unknowns.
- Keep questions short and easy to answer.
- Combine related questions when possible.
- Do not ask follow-up questions later.
- After these 4 questions, you must be able to create
  a practical project plan using reasonable assumptions.

Return ONLY JSON.
`;

      const result = await askGemini(
        prompt,
        discoveryJsonSchema,
        discoverySchema,
      );

      // Absolute application-level limit.
      result.questions = result.questions.slice(0, 4);

      project.data = {
        ...project.data,
        discovery: result,
      };

      await project.save();

      return NextResponse.json({
        success: true,
        type: "questions",
        result,
      });
    }

    /*
     * STEP 2
     *
     * User answered the 4 questions.
     * Generate EVERYTHING.
     */
    if (answers && !project.data?.architecture) {
      const discovery = project.data.discovery;

      const answeredQuestions = discovery.questions.map(
        (question: { id: string; question: string; reason: string }) => ({
          question: question.question,
          answer: answers[question.id] || "Not provided",
        }),
      );

      const prompt = `
You are an AI Software Project Architect.

Create the COMPLETE software project plan.

PROJECT IDEA:
${project.idea}

DISCOVERY:
${JSON.stringify(discovery, null, 2)}

USER ANSWERS:
${JSON.stringify(answeredQuestions, null, 2)}

IMPORTANT:

The user has now answered the only questions they will be
asked.

DO NOT ask questions.

DO NOT return a questions field.

DO NOT stop at requirements.

Generate the complete implementation plan.

You must cover:

1. Project overview
2. Functional requirements
3. Non-functional requirements
4. V1 scope
5. V2 scope
6. Out-of-scope features
7. Architecture
8. 3 suitable technology stacks
9. One clearly marked recommended stack
10. Database design
11. Project folder/file structure
12. Development roadmap
13. SRS

For missing information:

- Do not invent user requirements.
- Make reasonable technical assumptions.
- Clearly mark those assumptions.
- If something cannot be known, make a practical default
  decision and explain it briefly.

The project should be realistic and not unnecessarily
complex.

Prefer simple architecture.

Do not over-engineer.

Keep every section concise.

The result should be useful enough for a developer to
start implementing the project.

Return ONLY JSON matching the provided schema.
`;

      const result = await askGemini(
        prompt,
        architectureJsonSchema,
        architectureSchema,
      );

      project.name = result.projectName;

      project.data = {
        ...project.data,
        discoveryAnswers: answers,
        architecture: result,
      };

      project.currentStep = "complete";

      await project.save();

      return NextResponse.json({
        success: true,
        type: "complete",
        result,
      });
    }

    /*
     * STEP 3
     *
     * Edit an existing project using a user command.
     */
    if (action === "edit") {
      const { command } = await request.json();

      if (!command?.trim()) {
        return NextResponse.json(
          { error: "Command is required" },
          { status: 400 },
        );
      }

      const prompt = `
You are editing an existing software project architecture.

CURRENT PROJECT:
${JSON.stringify(project.data.architecture, null, 2)}

USER COMMAND:
${command}

Apply the user's requested change.

Rules:

- Do not ask questions.
- Return the COMPLETE updated architecture.
- Keep everything that was not affected.
- Check that the updated project remains consistent.
- Do not randomly change unrelated decisions.
- Keep the project practical and simple.
- Return ONLY JSON matching the provided schema.
`;

      const result = await askGemini(
        prompt,
        architectureJsonSchema,
        architectureSchema,
      );

      project.data = {
        ...project.data,
        architecture: result,
      };

      await project.save();

      return NextResponse.json({
        success: true,
        type: "complete",
        result,
      });
    }

    return NextResponse.json({
      success: true,
      type: "complete",
      result: project.data.architecture,
    });
  } catch (error) {
    console.error("Architect API error:", error);

    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
