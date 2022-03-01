import { useState, useEffect } from "react";
import { assert } from "tsafe/assert";
import { useDomRect } from "powerhooks/useDomRect";

export function useStickyTop() {
    const {
        ref: refSticky,
        domRect: { top: topSticky },
    } = useDomRect<HTMLDivElement>();

    const [top, setTop] = useState<number | undefined>(undefined);

    useEffect(() => {
        /*
			if (top !== undefined) {
				return;
			}
			*/
        if (topSticky === 0) {
            return;
        }

        assert(refSticky.current !== null);

        const { top: topScrollable } = getScrollableParent(
            refSticky.current,
        ).getBoundingClientRect();

        setTop(topSticky - topScrollable);
    }, [topSticky]);

    return { top, refSticky };
}

function getScrollableParent(element: HTMLElement): HTMLElement {
    const parentElement = element.parentElement;

    if (parentElement === null) {
        return element;
    }

    if (["auto", "scroll"].includes(getComputedStyle(parentElement).overflow)) {
        return parentElement;
    }

    return getScrollableParent(parentElement);
}
