import { memo } from "react";
import { makeStyles } from "ui/theme";
import { ReactComponent as AgentConnectLightSvg } from "ui/assets/svg/agentConnectLight.svg";
import { ReactComponent as AgentConnectDarkSvg } from "ui/assets/svg/agentConnectDark.svg";
import { useIsDarkModeEnabled } from "onyxia-ui";
import Link from "@mui/material/Link";

export type Props = {
    className?: string;
    url: string;
};

export const AgentConnectButton = memo((props: Props) => {
    const { className, url } = props;

    const { classes, cx } = useStyles();

    const { isDarkModeEnabled } = useIsDarkModeEnabled();

    const AgentConnectSvg = isDarkModeEnabled
        ? AgentConnectDarkSvg
        : AgentConnectLightSvg;

    return (
        <div className={cx(classes.root, className)}>
            <a className={cx(classes.acButton, className)} href={url}>
                <AgentConnectSvg className={classes.svg} />
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

const useStyles = makeStyles({ "name": { AgentConnectButton } })(theme => ({
    "root": {
        "textAlign": "center",
    },
    "acButton": {
        ...theme.spacing.topBottom("padding", 2),
        "display": "flex",
        "justifyContent": "center",
        "borderRadius": 8,
        "borderWidth": 2,
        "borderStyle": "solid",
        "borderColor": "transparent",
        "backgroundColor": theme.isDarkModeEnabled
            ? theme.colors.useCases.typography.textPrimary
            : theme.colors.palette.agentConnectBlue.main,
        "boxSizing": "border-box",
        "&:hover": {
            "backgroundColor": theme.isDarkModeEnabled
                ? theme.colors.palette.agentConnectBlue.lighter
                : theme.colors.palette.agentConnectBlue.light,
            "borderColor": theme.isDarkModeEnabled
                ? theme.colors.palette.agentConnectBlue.light
                : undefined,
        },
    },
    "docLink": {
        "display": "inline-block",
        "marginTop": 8,
    },
    "svg": {
        "height": 48,
    },
}));
