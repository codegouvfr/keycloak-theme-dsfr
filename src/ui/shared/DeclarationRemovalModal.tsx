import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { useCoreFunctions, useCoreEvts, selectors, useCoreState } from "core";
import { Evt } from "evt";
import { useEvt } from "evt/hooks";
import { useRerenderOnStateChange } from "evt/hooks";

const wrapper = createModal({
    "name": "declarationRemoval",
    "isOpenedByDefault": false
});

type Params = {
    softwareName: string;
    declarationType: "user" | "referent";
};

const evtParams = Evt.create<Params | undefined>(undefined);

evtParams.toStateless().attach(() => wrapper.openDeclarationRemovalModal());

export function openDeclarationRemovalModal(params: {
    softwareName: string;
    declarationType: "user" | "referent";
}) {
    evtParams.state = params;
}

export function DeclarationRemovalModal() {
    const { declarationRemoval } = useCoreFunctions();
    const { evtDeclarationRemoval } = useCoreEvts();
    const { isRemovingUserDeclaration } = useCoreState(
        selectors.declarationRemoval.isRemovingUserDeclaration
    );

    useEvt(ctx =>
        evtDeclarationRemoval.attach(
            ({ action }) => action === "close modal",
            ctx,
            () => wrapper.closeDeclarationRemovalModal()
        )
    );

    useRerenderOnStateChange(evtParams);

    const params = evtParams.state;

    const { softwareName = "", declarationType = "referent" } = params ?? {};

    return (
        <wrapper.DeclarationRemovalModal
            title={`Ne plus être ${declarationType} pour ${softwareName}`}
            iconId="fr-icon-checkbox-circle-line"
            buttons={[
                {
                    "iconId": "fr-icon-account-circle-fill",
                    "doClosesModal": true,
                    "children": "Annuler"
                },
                {
                    "iconId": "ri-check-line",
                    "doClosesModal": false,
                    "onClick": () =>
                        declarationRemoval.removeAgentAsReferentOrUserFromSoftware({
                            softwareName,
                            declarationType
                        }),
                    "nativeButtonProps": {
                        "disabled": isRemovingUserDeclaration
                    },
                    "children": "Confirmer"
                }
            ]}
        >
            Confirmer vous ne plus vouloi être rérérent pour {softwareName} ?
        </wrapper.DeclarationRemovalModal>
    );
}
