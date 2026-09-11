import type { ServiceErrorBody, ServiceErrorCode } from "./types";

/** Erreur métier transportable d'un service vers son appelant. */
export class ServiceError extends Error {
  readonly code: ServiceErrorCode;
  readonly details?: Record<string, string>;

  constructor(code: ServiceErrorCode, message: string, details?: Record<string, string>) {
    super(message);
    this.name = "ServiceError";
    this.code = code;
    this.details = details;
  }

  toBody(): ServiceErrorBody {
    return { code: this.code, message: this.message, details: this.details };
  }

  static notFound(message: string) {
    return new ServiceError("NOT_FOUND", message);
  }

  static validation(message: string, details?: Record<string, string>) {
    return new ServiceError("VALIDATION_FAILED", message, details);
  }
}

export function toErrorBody(error: unknown): ServiceErrorBody {
  if (error instanceof ServiceError) return error.toBody();
  return {
    code: "INTERNAL",
    message: error instanceof Error ? error.message : "Erreur interne du service",
  };
}
