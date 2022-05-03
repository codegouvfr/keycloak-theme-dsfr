//This is just a helper to generate the regexp that defines email allowed to register
//the actual regexp is configured in keycloak.
//https://user-images.githubusercontent.com/6702424/158169264-e3832e38-741f-49d8-9afd-6f855f7ccb4b.png
//
//NOTE: The output is for the JSON Editor (if you put it in the form you the backslashes get doubled)

import {
    emailDomainsToRegExpStr,
    //regExpStrToEmailDomains,
} from "../ui/components/KcApp/emailDomainAcceptListHelper";

/*
const emailDomains = regExpStrToEmailDomains(
    "^[^@]+@([^.]+\\.)*((insee\\.fr)|(gouv\\.fr)|(polytechnique\\.edu)|(ensae\\.fr)|(ensai\\.fr)|(centralesupelec\\.fr)|(student-cs\\.fr)|(student\\.ecp\\.fr)|(supelec\\.fr)|(ign\\.fr)|(has-sante\\.fr)|(casd\\.eu)|(ars\\.sante\\.fr)|(ansm\\.sante\\.fr)|(cnaf\\.fr)|(ac-lille\\.fr)|(ac-amiens\\.fr)|(ac-normandie\\.fr)|(ac-reims\\.fr)|(ac-nancy-metz\\.fr)|(ac-strasbourg\\.fr)|(ac-creteil\\.fr)|(ac-paris\\.fr)|(nantesmetropole\\.fr)|(ac-versailles\\.fr)|(ac-rennes\\.fr)|(ac-nantes\\.fr)|(ac-orleans-tours\\.fr)|(ac-dijon\\.fr)|(ac-besancon\\.fr)|(ac-poitiers\\.fr)|(ac-limoges\\.fr)|(ac-clermont\\.fr)|(ac-lyon\\.fr)|(ac-grenoble\\.fr)|(ac-bordeaux\\.fr)|(ac-toulouse\\.fr)|(ac-montpellier\\.fr)|(ac-aix-marseille\\.fr)|(ac-nice\\.fr)|(ac-corse\\.fr)|(ac-martinique\\.fr)|(ac-guadeloupe\\.fr)|(ac-reunion\\.fr)|(ac-guyane\\.fr)|(ac-mayotte\\.fr)|(ac-wf\\.wf)|(monvr\\.pf)|(anfr\\.fr)|(ccomptes\\.fr)|(ac-noumea\\.nc)|(ac-spm\\.fr)|(inrae\\.fr)|(inria\\.fr)|(irsn\\.fr)|(assemblee-nationale\\.fr)|(hceres\\.fr)|(ext\\.ec\\.europa\\.eu)|(health-data-hub\\.fr)|(datactivist\\.coop)|(inpi\\.fr)|(telecom-paris\\.fr)|(ineris\\.fr)|(cerema\\.fr)|(cnrs\\.fr)|(univ-paris1\\.fr)|(ens-paris-saclay\\.fr)|(ens\\.fr)|(ens-lyon\\.fr)|(cereq\\.fr)|(univ-eiffel\\.fr)|(chu-toulouse\\.fr))$",
);

console.log(emailDomains);
*/

const emailDomains = [
    "gouv.fr",
    "sorbonne-universite.fr",
    "ac-dijon.fr",
    "insee.fr",
    "montreuil.fr",
    "ac-versailles.fr",
    "inserm.fr",
    "cnafmail.fr",
    "ac-grenoble.fr",
    "univ-lille.fr",
    "univ-nantes.fr",
    "obspm.fr",
    "ac-orleans-tours.fr",
    "ac-rennes.fr",
    "adullactorg",
    "ac-toulouse.fr",
    "ac-paris.fr",
    "pole-emploi.fr",
    "unistra.fr",
    "cea.fr",
    "telecom-st-etienne.fr",
    "assurance-maladie.fr",
    "diderot.org",
    "recia.fr",
];

const regExpStr = emailDomainsToRegExpStr(emailDomains);

console.log(regExpStr);

export {};
