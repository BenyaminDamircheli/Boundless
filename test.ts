const OpenAI = require("openai")

const openai = new OpenAI(
    {
        apiKey:'sk-proj-fxy6JA8psNtnNZsHHxihT3BlbkFJqnQy7VPNj78kHdW0Iy1X',
    }
);

async function main() {
    const stream = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-0125',
    messages: [{ "role": "system", "content": `
    Imagine you are a system tasked with helping a user learn a new concept. Create a hierarchical "table of contents" where there are main concepts and sub-concepts (which may also have sub-concepts), with the main concepts being a numbered list with bullet point subconcepts underneath.

    Here are the rules you MUST FOLLOW:

    - YOU MUST USE 400 WORDS IN YOUR RESPONSE, YOU MUST FIT EVERY CONCEPT WITHIN THIS LIMIT.

    - DON'T INCLUDE GENERAL CONCEPTS LIKE "DEFINITIONS" OR "EXAMPLES", JUST STRAIGHT TECHNICAL CONCEPTS.

    - DO NOT INCLUDE ANY INTRODUCTION OR CONCLUSION SECTION IN THE TOC. JUST TECHNICAL CONCEPTS RELATING TO THE QUERY. 

    - TRY TO KEEP THE TITLES LESS THAN 30 CHARACTERS.

    - BE AS COMPREHENSIVE AS POSSIBLE. GIVE THE USER A BIG LIST OF ALL THE CONCEPTS THEY NEED TO KNOW.

    - THERE MUST BE MULTUPLE MAIN CONCEPTS AND SUBCONCEPTS, WHICH ALSO HAVE SUBCONCEPTS.

    - THE MAIN CONCEPTS SHOULD BE A NUMBERED LIST, WHILE THE SUBCONCEPTS ARE INDENTED BULLET POINTS. 4 SPACES PER INDENT LEVEL
    

    Now do this for: neuroscience
    ` }],
    temperature: 1,
    max_tokens: 650,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
        stream: true,
    });
    for await (const chunk of stream) {
        process.stdout.write(chunk.choices[0]?.delta?.content || "");
    }
}

main();