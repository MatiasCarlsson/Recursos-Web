"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type TransferAccount = {
  currency: string;
  value: string;
  method?: string;
};

const transferAccounts: TransferAccount[] = [
  {
    currency: "USD",
    value: process.env.NEXT_PUBLIC_SUPPORT_CBU_USD ?? "CBU_USD_PENDIENTE_DE_CONFIGURAR",
  },
  {
    currency: "EUR",
    value: process.env.NEXT_PUBLIC_SUPPORT_CBU_EUR ?? "CBU_EUR_PENDIENTE_DE_CONFIGURAR",
  },
  {
    currency: "ARS",
    value: process.env.NEXT_PUBLIC_SUPPORT_CBU_ARS ?? "CBU_ARS_PENDIENTE_DE_CONFIGURAR",
  },
];

const astroPayUrl =
  process.env.NEXT_PUBLIC_SUPPORT_ASTROPAY_URL ?? "ASTROPAY_PENDIENTE_DE_CONFIGURAR";
const koFiUrl = "https://ko-fi.com/matiascarlsson";

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!value.trim() || value.includes("PENDIENTE_DE_CONFIGURAR")) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-lg border border-buttonColor/60 bg-buttonColor/15 px-3 py-2 text-xs font-semibold text-textPrimary transition hover:border-buttonColor hover:bg-buttonColor/25"
    >
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}

function TransferAccountRow({ account }: { account: TransferAccount }) {
  return (
    <div className="rounded-2xl border border-border/40 bg-primaryColor/35 p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-2xl font-black uppercase tracking-[0.22em] text-buttonColor/90">
            {account.currency}
          </p>
          {account.method ? (
            <h3 className="mt-1 text-sm font-semibold text-textPrimary">{account.method}</h3>
          ) : null}
        </div>
        <CopyButton value={account.value} />
      </div>
    </div>
  );
}

function AstroPayCard() {
  const hasLink = !astroPayUrl.includes("PENDIENTE_DE_CONFIGURAR");

  return (
    <article className="rounded-2xl border border-border/40 bg-cardBackground/70 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-2xl font-black uppercase tracking-[0.22em] text-accent/90">ARS</p>
          <h3 className="mt-1 text-sm font-semibold text-textPrimary">Astro Pay</h3>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-[120px_1fr] sm:items-center">
        <div className="flex aspect-square items-center justify-center rounded-2xl border border-border/40 bg-primaryColor/40">
          <div className="text-center">
            <div className="mx-auto mb-2 flex size-32 items-center justify-center rounded-xl border border-buttonColor/35 bg-buttonColor/10 text-[11px] font-bold tracking-[0.2em] text-buttonColor">
              <Image src="/image/QR_AstroPay.png" alt="Astro Pay Logo" width={110} height={110} />
            </div>
            <p className="max-w-32 text-[11px] leading-relaxed text-textSecondary">
              Escanea el QR e ingresa un monto.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm leading-relaxed text-textSecondary">
            Disponible para transferencias rapidas en ARS.
          </p>
          <a
            href={hasLink ? astroPayUrl : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex rounded-lg border border-buttonColor/60 bg-buttonColor/15 px-3 py-2 text-xs font-semibold text-textPrimary transition hover:border-buttonColor hover:bg-buttonColor/25 ${hasLink ? "" : "pointer-events-none opacity-60"}`}
          >
            {hasLink ? "Abrir Astro Pay" : "Configurar Astro Pay"}
          </a>
        </div>
      </div>
    </article>
  );
}

export default function SupportSection() {
  const configuredTransfers = useMemo(
    () => transferAccounts.some((account) => !account.value.includes("PENDIENTE_DE_CONFIGURAR")),
    [],
  );

  return (
    <section id="apoya" className="pt-4 sm:pt-8">
      <div className="rounded-3xl border border-border/25 bg-cardBackground/60 p-6 sm:p-8">
        <div className="mb-6 max-w-2xl space-y-2">
          <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-buttonColor/70">
            apoyo al proyecto
          </p>
          <h2 className="text-2xl font-semibold italic text-textPrimary sm:text-3xl">
            Si te sirve lo que hacemos, puedes apoyarlo de dos maneras.
          </h2>
          <p className="text-sm leading-relaxed text-textSecondary">
            La transferencia directa evita comisiones de plataforma. Si prefieres un método rápido,
            también tienes pagos con QR o enlace según la moneda.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <article className="rounded-3xl border border-border/35 bg-linear-to-br from-cardBackground/90 to-primaryColor/40 p-5 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono uppercase tracking-[0.18em] text-textPrimary text-xl">
                  transferencia bancaria
                </p>
              </div>

              <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-200">
                {configuredTransfers ? "Disponible" : "Configurable"}
              </span>
            </div>

            <div className="space-y-3">
              {transferAccounts.map((account) => (
                <TransferAccountRow key={account.currency} account={account} />
              ))}
              <AstroPayCard />
            </div>
          </article>

          <article className="rounded-3xl border border-border/35 bg-linear-to-br from-cardBackground/90 to-accent/10 p-5 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xl font-mono uppercase tracking-[0.18em] text-textPrimary">
                  pagos con comisiones
                </p>
                <h3 className="mt-1 text-md font-semibold text-textPrimary">
                  Ko-fi / PayPal internacional
                </h3>
              </div>
            </div>

            <div className="rounded-2xl border border-border/40 bg-cardBackground/70 p-4">
              <p className="text-sm leading-relaxed text-textSecondary">
                Pagos internacionales con PayPal y otros metodos desde Ko-fi.
              </p>
              <a
                href={koFiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex rounded-lg border border-buttonColor/60 bg-buttonColor/15 px-4 py-2 text-sm font-semibold text-textPrimary transition hover:border-buttonColor hover:bg-buttonColor/25"
              >
                Ir a Ko-fi
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
