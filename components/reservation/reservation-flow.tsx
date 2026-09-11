"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/gateway/client";
import type {
  Availability,
  BookingPolicy,
  Occasion,
  Reservation,
  Slot,
} from "@/services/reservation-service/contract";
import { formatLongDate, parisIsoDate } from "@/lib/schedule";
import { ArrowIcon, Button, ButtonLink } from "@/packages/ui/button";
import { cn } from "@/packages/ui/cn";
import { Field, Input, Select, Textarea } from "@/packages/ui/field";

type Step = 1 | 2 | 3;

const STEPS: readonly { id: Step; label: string }[] = [
  { id: 1, label: "Le moment" },
  { id: 2, label: "Le créneau" },
  { id: 3, label: "Vos coordonnées" },
];

const OCCASIONS: readonly { value: Occasion; label: string }[] = [
  { value: "aucune", label: "Un repas, tout simplement" },
  { value: "anniversaire", label: "Un anniversaire" },
  { value: "amoureux", label: "Un dîner en amoureux" },
  { value: "affaires", label: "Un déjeuner d'affaires" },
  { value: "famille", label: "Un repas de famille" },
];

const SLOT_STYLES: Record<Slot["status"], string> = {
  free: "border-sand/20 text-cream hover:border-gold hover:bg-gold/10",
  limited: "border-gold/40 text-gold-soft hover:border-gold hover:bg-gold/15",
  full: "border-ink-line text-mist/50 line-through cursor-not-allowed",
};

function nextDates(count: number): readonly string[] {
  const today = new Date();
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(today);
    date.setDate(date.getDate() + index);
    return parisIsoDate(date);
  });
}

export function ReservationFlow({ policy }: { policy: BookingPolicy }) {
  const today = useMemo(() => parisIsoDate(), []);
  const quickDates = useMemo(() => nextDates(6), []);

  const [step, setStep] = useState<Step>(1);
  const [partySize, setPartySize] = useState(2);
  const [date, setDate] = useState(today);
  const [time, setTime] = useState<string | null>(null);

  /**
   * La requête est identifiée par sa clé « date|couverts ». Tant que le résultat
   * reçu ne porte pas la clé courante, on sait qu'un chargement est en cours :
   * aucun état de chargement n'a besoin d'être écrit à la main.
   */
  const requestKey = `${date}|${partySize}`;
  const [result, setResult] = useState<{
    key: string;
    availability: Availability | null;
    error: string | null;
  } | null>(null);

  const loadingSlots = result?.key !== requestKey;
  const availability = result?.key === requestKey ? result.availability : null;
  const loadError = result?.key === requestKey ? result.error : null;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    occasion: "aucune" as Occasion,
    notes: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [reservation, setReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    let cancelled = false;

    api.reservation.availability({ date, partySize }).then((response) => {
      if (cancelled) return;
      setResult({
        key: `${date}|${partySize}`,
        availability: response.ok ? response.data : null,
        error: response.ok ? null : response.error.message,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [date, partySize]);

  /** Changer de jour ou de tablée invalide le créneau déjà choisi. */
  function chooseDate(value: string) {
    setDate(value);
    setTime(null);
  }

  function choosePartySize(value: number) {
    setPartySize(value);
    setTime(null);
  }

  const openSlots = availability?.windows.flatMap((window) => window.slots) ?? [];
  const hasFreeSlot = openSlots.some((slot) => slot.status !== "full");

  async function submit() {
    if (!time) return;
    setSubmitting(true);
    setSubmitError(null);
    setFieldErrors({});

    const response = await api.reservation.create({
      date,
      time,
      partySize,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      occasion: form.occasion,
      notes: form.notes,
    });

    setSubmitting(false);

    if (response.ok) {
      setReservation(response.data);
      return;
    }

    setFieldErrors(response.error.details ?? {});
    setSubmitError(response.error.message);
  }

  if (reservation) {
    return <Confirmation reservation={reservation} onRestart={() => window.location.reload()} />;
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
      <div className="min-w-0 rounded-5xl border border-ink-line bg-ink-raised/50 p-7 sm:p-10">
        {/* Fil d'étapes */}
        <ol className="flex flex-wrap items-center gap-x-3 gap-y-2">
          {STEPS.map((entry, index) => {
            const state = entry.id === step ? "current" : entry.id < step ? "done" : "todo";
            return (
              <li key={entry.id} className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={entry.id > step}
                  onClick={() => setStep(entry.id)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-full px-3 py-1.5 text-sm transition-colors duration-300",
                    state === "current" && "bg-gold/15 text-gold-soft",
                    state === "done" && "text-sand/75 hover:text-cream",
                    state === "todo" && "cursor-not-allowed text-mist/60",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full border text-[11px]",
                      state === "current" && "border-gold text-gold",
                      state === "done" && "border-gold/50 bg-gold/20 text-gold-soft",
                      state === "todo" && "border-ink-line",
                    )}
                  >
                    {state === "done" ? "✓" : entry.id}
                  </span>
                  {entry.label}
                </button>
                {index < STEPS.length - 1 ? (
                  <span className="hidden h-px w-8 bg-ink-line sm:block" aria-hidden="true" />
                ) : null}
              </li>
            );
          })}
        </ol>

        <div className="mt-9">
          {step === 1 ? (
            <StepMoment
              partySize={partySize}
              onPartySize={choosePartySize}
              date={date}
              onDate={chooseDate}
              today={today}
              quickDates={quickDates}
              policy={policy}
              onNext={() => setStep(2)}
            />
          ) : null}

          {step === 2 ? (
            <StepSlot
              availability={availability}
              loading={loadingSlots}
              error={loadError}
              time={time}
              onTime={(value) => {
                setTime(value);
                setStep(3);
              }}
              onBack={() => setStep(1)}
              hasFreeSlot={hasFreeSlot}
            />
          ) : null}

          {step === 3 ? (
            <StepDetails
              form={form}
              onChange={(patch) => setForm((current) => ({ ...current, ...patch }))}
              errors={fieldErrors}
              submitError={submitError}
              submitting={submitting}
              onBack={() => setStep(2)}
              onSubmit={submit}
            />
          ) : null}
        </div>
      </div>

      <Summary
        date={date}
        partySize={partySize}
        time={time}
        policy={policy}
        windowLabel={
          availability?.windows.find((window) => window.slots.some((slot) => slot.time === time))
            ?.label ?? null
        }
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Étape 1 — couverts et date                                                  */
/* -------------------------------------------------------------------------- */

function StepMoment({
  partySize,
  onPartySize,
  date,
  onDate,
  today,
  quickDates,
  policy,
  onNext,
}: {
  partySize: number;
  onPartySize: (value: number) => void;
  date: string;
  onDate: (value: string) => void;
  today: string;
  quickDates: readonly string[];
  policy: BookingPolicy;
  onNext: () => void;
}) {
  const sizes = Array.from({ length: policy.maxPartySizeOnline }, (_, index) => index + 1);

  return (
    <div>
      <h2 className="font-display text-3xl text-cream">Combien serez-vous ?</h2>
      <div className="mt-6 flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onPartySize(size)}
            aria-pressed={partySize === size}
            className={cn(
              "h-12 w-12 rounded-full border text-sm transition-all duration-300",
              partySize === size
                ? "border-gold bg-gold text-ink"
                : "border-sand/20 text-sand hover:border-gold/60 hover:text-cream",
            )}
          >
            {size}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-mist">
        Au-delà de {policy.maxPartySizeOnline} couverts, écrivez-nous : la grande tablée se réserve à
        la main.
      </p>

      <h2 className="mt-12 font-display text-3xl text-cream">Quel jour ?</h2>
      <div className="mt-6 -mx-1 flex gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {quickDates.map((value) => {
          const label = formatLongDate(value).split(" ");
          return (
            <button
              key={value}
              type="button"
              onClick={() => onDate(value)}
              aria-pressed={date === value}
              className={cn(
                "flex shrink-0 flex-col items-center gap-1 rounded-2xl border px-5 py-3 transition-all duration-300",
                date === value
                  ? "border-gold bg-gold/12 text-cream"
                  : "border-sand/15 text-sand/75 hover:border-sand/40 hover:text-cream",
              )}
            >
              <span className="text-[11px] tracking-[0.14em] uppercase">{label[0]}</span>
              <span className="font-display text-2xl">{label[1]}</span>
              <span className="text-[11px] text-mist">{label[2]}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 max-w-xs">
        <Field label="Ou choisissez une date" htmlFor="date-choisie">
          <Input
            id="date-choisie"
            type="date"
            value={date}
            min={today}
            onChange={(event) => onDate(event.target.value)}
            className="[color-scheme:dark]"
          />
        </Field>
      </div>

      <div className="mt-10 flex justify-end">
        <Button onClick={onNext} size="lg">
          Voir les créneaux
          <ArrowIcon />
        </Button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Étape 2 — créneaux                                                          */
/* -------------------------------------------------------------------------- */

function StepSlot({
  availability,
  loading,
  error,
  time,
  onTime,
  onBack,
  hasFreeSlot,
}: {
  availability: Availability | null;
  loading: boolean;
  error: string | null;
  time: string | null;
  onTime: (value: string) => void;
  onBack: () => void;
  hasFreeSlot: boolean;
}) {
  return (
    <div>
      <h2 className="font-display text-3xl text-cream">À quelle heure ?</h2>

      {loading ? (
        <div className="mt-8 space-y-6" aria-live="polite">
          {[0, 1].map((block) => (
            <div key={block}>
              <div className="h-3 w-24 animate-pulse rounded-full bg-ink-hover" />
              <div className="mt-4 flex flex-wrap gap-2">
                {Array.from({ length: 8 }, (_, index) => (
                  <div
                    key={index}
                    className="h-11 w-20 animate-pulse rounded-full bg-ink-hover"
                    style={{ animationDelay: `${index * 60}ms` }}
                  />
                ))}
              </div>
            </div>
          ))}
          <p className="sr-only">Recherche des disponibilités…</p>
        </div>
      ) : error ? (
        <p className="mt-8 rounded-2xl border border-ember/40 bg-ember/10 p-5 text-sm text-cream">
          {error}
        </p>
      ) : availability && !availability.open ? (
        <div className="mt-8 rounded-2xl border border-ink-line bg-ink p-7">
          <p className="font-display text-2xl text-cream">C&apos;est fermé ce jour-là.</p>
          <p className="mt-2 text-sm text-sand/70">{availability.closedReason}</p>
        </div>
      ) : availability && !hasFreeSlot ? (
        <div className="mt-8 rounded-2xl border border-ink-line bg-ink p-7">
          <p className="font-display text-2xl text-cream">Complet pour cette table.</p>
          <p className="mt-2 text-sm text-sand/70">
            Essayez un autre jour, ou réduisez le nombre de couverts. Le comptoir garde neuf places
            sans réservation.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-9">
          {availability?.windows.map((window) => (
            <div key={window.id}>
              <div className="flex items-baseline justify-between">
                <h3 className="text-[11px] tracking-[0.24em] text-gold uppercase">{window.label}</h3>
                <span className="text-xs text-mist">
                  {window.slots.filter((slot) => slot.status !== "full").length} créneaux libres
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {window.slots.map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={slot.status === "full"}
                    onClick={() => onTime(slot.time)}
                    aria-pressed={time === slot.time}
                    title={
                      slot.status === "full"
                        ? "Complet"
                        : `${slot.seatsLeft} places restantes sur ce créneau`
                    }
                    className={cn(
                      "h-11 rounded-full border px-5 text-sm transition-all duration-300",
                      SLOT_STYLES[slot.status],
                      time === slot.time && "border-gold bg-gold text-ink",
                    )}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <p className="text-xs text-mist">
            Les créneaux en doré sont presque complets. Cliquez pour continuer.
          </p>
        </div>
      )}

      <div className="mt-10">
        <Button onClick={onBack} variant="ghost">
          Revenir au jour
        </Button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Étape 3 — coordonnées                                                       */
/* -------------------------------------------------------------------------- */

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  occasion: Occasion;
  notes: string;
}

function StepDetails({
  form,
  onChange,
  errors,
  submitError,
  submitting,
  onBack,
  onSubmit,
}: {
  form: FormState;
  onChange: (patch: Partial<FormState>) => void;
  errors: Record<string, string>;
  submitError: string | null;
  submitting: boolean;
  onBack: () => void;
  onSubmit: () => void;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      noValidate
    >
      <h2 className="font-display text-3xl text-cream">Qui réserve ?</h2>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Field label="Prénom" htmlFor="prenom" error={errors.firstName}>
          <Input
            id="prenom"
            name="given-name"
            autoComplete="given-name"
            value={form.firstName}
            invalid={Boolean(errors.firstName)}
            onChange={(event) => onChange({ firstName: event.target.value })}
            placeholder="Camille"
          />
        </Field>
        <Field label="Nom" htmlFor="nom" error={errors.lastName}>
          <Input
            id="nom"
            name="family-name"
            autoComplete="family-name"
            value={form.lastName}
            invalid={Boolean(errors.lastName)}
            onChange={(event) => onChange({ lastName: event.target.value })}
            placeholder="Rousseau"
          />
        </Field>
        <Field label="E-mail" htmlFor="email" error={errors.email}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={form.email}
            invalid={Boolean(errors.email)}
            onChange={(event) => onChange({ email: event.target.value })}
            placeholder="camille@exemple.fr"
          />
        </Field>
        <Field label="Téléphone" htmlFor="telephone" error={errors.phone}>
          <Input
            id="telephone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            invalid={Boolean(errors.phone)}
            onChange={(event) => onChange({ phone: event.target.value })}
            placeholder="06 12 34 56 78"
          />
        </Field>
        <Field label="L'occasion" htmlFor="occasion" className="sm:col-span-2">
          <Select
            id="occasion"
            value={form.occasion}
            onChange={(event) => onChange({ occasion: event.target.value as Occasion })}
          >
            {OCCASIONS.map((occasion) => (
              <option key={occasion.value} value={occasion.value} className="bg-ink">
                {occasion.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field
          label="Un mot pour la cuisine"
          htmlFor="notes"
          hint="Allergies, régime, poussette, table au calme…"
          error={errors.notes}
          className="sm:col-span-2"
        >
          <Textarea
            id="notes"
            rows={4}
            maxLength={400}
            value={form.notes}
            invalid={Boolean(errors.notes)}
            onChange={(event) => onChange({ notes: event.target.value })}
            placeholder="Une allergie aux fruits à coque dans le groupe."
          />
        </Field>
      </div>

      {submitError ? (
        <p
          role="alert"
          className="mt-6 rounded-2xl border border-ember/40 bg-ember/10 p-4 text-sm text-cream"
        >
          {submitError}
        </p>
      ) : null}

      <div className="mt-9 flex flex-wrap items-center justify-between gap-4">
        <Button type="button" onClick={onBack} variant="ghost">
          Changer de créneau
        </Button>
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? "Envoi en cours…" : "Confirmer la réservation"}
          {submitting ? null : <ArrowIcon />}
        </Button>
      </div>
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/* Récapitulatif                                                               */
/* -------------------------------------------------------------------------- */

function Summary({
  date,
  partySize,
  time,
  windowLabel,
  policy,
}: {
  date: string;
  partySize: number;
  time: string | null;
  windowLabel: string | null;
  policy: BookingPolicy;
}) {
  return (
    <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
      <div className="rounded-5xl border border-ink-line bg-ink-raised/50 p-7 sm:p-8">
        <p className="text-[11px] tracking-[0.24em] text-gold uppercase">Votre table</p>

        <dl className="mt-7 space-y-5">
          <div>
            <dt className="text-xs text-mist">Le jour</dt>
            <dd className="mt-1 font-display text-2xl text-cream first-letter:uppercase">
              {formatLongDate(date)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-mist">Les convives</dt>
            <dd className="mt-1 font-display text-2xl text-cream">
              {partySize} {partySize > 1 ? "couverts" : "couvert"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-mist">L&apos;heure</dt>
            <dd className="mt-1 font-display text-2xl text-cream">
              {time ? (
                <>
                  {time}
                  {windowLabel ? (
                    <span className="ml-2 text-sm text-gold">{windowLabel}</span>
                  ) : null}
                </>
              ) : (
                <span className="text-mist">à choisir</span>
              )}
            </dd>
          </div>
        </dl>

        <ul className="mt-8 space-y-3 border-t border-ink-line pt-6">
          {policy.notes.map((note) => (
            <li key={note} className="flex gap-3 text-xs leading-relaxed text-mist">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold/70" aria-hidden="true" />
              {note}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/* Confirmation                                                                */
/* -------------------------------------------------------------------------- */

function Confirmation({
  reservation,
  onRestart,
}: {
  reservation: Reservation;
  onRestart: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl rounded-5xl border border-gold/30 bg-ink-raised/60 p-9 text-center sm:p-14">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/50 text-2xl text-gold">
        ✓
      </span>
      <h2 className="mt-8 font-display text-[clamp(2rem,5vw,3rem)] leading-[1.05]">
        C&apos;est noté,
        <span className="text-gold italic"> {reservation.firstName}.</span>
      </h2>
      <p className="mt-4 text-base leading-relaxed text-sand/75">
        Un e-mail de confirmation part à l&apos;instant vers {reservation.email}. À très vite rue des
        Trois Bornes.
      </p>

      <dl className="mt-10 grid gap-px overflow-hidden rounded-4xl border border-ink-line bg-ink-line text-left sm:grid-cols-2">
        {[
          { label: "Référence", value: reservation.reference },
          { label: "Le jour", value: formatLongDate(reservation.date) },
          { label: "L'heure", value: reservation.time },
          { label: "Les convives", value: `${reservation.partySize} couverts` },
          { label: "Installation", value: reservation.table },
          { label: "Statut", value: "Confirmée" },
        ].map((item) => (
          <div key={item.label} className="bg-ink px-6 py-5">
            <dt className="text-[11px] tracking-[0.18em] text-mist uppercase">{item.label}</dt>
            <dd className="mt-1.5 font-display text-xl text-cream first-letter:uppercase">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      {reservation.notes ? (
        <p className="mt-6 rounded-2xl border border-ink-line bg-ink p-5 text-left text-sm leading-relaxed text-sand/70">
          <span className="text-mist">Votre mot à la cuisine : </span>
          {reservation.notes}
        </p>
      ) : null}

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/carte" size="lg">
          Découvrir la carte
          <ArrowIcon />
        </ButtonLink>
        <Button onClick={onRestart} variant="outline" size="lg">
          Réserver une autre table
        </Button>
      </div>
    </div>
  );
}
