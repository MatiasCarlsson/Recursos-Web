"use client";

import { useState, type FormEvent } from "react";
const inputClass =
  "w-full rounded-xl border border-border/35 bg-cardBackground/70 px-4 py-3 text-sm text-textPrimary placeholder:text-textSecondary/60 focus:border-buttonColor/60 focus:outline-none focus:ring-2 focus:ring-buttonColor/20";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (status === "loading") {
      return;
    }

    const messageValue = message.trim();
    const nameValue = name.trim();
    const emailValue = email.trim();

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameValue,
          email: emailValue,
          message: messageValue,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "No se pudo enviar el mensaje.");
      }

      setName("");
      setEmail("");
      setMessage("");
      setStatus("success");

      window.setTimeout(() => setStatus("idle"), 2500);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "No se pudo enviar el mensaje.");
    }
  }

  return (
    <form
      className="rounded-2xl border border-border/30 bg-cardBackground/70 p-5 sm:p-6"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4">
        <input
          name="nombre"
          type="text"
          placeholder="Tu nombre"
          autoComplete="name"
          className={inputClass}
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Tu email"
          autoComplete="email"
          className={inputClass}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <textarea
          name="mensaje"
          rows={5}
          placeholder="Contame en que puedo ayudar..."
          className={inputClass}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
        />
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-textSecondary">Respuesta habitual en 24-48 hs.</p>
        <div className="flex flex-wrap items-center gap-3">
          {status === "success" && (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
              Enviado ✓
            </span>
          )}
          {status === "error" && (
            <span className="text-xs font-semibold text-rose-200">{errorMessage}</span>
          )}
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex items-center justify-center rounded-full border border-buttonColor/60 bg-buttonColor/15 px-5 py-2 text-sm font-semibold text-textPrimary transition hover:border-buttonColor hover:bg-buttonColor/25 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === "loading" ? "Enviando..." : "Enviar mensaje"}
          </button>
        </div>
      </div>
    </form>
  );
}
