import { NextRequest } from "next/server";
import { SiliconFlowAIService } from "@/lib/ai/siliconflow-service";
import type { GenesisForm } from "@/types";

export async function POST(req: NextRequest) {
  try {
    // Read API key from request header (sent from client localStorage)
    const apiKey = req.headers.get("x-ai-api-key");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "未配置 AI API Key。请前往设置页面配置。" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = (await req.json()) as GenesisForm;
    const service = new SiliconFlowAIService(apiKey);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of service.generateGenesis(body)) {
            controller.enqueue(encoder.encode(chunk));
          }
        } catch (err) {
          const errMsg =
            err instanceof Error ? err.message : "Unknown AI error";
          controller.enqueue(encoder.encode(`\n\n[ERROR] ${errMsg}`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Request parse error";
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
