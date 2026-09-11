import { ServiceError } from "./errors";
import type { ServiceDefinition, ServiceName } from "./types";

/**
 * Annuaire de services (service discovery).
 * Le mesh in-process se contente d'une Map ; une implémentation HTTP
 * remplacerait cette couche par un appel à Consul / DNS / un registre cloud.
 */
const registry = new Map<ServiceName, ServiceDefinition>();

export function registerService(definition: ServiceDefinition): ServiceDefinition {
  registry.set(definition.name, definition);
  return definition;
}

export function resolveService(name: ServiceName): ServiceDefinition {
  const definition = registry.get(name);
  if (!definition) {
    throw new ServiceError("UNKNOWN_SERVICE", `Service « ${name} » introuvable dans le mesh.`);
  }
  return definition;
}

export function listServices(): ServiceDefinition[] {
  return [...registry.values()];
}
