# Maison Lumière

Site vitrine d'un restaurant **fictif** — bistronomie de quartier, Paris 11e. Next.js 16 (App Router),
React 19, Tailwind CSS 4, TypeScript strict.

Le site est écrit selon une **orientation micro-services**, mais sans backend : les services tournent
dans le même runtime que l'application. Les contrats, eux, sont déjà ceux d'un système distribué, ce
qui permet de sortir n'importe quel service derrière une API HTTP sans toucher à l'interface.

## Démarrer

```bash
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

## Architecture

```
services/                  Les micro-services. Aucun ne connaît l'interface.
  kernel/                  Noyau commun : enveloppes, annuaire, transports, broker
    types.ts               ServiceRequest / ServiceResponse / ServiceDefinition
    registry.ts            Annuaire (service discovery)
    transport.ts           in-process aujourd'hui, HTTP le jour venu
    broker.ts              dispatch() et invoke()
  menu-service/            Carte, catégories, filtres, plats signatures
  reservation-service/     Disponibilités, règles de réservation, création
  content-service/         Identité, horaires, histoire, galerie, FAQ, équipe
  review-service/          Avis clients et statistiques
  mesh.ts                  Amorçage : enregistre tous les services

gateway/
  client.ts                Façade typée. Seule porte d'entrée de l'interface.

app/api/[service]/[operation]/route.ts
                           Arête HTTP de la gateway (inutilisée par le site)

packages/ui/               Design system sans connaissance métier
components/                Composants de fonctionnalité, un dossier par domaine
lib/                       Utilitaires transverses (fuseau Europe/Paris)
app/                       Le shell : routage, layout, composition des pages
```

### Les règles qui tiennent l'ensemble

1. **Aucun composant n'importe un service.** Tout passe par `api` dans `gateway/client.ts`.
2. **Chaque service possède ses données.** Le planning des réservations est volontairement
   dupliqué entre `reservation-service` et `content-service` : ce sont deux responsabilités
   distinctes, qui n'évoluent pas au même rythme.
3. **Le transport est interchangeable.** `selectTransport()` choisit l'implémentation in-process
   ou HTTP selon `NEXT_PUBLIC_SERVICE_GATEWAY_URL`. Le reste du code ne voit pas la différence.
4. **Toute réponse porte une enveloppe.** `{ ok, data | error, meta }` avec identifiant de requête,
   durée et version du service.

### Appeler un service

```ts
import { api } from "@/gateway/client";

const signatures = await api.menu.signatures(4); // lève une ServiceError en cas d'échec
const slots = await api.reservation.availability({ date: "2026-09-18", partySize: 2 });
if (slots.ok) console.log(slots.data.windows); // enveloppe complète, pour l'affichage des erreurs
```

Les mêmes opérations sont adressables en HTTP :

```bash
curl "http://localhost:3000/api/menu/listSignatures?limit=3"
curl -X POST http://localhost:3000/api/reservation/getAvailability \
  -H 'content-type: application/json' \
  -d '{"date":"2026-09-18","partySize":2}'
```

### Passer à un vrai backend

Les données de démonstration vivent dans `seed.ts` (menu) et en tête des fichiers de service. Pour
brancher une API réelle :

1. Déployer le service derrière une gateway HTTP.
2. Renseigner `NEXT_PUBLIC_SERVICE_GATEWAY_URL`.
3. Supprimer le fichier de données du service concerné.

Aucune page, aucun composant n'a besoin d'être modifié.

## Pages

| Route       | Contenu                                                            |
| ----------- | ------------------------------------------------------------------ |
| `/`         | Accueil : hero, signatures, manifeste, expériences, galerie, avis  |
| `/carte`    | Carte filtrable (catégorie, étiquettes, recherche plein texte)      |
| `/maison`   | Histoire, principes, équipe, galerie                                |
| `/reserver` | Parcours de réservation en trois étapes, avec créneaux en direct    |
| `/contact`  | Horaires, accès, questions fréquentes                               |

## Notes

- **État de la réservation.** Les réservations créées sont stockées en mémoire et disparaissent au
  rechargement. C'est volontaire tant qu'il n'y a pas de persistance.
- **Disponibilités.** Elles sont dérivées d'un hachage stable de la date et de l'heure, pour que le
  serveur et le navigateur affichent exactement les mêmes créneaux.
- **Animations.** Les apparitions au défilement ne s'activent que si le JavaScript démarre, et sont
  désactivées sous `prefers-reduced-motion`.
- **Photographies.** Unsplash, téléchargées dans `public/media/`. Établissement, adresse, téléphone,
  équipe et avis sont inventés.
