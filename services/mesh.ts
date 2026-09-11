/**
 * Amorçage du mesh.
 *
 * Importer ce module enregistre tous les micro-services dans l'annuaire.
 * C'est le seul endroit qui connaît la liste complète des services ;
 * l'application, elle, ne parle qu'à la gateway.
 */
import "./menu-service";
import "./reservation-service";
import "./content-service";
import "./review-service";

export { listServices } from "./kernel";
