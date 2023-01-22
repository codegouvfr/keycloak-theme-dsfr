/* eslint-disable react-hooks/rules-of-hooks */
import type { Action, ThunkAction as ReduxGenericThunkAction } from "@reduxjs/toolkit";
import { createCoreFromUsecases } from "redux-clean-architecture";
import type { GenericCreateEvt, GenericThunks } from "redux-clean-architecture";
import { usecases } from "./usecases";
import type { ReturnType } from "tsafe/ReturnType";

type CoreParams = {};

export async function createCore(params: CoreParams) {
    const {} = params;

    const thunksExtraArgument = {
        "createCoreParams": params,
    };

    const core = createCoreFromUsecases({
        thunksExtraArgument,
        usecases,
    });

    await core.dispatch(usecases.softwareCatalog.privateThunks.initialize());

    return core;
}

export type Core = ReturnType<typeof createCore>;

export type State = ReturnType<Core["getState"]>;

export type ThunksExtraArgument = Core["thunksExtraArgument"];

/** @deprecated: Use Thunks as soon as we cas use 'satisfy' from TS 4.9 */
export type ThunkAction<RtnType = Promise<void>> = ReduxGenericThunkAction<
    RtnType,
    State,
    ThunksExtraArgument,
    Action<string>
>;

export type Thunks = GenericThunks<Core>;

export type CreateEvt = GenericCreateEvt<Core>;
