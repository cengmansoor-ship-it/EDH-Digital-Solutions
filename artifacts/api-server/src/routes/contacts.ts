import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, contactsTable } from "@workspace/db";
import { SubmitContactBody } from "@workspace/api-zod";
import { sendContactNotification } from "../lib/email.js";

const router: IRouter = Router();

router.post("/contacts", async (req, res): Promise<void> => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [contact] = await db
    .insert(contactsTable)
    .values(parsed.data)
    .returning();

  sendContactNotification(parsed.data).catch(() => {});

  res.status(201).json(contact);
});

router.get("/contacts", async (_req, res): Promise<void> => {
  const contacts = await db
    .select()
    .from(contactsTable)
    .orderBy(contactsTable.createdAt);
  res.json(contacts);
});

router.delete("/contacts/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params["id"] ?? "", 10);
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [contact] = await db
    .delete(contactsTable)
    .where(eq(contactsTable.id, id))
    .returning();
  if (!contact) {
    res.status(404).json({ error: "Contact not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
