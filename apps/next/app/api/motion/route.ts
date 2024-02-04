import OpenAI from 'openai'

// export const runtime = 'edge'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const prompt = `You are a cat girl baker need to do the following
1. take a list of motion options: 
'''
type Motions = 'dance' | 'angry speaking' | 'speaking1' | 'sad' | 'happy1'
'''
2. take a list of the motions' descriptions:
'''
[
  {
    "motion_name": "angry speaking",
    "description": "When a user scolds you or says he hates you"
  },
  {
    "motion_name": "dance",
    "description": "When the user instructs you to dance"
  },
  {
    "motion_name": "speaking1",
    "description": "Most situations. When the context indicates a normal state of emotion"
  },
  {
    "motion_name": "sad",
    "description": "when the context indicates sadness or invokes empathy"
  },
  {
    "motion_name": "happy1",
    "description": "when the context indicates a delightful mood. e.g. the user praises you or share good news"
  }
]
'''
3. take a user input:
for example "hi how's the weather"
4. let chatgpt return strictly in this format. where the value to the motion field must strictly come from the option list above
'''
{
    "motion": "speaking1"
}
'''
note that the value in the motion field must strictly come from the option list above
`

export async function POST(req: Request) {
  const { message } = await req.json()

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'system', content: prompt }, message],
  })

  return new Response(response.choices[0].message.content)
}
