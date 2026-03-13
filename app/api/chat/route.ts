import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const lastMessage = messages[messages.length - 1]?.content;

    const response = await fetch("https://bedrock-runtime.us-east-1.amazonaws.com/model/amazon.nova-lite-v1/invoke", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.BEDROCK_API_KEY!,
      },
      body: JSON.stringify({
        inputText: lastMessage,
      }),
    });

    const data = await response.json();

    return NextResponse.json({
      message: data.outputText || "No response",
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "AI error" }, { status: 500 });
  }
}