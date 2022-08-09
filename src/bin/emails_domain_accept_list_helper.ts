//This is just a helper to generate the regexp that defines email allowed to register
//the actual regexp is configured in keycloak.
//https://user-images.githubusercontent.com/6702424/158169264-e3832e38-741f-49d8-9afd-6f855f7ccb4b.png
//
//NOTE: The output is for the JSON Editor (if you put it in the form you the backslashes get doubled)

//ts-node --skip-project src/bin/emails_domain_accept_list_helper.ts

import {
    emailDomainsToRegExpStr,
    //regExpStrToEmailDomains,
} from "../ui/components/KcApp/emailDomainAcceptListHelper";
import { id } from "tsafe/id";
import * as fetch from "node-fetch";

/*
const emailDomains = regExpStrToEmailDomains(
    "^[^@]+@([^.]+\\.)*((gouv\\.fr)|(sorbonne-universite\\.fr)|(ac-dijon\\.fr)|(insee\\.fr)|(montreuil\\.fr)|(ac-versailles\\.fr)|(inserm\\.fr)|(cnafmail\\.fr)|(ac-grenoble\\.fr)|(univ-lille\\.fr)|(univ-nantes\\.fr)|(obspm\\.fr)|(ac-orleans-tours\\.fr)|(ac-rennes\\.fr)|(adullact\\.org)|(ac-toulouse\\.fr)|(ac-paris\\.fr)|(pole-emploi\\.fr)|(unistra\\.fr)|(cea\\.fr)|(telecom-st-etienne\\.fr)|(assurance-maladie\\.fr)|(diderot\\.org)|(recia\\.fr)|(inha\\.fr)|(imt\\.fr)|(telecom-paris\\.fr)|(st-etienne\\.archi\\.fr)|(amue\\.fr))$"
);

console.log(emailDomains);
*/

(async () => {
    const emailDomains = await Promise.all(
        [
            "https://raw.githubusercontent.com/etalab/noms-de-domaine-organismes-publics/master/sources/academies.txt",
            "https://raw.githubusercontent.com/etalab/noms-de-domaine-organismes-publics/master/sources/universites.txt",
            "https://raw.githubusercontent.com/etalab/noms-de-domaine-organismes-publics/master/sources/aphp.txt",
        ].map(url => fetch.default(url).then(resp => resp.text())),
    ).then(rawFiles =>
        rawFiles
            .map(rawFile => rawFile.split(/\r?\n/).filter(domain => domain !== ""))
            .reduce((acc, curr) => [...acc, ...curr], [])
            .reduce(
                (acc, curr) => [...acc, curr],
                [
                    "gouv.fr",
                    "insee.fr",
                    "montreuil.fr",
                    "inserm.fr",
                    "cnafmail.fr",
                    "obspm.fr",
                    "adullact.org",
                    "pole-emploi.fr",
                    "unistra.fr",
                    "cea.fr",
                    "telecom-st-etienne.fr",
                    "assurance-maladie.fr",
                    "diderot.org",
                    "recia.fr",
                    "inha.fr",
                    "imt.fr",
                    "telecom-paris.fr",
                    "st-etienne.archi.fr",
                    "amue.fr",
                    "hceres.fr",
                    "renater.fr",
                    "reseau-canope.fr",
                    "cned.fr",
                    "ac-cned.fr",
                    "onisep.fr",
                    "unilim.fr",
                    "ehess.fr",
                    "crtc.ccomptes.fr",
                    "utc.fr",
                    "centralesupelec.fr",
                    "cnrs.fr",
                    "inrae.fr",
                    "inserm.fr",
                    "univ-angers.fr",
                    "univ-st-etienne.fr",
                    "mipih.fr",
                    "latmos.ipsl.fr",
                    "uvsq.fr",
                    "conseiller-numerique.fr",
                    "shom.fr",
                    "univ-grenoble-alpes.fr",
                    "clermont-auvergne-inp.fr",
                    "ensea.fr",
                    "cerema.fr",
                    "cnnumerique.fr",
                    "vaucluse.fr",
                    "justice.fr",
                    "cc-aps.fr",
                    "nantesmetropole.fr",
                    "departement86.fr",
                    "chu-lyon.fr",
                    "ille-et-vilaine.fr",
                    "vandoeuvre.fr",
                    "cdg47.fr",
                    "haute-marne.fr",
                    "chu-rouen.fr",
                    "lecnam.net",
                    "ampmetropole.fr",
                    "bulac.fr",
                    "mnhn.fr",
                    "conciliateurdejustice.fr",
                    "grandchateaudun.fr",
                    "ght-atlantique17.fr",
                    "orleans-metropole.fr",
                    "villejuif.fr",
                    "montpellier.archi.fr",
                    "sante.fr",
                    "ecrins-parcnational.fr",
                    "asp-public.fr",
                    "mairiedefigari.corsica",
                    "polytechnique.edu",
                    "cdg01.fr",
                    "strasbourg.eu",
                    "sdis30.fr",
                    "abbeville.fr",
                    "lepuyenvelay.fr",
                    "mairie-lyon.fr",
                ],
            )
            .map(domain => domain.toLowerCase())
            .reduce((domains, domain) => {
                const toLvl2 = (domain: string) => domain.split(".").splice(-2).join(".");

                if (domains.map(toLvl2).includes(toLvl2(domain))) {
                    return domains;
                }

                return [...domains, domain];
            }, id<string[]>([])),
    );

    console.log(JSON.stringify(emailDomains, null, 2));

    console.log(`${emailDomains.length} domain names in total`);

    const regExpStr = emailDomainsToRegExpStr(emailDomains);

    console.log(regExpStr);
})();

export {};
