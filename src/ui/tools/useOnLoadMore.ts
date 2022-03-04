import type { RefObject } from "react";
import { useConstCallback } from "powerhooks/useConstCallback";
import { Evt } from "evt";
import { useDomRect } from "powerhooks/useDomRect";
import { useEvt } from "evt/hooks/useEvt";
import { useConst } from "powerhooks/useConst";
import { getScrollableParent } from "./getScrollableParent";
import { assert } from "tsafe/assert";
import { is } from "tsafe/is";

export function useOnLoadMore(props: {
    loadingDivRef: RefObject<any>;
    onLoadMore: () => void;
}) {
    const { loadingDivRef, onLoadMore } = props;

    assert(is<RefObject<HTMLElement>>(loadingDivRef));

    const {
        domRect: { height: loadingDivHeight },
    } = useDomRect({ "ref": loadingDivRef });

    const { onLoadMoreOnce } = (function useClosure() {
        const onLoadMoreConst = useConstCallback(onLoadMore);

        const { onLoadMoreOnce } = useConst(() => {
            let lastScrollHeight: number | undefined = undefined;

            function onLoadMoreOnce(scrollHeight: number) {
                if (lastScrollHeight === scrollHeight) {
                    return;
                }

                lastScrollHeight = scrollHeight;

                onLoadMoreConst();
            }

            return { onLoadMoreOnce };
        });

        return { onLoadMoreOnce };
    })();

    useEvt(
        (ctx, registerSideEffect) => {
            if (loadingDivHeight === 0) {
                return;
            }

            const loadingDivElement = loadingDivRef.current;

            //NOTE: If the loadingDivHeight is not 0, loadingDiv has rendered.
            assert(loadingDivElement !== null);

            const scrollElement = getScrollableParent(loadingDivElement);

            Evt.from(ctx, scrollElement, "scroll")
                .toStateful()
                .attach(() => {
                    const { scrollTop, clientHeight, scrollHeight } = scrollElement;

                    const rest = scrollHeight - (scrollTop + clientHeight);

                    if (rest < loadingDivHeight) {
                        registerSideEffect(() => onLoadMoreOnce(scrollHeight));
                    }
                });
        },
        [loadingDivHeight, loadingDivRef],
    );
}
