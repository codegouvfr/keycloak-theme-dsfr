import { assert } from "tsafe/assert";

export function getScrollableParent(element: HTMLElement): HTMLElement {
    const parentElement = element.parentElement;

    if (parentElement === null) {
        assert(getComputedStyle(element).overflow !== "hidden", "No scrollable parent");

        return element;
    }

    if (["auto", "scroll"].includes(getComputedStyle(parentElement).overflow)) {
        return parentElement;
    }

    return getScrollableParent(parentElement);
}
