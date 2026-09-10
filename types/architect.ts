import { z } from "zod";

export const discoverySchema = z.object({
  summary: z.string(),

  facts: z.array(z.string()),

  assumptions: z.array(z.string()),

  unknowns: z.array(z.string()),

  questions: z.array(
    z.object({
      id: z.string(),
      question: z.string(),
      reason: z.string(),
    }),
  ),
});

export const architectureSchema = z.object({
  projectName: z.string(),

  overview: z.string(),

  requirements: z.object({
    functional: z.array(
      z.object({
        id: z.string(),
        requirement: z.string(),
        reason: z.string(),
      }),
    ),

    nonFunctional: z.array(
      z.object({
        id: z.string(),
        requirement: z.string(),
        reason: z.string(),
      }),
    ),
  }),

  scope: z.object({
    v1: z.array(z.string()),
    v2: z.array(z.string()),
    outOfScope: z.array(z.string()),
  }),

  architecture: z.object({
    style: z.string(),
    description: z.string(),
    components: z.array(
      z.object({
        name: z.string(),
        purpose: z.string(),
      }),
    ),
  }),

  techStacks: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      technologies: z.array(z.string()),
      pros: z.array(z.string()),
      cons: z.array(z.string()),
    }),
  ),

  recommendedStack: z.string(),

  database: z.object({
    type: z.string(),
    description: z.string(),
    collections: z.array(
      z.object({
        name: z.string(),
        purpose: z.string(),
        fields: z.array(z.string()),
      }),
    ),
  }),

  projectStructure: z.array(
    z.object({
      path: z.string(),
      purpose: z.string(),
    }),
  ),

  roadmap: z.array(
    z.object({
      phase: z.string(),
      tasks: z.array(z.string()),
      doneWhen: z.string(),
    }),
  ),

  srs: z.object({
    introduction: z.string(),
    purpose: z.string(),
    scope: z.string(),
    stakeholders: z.array(z.string()),
    userRoles: z.array(z.string()),
    dataRequirements: z.array(z.string()),
    interfaces: z.array(z.string()),
    securityRequirements: z.array(z.string()),
    constraints: z.array(z.string()),
    assumptions: z.array(z.string()),
    acceptanceCriteria: z.array(z.string()),
  }),
});

export type Discovery = z.infer<typeof discoverySchema>;
export type Architecture = z.infer<typeof architectureSchema>;
