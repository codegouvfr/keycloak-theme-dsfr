import { memo, useState } from "react";
import { makeStyles } from "@codegouvfr/react-dsfr/tss";
import { ReactComponent as AgentconnectBtnPrincipal } from "../../assets/agentconnect-btn-principal.svg";
import { ReactComponent as AgentconnectBtnPrincipalHover } from "../../assets/agentconnect-btn-principal-hover.svg";
import { ReactComponent as AgentconnectBtnAlternatif } from "../../assets//agentconnect-btn-alternatif.svg";
import { ReactComponent as AgentconnectBtnAlternatifHover } from "../../assets/agentconnect-btn-alternatif-hover.svg";
import { useIsDark } from "@codegouvfr/react-dsfr/useIsDark";
import Link from "@mui/material/Link";

export type Props = {
    className?: string;
    url: string;
};

export const AgentConnectButton = memo((props: Props) => {
    const { className, url } = props;

    const [isMouseHover, setIsMouseHover] = useState(false);

    const { classes, cx } = useStyles();

    const { isDark } = useIsDark();

    const AgentConnectSvg = isDark
        ? isMouseHover
            ? AgentconnectBtnAlternatifHover
            : AgentconnectBtnAlternatif
        : isMouseHover
        ? AgentconnectBtnPrincipalHover
        : AgentconnectBtnPrincipal;

    return (
        <div className={cx(classes.root, className)}>
            <a
                className={classes.link}
                href={url}
                onMouseEnter={() => setIsMouseHover(true)}
                onMouseLeave={() => setIsMouseHover(false)}
            >
                <AgentConnectSvg />
            </a>
            <Link
                className={classes.docLink}
                href="https://agentconnect.gouv.fr/"
                target="_blank"
            >
                Qu'est-ce qu'AgentConnect?
            </Link>
        </div>
    );
});

const useStyles = makeStyles({ "name": { AgentConnectButton } })({
    "root": {
        "textAlign": "center"
    },
    "link": {
        "display": "block",
        "backgroundImage": "unset"
    },
    "docLink": {
        "display": "inline-block",
        "marginTop": 8
    }
});
