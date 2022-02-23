import type { ReactNode } from "react";
import { Provider as ReactReduxProvider } from "react-redux";
import { useAsync } from "react-async-hook";
import { createStore } from "core";
import memoize from "memoizee";
import { getConfiguration } from "configuration";
import { injectTransferableEnvsInSearchParams } from "ui/envCarriedOverToKc";
import { injectGlobalStatesInSearchParams } from "powerhooks/useGlobalState";
import { injectTosInSearchParams } from "ui/termsOfServices";

//NOTE: Create store can only be called once
const createStore_memo = memoize(
    () =>
        createStore({
            ...getConfiguration(),
            "transformUrlBeforeRedirectToLogin": ({ url, termsOfServices }) =>
                [url]
                    .map(injectTransferableEnvsInSearchParams)
                    .map(injectGlobalStatesInSearchParams)
                    .map(url => injectTosInSearchParams({ url, termsOfServices }))[0],
        }),
    { "promise": true },
);

type Props = {
    children: ReactNode;
};

export function CoreProvider(props: Props) {
    const { children } = props;

    const asyncCreateStore = useAsync(() => createStore_memo(), []);

    if (asyncCreateStore.error) {
        throw asyncCreateStore.error;
    }

    const { result: store } = asyncCreateStore;

    return store === undefined ? null : (
        <ReactReduxProvider store={store}>{children}</ReactReduxProvider>
    );
}
