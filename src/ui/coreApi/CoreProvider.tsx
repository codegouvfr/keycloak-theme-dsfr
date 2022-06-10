import type { ReactNode } from "react";
import { useEffect } from "react";
import { Provider as ReactReduxProvider } from "react-redux";
import { createStore } from "core";
import { getConfiguration } from "configuration";
import { injectTransferableEnvsInSearchParams } from "ui/valuesCarriedOverToKc/env";
import { injectGlobalStatesInSearchParams } from "powerhooks/useGlobalState";
import { injectTosInSearchParams } from "ui/valuesCarriedOverToKc/termsOfServices";
import { addParamToUrl } from "powerhooks/tools/urlSearchParams";
import type { ReturnType } from "tsafe";
import { Evt } from "evt";
import { useRerenderOnStateChange } from "evt/hooks";
import { evtLang } from "ui/i18n";

type Props = {
    children: ReactNode;
};

const evtStore = Evt.create<ReturnType<typeof createStore> | undefined>(undefined);

export function CoreProvider(props: Props) {
    const { children } = props;

    useRerenderOnStateChange(evtStore);

    const store = evtStore.state;

    useEffect(() => {
        if (store !== undefined) {
            return;
        }

        createStore({
            ...getConfiguration(),
            "transformUrlBeforeRedirectToLogin": ({ url, termsOfServices }) =>
                [url]
                    .map(injectTransferableEnvsInSearchParams)
                    .map(injectGlobalStatesInSearchParams)
                    .map(
                        url =>
                            addParamToUrl({
                                url,
                                "name": "ui_locales",
                                "value": evtLang.state,
                            }).newUrl,
                    )
                    .map(url => injectTosInSearchParams({ url, termsOfServices }))[0],
            "evtUserActivity": Evt.merge([
                Evt.from(document, "mousemove"),
                Evt.from(document, "keydown"),
            ]).pipe(() => [undefined as void]),
        }).then(store => (evtStore.state = store));
    }, []);

    if (store === undefined) {
        return null;
    }

    //TODO: Children should not be any
    return <ReactReduxProvider store={store}>{children as any}</ReactReduxProvider>;
}
