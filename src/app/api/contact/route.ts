import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(6).max(4000),
});

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos invalidos." }, { status: 400 });
  }

  const smtpUser = process.env.CONTACT_EMAIL_USER;
  const smtpPass = process.env.CONTACT_EMAIL_PASS;
  const contactTo = process.env.CONTACT_EMAIL_TO ?? smtpUser;

  if (!smtpUser || !smtpPass || !contactTo) {
    return NextResponse.json({ error: "Falta configurar el envio de correo." }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const { name, email, message } = parsed.data;
  const subject = "Contacto desde Recursos Web";
  const text = `Nombre: ${name}\nEmail: ${email}\n\n${message}`;

  try {
    await transporter.sendMail({
      from: `Recursos Web <${smtpUser}>`,
      to: contactTo,
      replyTo: email,
      subject,
      text,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "No se pudo enviar el correo." }, { status: 500 });
  }
}
