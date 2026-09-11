import { forward } from "@/gateway/client";
import { listServices } from "@/services/mesh";
import type { ServiceName } from "@/services/kernel";

/**
 * Arête HTTP de la gateway.
 *
 * Le site n'en a pas besoin — il parle au mesh in-process. Elle existe pour
 * que les contrats soient déjà adressables en HTTP le jour où les services
 * partiront dans leurs propres conteneurs.
 *
 *   GET  /api/menu/listSignatures?limit=3
 *   POST /api/reservation/getAvailability  { "date": "2026-09-18", "partySize": 2 }
 */

type RouteContext = { params: Promise<{ service: string; operation: string }> };

function isKnownService(name: string): name is ServiceName {
  return listServices().some((service) => service.name === name);
}

async function handle(service: string, operation: string, payload: unknown) {
  if (!isKnownService(service)) {
    return Response.json(
      { ok: false, error: { code: "UNKNOWN_SERVICE", message: `Service « ${service} » inconnu.` } },
      { status: 404 },
    );
  }

  const response = await forward(service, operation, payload);
  const status = response.ok
    ? 200
    : response.error.code === "NOT_FOUND"
      ? 404
      : response.error.code === "VALIDATION_FAILED"
        ? 422
        : response.error.code === "UNAVAILABLE"
          ? 409
          : 500;

  return Response.json(response, { status });
}

export async function GET(request: Request, context: RouteContext) {
  const { service, operation } = await context.params;
  const payload = Object.fromEntries(new URL(request.url).searchParams);
  return handle(service, operation, payload);
}

export async function POST(request: Request, context: RouteContext) {
  const { service, operation } = await context.params;
  const payload = await request.json().catch(() => ({}));
  return handle(service, operation, payload);
}
