import type { RefObject } from "react";
import { useConstCallback } from "powerhooks/useConstCallback";
import { Evt } from "evt";
import { useDomRect } from "powerhooks/useDomRect";
import { useElementEvt } from "evt/hooks/useElementEvt";
import { useConst } from "powerhooks/useConst";

export function useOnLoadMore(props: {
    scrollableDivRef: RefObject<any>;
    loadingDivRef: RefObject<any>;
    onLoadMore: () => void;
}) {
    const { scrollableDivRef, loadingDivRef, onLoadMore } = props;

    const {
        domRect: { height: loadingDivHeight },
    } = useDomRect({ "ref": loadingDivRef });

    const { onLoadMoreOnce } = (function useClosure() {
        const onLoadMoreConst = useConstCallback(onLoadMore);

        const onLoadMoreOnce = useConst(() => {
            let lastScrollHeight: number | undefined = undefined;

            return (scrollHeight: number) => {
                if (lastScrollHeight === scrollHeight) {
                    return;
                }

                lastScrollHeight = scrollHeight;

                onLoadMoreConst();
            };
        });

        return { onLoadMoreOnce };
    })();

    useElementEvt(
        ({ ctx, element, registerSideEffect }) => {
            if (loadingDivHeight === 0) {
                return;
            }

            Evt.from(ctx, element, "scroll")
                .toStateful()
                .attach(() => {
                    const { scrollTop, clientHeight, scrollHeight } = element;

                    const rest = scrollHeight - (scrollTop + clientHeight);

                    if (rest < loadingDivHeight) {
                        registerSideEffect(() => onLoadMoreOnce(scrollHeight));
                    }
                });
        },
        scrollableDivRef,
        [loadingDivHeight],
    );
}
