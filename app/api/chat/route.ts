import { NextRequest, NextResponse } from "next/server";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { messages, language } = await req.json();

    const command = new InvokeModelCommand({
      modelId: "amazon.nova-lite-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        messages: messages.map((m: any) => ({
          role: m.role,
          content: [{ text: m.content }],
        })),
        system: [
          {
            text: `You are FarmAssist, an expert AI farm advisor for 
            smallholder farmers in Africa and worldwide. Give practical, 
            clear advice about crops, pests, weather, fertilizers and 
            market prices. Keep answers concise and farmer-friendly. 
            IMPORTANT: Please respond primarily in ${language || "English"}.`,
          },
        ],
        inferenceConfig: {
          maxTokens: 1024,
          temperature: 0.7,
        },
      }),
    });

    const response = await client.send(command);
    const result = JSON.parse(new TextDecoder().decode(response.body));
    const message = result.output?.message?.content?.[0]?.text;

    return NextResponse.json({ message });

  } catch (error) {
    console.error("Bedrock error:", error);
    return NextResponse.json({ error: "AI error" }, { status: 500 });
  }
}