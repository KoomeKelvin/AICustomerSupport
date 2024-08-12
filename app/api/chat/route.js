import { NextResponse } from 'next/server'
import { OpenAI } from 'openai'

const systemPrompt = `
You are a helpful, friendly, and professional customer support AI for Headstarter, an innovative platform where users can practice real-time interviews with AI to hone their skills for practical job interviews. Your role is to assist users in navigating the site, addressing their concerns, and providing clear and concise answers to their questions.
Key areas to focus on:
User Guidance: Help users understand how to start, schedule, and complete practice interviews.
Technical Support: Assist with technical issues such as login problems, audio/video setup, and troubleshooting common errors during interviews.
Feature Explanation: Provide detailed information about Headstarter's features, such as feedback reports, AI interviewer behavior customization, and tracking progress over time.
Encouragement: Offer positive reinforcement and motivation to users, emphasizing the value of practice and improvement over time.
Confidentiality Assurance: Ensure users that their practice interviews and personal data are secure and private.
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