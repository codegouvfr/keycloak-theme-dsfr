import type { routes } from "ui/routes";
import type { Extends } from "tsafe";
import { assert } from "tsafe/assert";

export type CatalogPageName = "catalog" | "serviceCatalog";

assert<Extends<CatalogPageName, keyof typeof routes>>();

let previousCatalog: CatalogPageName | undefined = undefined;

export function setPreviousCatalog(catalogPageName: CatalogPageName) {
    previousCatalog = catalogPageName;
}

export function getPreviousCatalog() {
    return previousCatalog;
}
