import { memo } from "react";
import { DirectoryHeader } from "onyxia-ui/DirectoryHeader";
import type { Software } from "sill-api";
import { Icon, makeStyles } from "ui/theme";
import { Card } from "onyxia-ui/Card";

export type Props = {
    className?: string;
    software: Software;
    onGoBack: () => void;
};

export const SoftwareDetails = memo((props: Props) => {
    const { className, software, onGoBack } = props;

    const { classes, cx, css } = useStyles();

    return (
        <div className={cx(classes.root, className)}>
            <DirectoryHeader
                onGoBack={onGoBack}
                title={software.name}
                subtitle={software.function}
                image={
                    <Icon
                        iconId="airplay"
                        className={css({ "height": "100%", "width": "100%" })}
                    />
                }
            />
            <Card>
                {(() => {
                    const { comptoirDuLibreSoftware, ...rest } = software;

                    return <pre>{JSON.stringify(rest, null, 2)}</pre>;
                })()}
            </Card>
        </div>
    );
});

const useStyles = makeStyles({ "name": { SoftwareDetails } })(() => ({
    "root": {},
}));
