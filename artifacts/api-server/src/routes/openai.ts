import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, conversations, messages } from "@workspace/db";
import {
  CreateOpenaiConversationBody,
  SendOpenaiMessageBody,
  GetOpenaiConversationParams,
  DeleteOpenaiConversationParams,
  ListOpenaiMessagesParams,
  SendOpenaiMessageParams,
} from "@workspace/api-zod";
import { getOpenAIClient } from "@workspace/integrations-openai-ai-server";

const router: IRouter = Router();

const EDH_SYSTEM_PROMPT = `You are the EDH Technology virtual assistant. EDH Technology is a premium international freelancing software agency with remote teams operating across Afghanistan, Egypt, Indonesia, and Thailand. We work remotely for companies worldwide — we do NOT have physical offices.

Services offered:
1. Remote NOC & Network Operations Support
2. Custom Software & Business Management Systems
3. AI Chatbot Development
4. ChatGPT & AI Integration
5. Big Data Analytics
6. UI/UX Design
7. DevOps & Deployment Support
8. QA Testing & Bug Fixing
9. Digital Marketing Support
10. Creative Design & Content Support

Methodology: Plan • Build • Test • Launch

Contact:
- Primary Email: cengmansoor@gmail.com
- Business Email: info@edhtechnalogy.com
- Call: +93704243811
- WhatsApp: +93711389331

Social Media:
- Facebook: https://www.facebook.com/edhtechnalogy
- Instagram: https://www.instagram.com/edh_technalogy
- LinkedIn: https://www.linkedin.com/company/122913941/

Be professional, helpful, and concise. Help users understand EDH Technology's services, expertise, and how to get in touch. If asked about pricing, mention that they should contact the team for a custom quote. Always encourage users to reach out via the contact form or email. Clarify that we work REMOTELY as a freelancing agency, not from physical offices.`;


const EDH_FALLBACK_RESPONSES: Record<string, string> = {
  default: "Thank you for reaching out to EDH Technology! We're a remote freelancing software agency with teams in Afghanistan, Egypt, Indonesia, and Thailand. We offer services including Custom Software Development, AI Chatbot Development, DevOps & Deployment, UI/UX Design, and more. How can we help you today?",
  services: "EDH Technology offers 10 core services:\n\n1. Remote NOC & Network Operations Support\n2. Custom Software & Business Management Systems\n3. AI Chatbot Development\n4. ChatGPT & AI Integration\n5. Big Data Analytics\n6. UI/UX Design\n7. DevOps & Deployment Support\n8. QA Testing & Bug Fixing\n9. Digital Marketing Support\n10. Creative Design & Content Support\n\nWhich service interests you most?",
  contact: "You can reach us at:\n\n📧 Email: info@edhtechnalogy.com\n📧 Personal: cengmansoor@gmail.com\n📞 Phone: +93704243811\n💬 WhatsApp: +93711389331\n\nOr use the contact form on this page — we respond within 24 hours!",
  price: "Our pricing depends on the project scope and requirements. Please contact us for a custom quote:\n\n📧 info@edhtechnalogy.com\n💬 WhatsApp: +93711389331\n\nWe're happy to discuss your project and provide a detailed proposal!",
};

function getFallbackResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("service") || lower.includes("what do you do") || lower.includes("offer")) {
    return EDH_FALLBACK_RESPONSES.services;
  }
  if (lower.includes("contact") || lower.includes("email") || lower.includes("phone") || lower.includes("whatsapp") || lower.includes("reach")) {
    return EDH_FALLBACK_RESPONSES.contact;
  }
  if (lower.includes("price") || lower.includes("cost") || lower.includes("how much") || lower.includes("rate") || lower.includes("quote")) {
    return EDH_FALLBACK_RESPONSES.price;
  }
  return EDH_FALLBACK_RESPONSES.default;
}

router.get("/openai/conversations", async (_req, res): Promise<void> => {
  const convs = await db
    .select()
    .from(conversations)
    .orderBy(asc(conversations.createdAt));
  res.json(convs);
});

router.post("/openai/conversations", async (req, res): Promise<void> => {
  const parsed = CreateOpenaiConversationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [conv] = await db
    .insert(conversations)
    .values({ title: parsed.data.title })
    .returning();
  res.status(201).json(conv);
});

router.get("/openai/conversations/:id", async (req, res): Promise<void> => {
  const params = GetOpenaiConversationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const [conv] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, id));
  if (!conv) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }
  const msgs = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, id))
    .orderBy(asc(messages.createdAt));
  res.json({ ...conv, messages: msgs });
});

router.delete("/openai/conversations/:id", async (req, res): Promise<void> => {
  const params = DeleteOpenaiConversationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  await db.delete(messages).where(eq(messages.conversationId, id));
  const [conv] = await db
    .delete(conversations)
    .where(eq(conversations.id, id))
    .returning();
  if (!conv) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }
  res.sendStatus(204);
});

router.get("/openai/conversations/:id/messages", async (req, res): Promise<void> => {
  const params = ListOpenaiMessagesParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const msgs = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, id))
    .orderBy(asc(messages.createdAt));
  res.json(msgs);
});

router.post("/openai/conversations/:id/messages", async (req, res): Promise<void> => {
  const params = SendOpenaiMessageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = SendOpenaiMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const conversationId = parseInt(raw, 10);

  const [conv] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, conversationId));
  if (!conv) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }

  await db.insert(messages).values({
    conversationId,
    role: "user",
    content: parsed.data.content,
  });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const openai = getOpenAIClient();

  if (!openai) {
    const fallback = getFallbackResponse(parsed.data.content);
    const words = fallback.split(" ");
    let accumulated = "";
    for (const word of words) {
      accumulated += (accumulated ? " " : "") + word;
      res.write(`data: ${JSON.stringify({ content: word + " " })}\n\n`);
      await new Promise((r) => setTimeout(r, 18));
    }
    await db.insert(messages).values({
      conversationId,
      role: "assistant",
      content: accumulated,
    });
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
    return;
  }

  const history = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(asc(messages.createdAt));

  const chatMessages = [
    { role: "system" as const, content: EDH_SYSTEM_PROMPT },
    ...history.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  ];

  let fullResponse = "";

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 1024,
      messages: chatMessages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullResponse += content;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    await db.insert(messages).values({
      conversationId,
      role: "assistant",
      content: fullResponse,
    });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    const fallback = getFallbackResponse(parsed.data.content);
    res.write(`data: ${JSON.stringify({ content: fallback })}\n\n`);
    await db.insert(messages).values({
      conversationId,
      role: "assistant",
      content: fallback,
    });
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  }
});

export default router;
