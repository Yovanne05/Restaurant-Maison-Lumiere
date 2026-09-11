import { toErrorBody } from "./errors";
import { ServiceError } from "./errors";
import { resolveService } from "./registry";
import type { ServiceRequest, ServiceResponse, Transport } from "./types";

const wait = (ms: number) => (ms > 0 ? new Promise((resolve) => setTimeout(resolve, ms)) : null);

/**
 * Transport in-process : les services tournent dans le même runtime que l'app.
 * C'est le mode « pas de backend » — les contrats restent identiques.
 */
export const inProcessTransport: Transport = {
  kind: "in-process",
  async send<TData>(request: ServiceRequest): Promise<ServiceResponse<TData>> {
    const startedAt = Date.now();
    const base = {
      requestId: request.requestId,
      service: request.service,
      operation: request.operation,
      transport: "in-process" as const,
    };

    try {
      const definition = resolveService(request.service);
      const handler = definition.operations[request.operation];

      if (!handler) {
        throw new ServiceError(
          "UNKNOWN_OPERATION",
          `Opération « ${request.service}.${request.operation} » inconnue.`,
        );
      }

      await wait(definition.latencyMs);

      const data = (await handler(request.payload, {
        requestId: request.requestId,
        service: request.service,
        operation: request.operation,
      })) as TData;

      return {
        ok: true,
        data,
        meta: { ...base, durationMs: Date.now() - startedAt, version: definition.version },
      };
    } catch (error) {
      return {
        ok: false,
        error: toErrorBody(error),
        meta: { ...base, durationMs: Date.now() - startedAt, version: "unknown" },
      };
    }
  },
};

/**
 * Transport HTTP : prêt pour le jour où les services seront déployés
 * séparément derrière la gateway. Activé par NEXT_PUBLIC_SERVICE_GATEWAY_URL.
 */
export function createHttpTransport(baseUrl: string): Transport {
  return {
    kind: "http",
    async send<TData>(request: ServiceRequest): Promise<ServiceResponse<TData>> {
      const startedAt = Date.now();
      const base = {
        requestId: request.requestId,
        service: request.service,
        operation: request.operation,
        transport: "http" as const,
      };

      try {
        const response = await fetch(`${baseUrl}/${request.service}/${request.operation}`, {
          method: "POST",
          headers: { "content-type": "application/json", "x-request-id": request.requestId },
          body: JSON.stringify(request.payload ?? {}),
        });
        return (await response.json()) as ServiceResponse<TData>;
      } catch (error) {
        return {
          ok: false,
          error: toErrorBody(error),
          meta: { ...base, durationMs: Date.now() - startedAt, version: "unknown" },
        };
      }
    },
  };
}

export function selectTransport(): Transport {
  const gatewayUrl = process.env.NEXT_PUBLIC_SERVICE_GATEWAY_URL;
  return gatewayUrl ? createHttpTransport(gatewayUrl) : inProcessTransport;
}
