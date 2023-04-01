import MuiCircularProgress from "@mui/material/CircularProgress";

type Props = {
    fullPage?: boolean;
};

export function CircularProgress(props: Props) {
    const { fullPage = false } = props;
    return (
        <div
            style={{
                "display": "flex",
                "justifyContent": "center",
                "height": fullPage ? "100vh" : "100%",
                "alignItems": "center"
            }}
        >
            <MuiCircularProgress />
        </div>
    );
}
