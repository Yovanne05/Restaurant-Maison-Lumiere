import { ServiceError } from "./errors";
import { selectTransport } from "./transport";
import type { ServiceName, ServiceRequest, ServiceResponse } from "./types";

let counter = 0;

function nextRequestId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  counter += 1;
  return `req_${counter.toString(36)}`;
}

/** Construit l'enveloppe de requête puis la confie au transport actif. */
export async function dispatch<TData>(
  service: ServiceName,
  operation: string,
  payload: unknown = {},
): Promise<ServiceResponse<TData>> {
  const request: ServiceRequest = {
    service,
    operation,
    payload,
    requestId: nextRequestId(),
    issuedAt: new Date().toISOString(),
  };

  return selectTransport().send<TData>(request);
}

/**
 * Variante « unwrap » : renvoie directement la donnée ou lève une ServiceError.
 * Pratique dans les Server Components où l'on veut laisser remonter l'erreur.
 */
export async function invoke<TData>(
  service: ServiceName,
  operation: string,
  payload: unknown = {},
): Promise<TData> {
  const response = await dispatch<TData>(service, operation, payload);
  if (!response.ok) {
    throw new ServiceError(response.error.code, response.error.message, response.error.details);
  }
  return response.data;
}
