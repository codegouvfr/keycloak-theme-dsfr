import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Provider as ReactReduxProvider } from "react-redux";
import { createStore } from "core";
import { getConfiguration } from "configuration";
import { injectTransferableEnvsInSearchParams } from "ui/envCarriedOverToKc";
import { injectGlobalStatesInSearchParams } from "powerhooks/useGlobalState";
import { injectTosInSearchParams } from "ui/termsOfServices";
import type { ReturnType } from "tsafe";

type Props = {
    children: ReactNode;
};

export function CoreProvider(props: Props) {
    const { children } = props;

    const [store, setStore] = useState<ReturnType<typeof createStore> | undefined>(
        undefined,
    );

    useEffect(() => {
        createStore({
            ...getConfiguration(),
            "transformUrlBeforeRedirectToLogin": ({ url, termsOfServices }) =>
                [url]
                    .map(injectTransferableEnvsInSearchParams)
                    .map(injectGlobalStatesInSearchParams)
                    .map(url => injectTosInSearchParams({ url, termsOfServices }))[0],
        }).then(setStore);
    }, []);

    if (store === undefined) {
        return null;
    }

    return <ReactReduxProvider store={store}>{children}</ReactReduxProvider>;
}
