import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.BASE_URL,
});

type GenerateTextOptions = {
  model?: string;
  prompt: string;
  temprature?: number;
  maxTokens: number;
  previousId?: string;
};

type GenerateTextResult = {
  id: string;
  text: string;
};

export const llmClient = {
  async generateText({
    model = "gpt-5-mini",
    prompt,
    temprature = 0.2,
    maxTokens = 300,
    previousId,
  }: GenerateTextOptions): Promise<GenerateTextResult> {
    const response = await client.responses.create({
      model,
      input: prompt,
      max_output_tokens: maxTokens,
    });

    return { id: response.id, text: response.output_text };
  },
};
