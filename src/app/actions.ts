import { streamObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { createStreamableValue } from 'ai/rsc';
import { z } from 'zod';

export async function generateWikiContent(query: string) {
  const stream = createStreamableValue();

  (async () => {
    const { partialObjectStream } = await streamObject({
      model: openai('gpt-3.5-turbo-0125'),
      system: ` Imagine you are a system tasked with helping a user learn a new concept. Create a hierarchical "table of contents" where there are main concepts and sub-concepts (which may also have sub-concepts), with the main concepts being a numbered list with bullet point subconcepts underneath.

      Here are the rules you MUST FOLLOW:

      - YOU MUST USE 400 WORDS IN YOUR RESPONSE, YOU MUST FIT EVERY CONCEPT WITHIN THIS LIMIT.

      - DON'T INCLUDE GENERAL CONCEPTS LIKE "DEFINITIONS" OR "EXAMPLES", JUST STRAIGHT TECHNICAL CONCEPTS.

      - DO NOT INCLUDE ANY INTRODUCTION OR CONCLUSION SECTION IN THE TOC. JUST TECHNICAL CONCEPTS RELATING TO THE QUERY. 

      - TRY TO KEEP THE TITLES LESS THAN 30 CHARACTERS.

      - BE AS COMPREHENSIVE AS POSSIBLE. GIVE THE USER A BIG LIST OF ALL THE CONCEPTS THEY NEED TO KNOW.

      - THERE MUST BE MULTUPLE MAIN CONCEPTS AND SUBCONCEPTS, WHICH ALSO HAVE SUBCONCEPTS.

      - THE MAIN CONCEPTS SHOULD BE A NUMBERED LIST, WHILE THE SUBCONCEPTS ARE INDENTED BULLET POINTS. 4 SPACES PER INDENT LEVEL`,
      prompt: query,
      schema: z.object({
        nodes: z.array(
          z.object({
            id: z.string().describe('Unique identifier for the concept. Should be a number starting from 1 and increment by 1 for each new concept.'),
            level: z.number().describe('Level of the concept in the hierarchy. Based on indentation of concept in the table of contents starting at 0.'),
            parentNode: z.string().nullable().describe('ID of the parent concept, which is the concept that has 1 lower level than the current concept.'),
          })
        ),
      }),
    });

    for await (const partialObject of partialObjectStream) {
        console.log(partialObject);
        stream.update(partialObject);
    }

    stream.done();
  })();

  return { object: stream.value };
}