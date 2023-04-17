import { useEffect, useReducer } from "react";
import MuiCircularProgress from "@mui/material/CircularProgress";
import { useStyles } from "@codegouvfr/react-dsfr/tss";

type Props = {
    className?: string;
};

export const loadingFallbackClassName = "loading-fallback";

export function LoadingFallback(props: Props) {
    const { className } = props;

    const { cx, css } = useStyles();

    const [isCircularProgressShown, showCircularProgress] = useReducer(() => true, false);

    useEffect(() => {
        let isActive = true;

        const timer = setTimeout(() => {
            if (!isActive) {
                return;
            }

            showCircularProgress();
        }, 1000);

        return () => {
            clearTimeout(timer);
            isActive = false;
        };
    });

    return (
        <div
            className={cx(
                css({
                    "display": "flex",
                    "justifyContent": "center",
                    "alignItems": "center"
                }),
                loadingFallbackClassName,
                className
            )}
        >
            {isCircularProgressShown && <MuiCircularProgress />}
        </div>
    );
}
