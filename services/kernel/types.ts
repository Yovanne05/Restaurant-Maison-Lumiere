/**
 * Noyau commun à tous les micro-services.
 *
 * Chaque service expose un contrat (opérations typées) et ignore totalement
 * qui l'appelle. Le transport est interchangeable : aujourd'hui in-process,
 * demain HTTP vers un vrai backend, sans toucher au code applicatif.
 */

export type ServiceName = "menu" | "reservation" | "content" | "review";

/** Enveloppe standard d'une requête inter-services. */
export interface ServiceRequest<TPayload = unknown> {
  readonly service: ServiceName;
  readonly operation: string;
  readonly payload: TPayload;
  readonly requestId: string;
  readonly issuedAt: string;
}

/** Métadonnées renvoyées avec chaque réponse (observabilité). */
export interface ResponseMeta {
  readonly requestId: string;
  readonly service: ServiceName;
  readonly operation: string;
  readonly durationMs: number;
  readonly transport: TransportKind;
  readonly version: string;
}

export interface ServiceErrorBody {
  readonly code: ServiceErrorCode;
  readonly message: string;
  readonly details?: Record<string, string>;
}

export type ServiceErrorCode =
  | "NOT_FOUND"
  | "VALIDATION_FAILED"
  | "UNAVAILABLE"
  | "UNKNOWN_OPERATION"
  | "UNKNOWN_SERVICE"
  | "INTERNAL";

export type ServiceResponse<TData> =
  | { readonly ok: true; readonly data: TData; readonly meta: ResponseMeta }
  | { readonly ok: false; readonly error: ServiceErrorBody; readonly meta: ResponseMeta };

export type TransportKind = "in-process" | "http";

/**
 * Un handler d'opération : payload -> data.
 * Les erreurs métier remontent en levant une ServiceError.
 * Le payload est volontairement non typé ici : c'est le contrat de chaque
 * service (et la façade typée de la gateway) qui garantit la forme des données.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type OperationHandler = (payload: any, context: OperationContext) => unknown;

export interface OperationContext {
  readonly requestId: string;
  readonly service: ServiceName;
  readonly operation: string;
}

/** Définition d'un micro-service enregistré dans le mesh. */
export interface ServiceDefinition {
  readonly name: ServiceName;
  readonly version: string;
  /** Latence simulée (ms) pour approcher le comportement d'un vrai réseau. */
  readonly latencyMs: number;
  readonly operations: Readonly<Record<string, OperationHandler>>;
}

export interface Transport {
  readonly kind: TransportKind;
  send<TData>(request: ServiceRequest): Promise<ServiceResponse<TData>>;
}
