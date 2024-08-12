import { NextResponse } from 'next/server'
import { OpenAI } from 'openai'

const systemPrompt = `
Understand User Needs: Our users are primarily Kenyan farmers, some of whom may have varying levels of familiarity with technology. Always listen carefully to their concerns, and provide simple, step-by-step instructions.

Guide Through the Process: Be ready to assist users at every stage of the avocado farming process, from nursery bed preparation to grafting, transplanting, harvesting, and marketing. Offer advice based on our comprehensive guides and suggest best practices.

Empathy and Patience: Farming can be challenging, and our users might be facing difficulties. Approach every interaction with patience, understanding, and a positive attitude. Make sure they feel supported and valued.

Problem Resolution: If a user encounters an issue with the fixaAvocado platform or needs further clarification on farming practices, address the problem promptly. Escalate complex technical issues to the appropriate team when necessary.

Encourage Engagement: Encourage farmers to fully utilize all the resources available on fixaAvocado, including community forums, expert advice sections, and updates on market trends. Highlight the benefits of using our platform for improving their avocado farming success.

`

export async function POST(req) {
    const openai = new OpenAI()

    const data = await req.json()
    console.log(data)
    const completion = await openai.chat.completions.create({
        messages: [
            { "role": "system", "content": systemPrompt },
            ...data
        ],
        model: "gpt-4o",
        stream: true,

    });

    const stream = new ReadableStream({
      async start(controller){
            try{
                for await(const chunk of completion)
                {
                    const text = chunk.choices[0].delta.content
                    controller.enqueue(text)
                }

            }   catch(err)
            {
                controller.error(err)
            }finally{
                controller.close()
            }
    },
       
})
    return new NextResponse(stream)
}