import { memo } from "react";
import { DirectoryHeader } from "onyxia-ui/DirectoryHeader";
import type { CompiledData } from "sill-api";
import { Icon, makeStyles } from "ui/theme";
import { Card } from "onyxia-ui/Card";
import { Button } from "ui/theme";
import { useTranslation } from "ui/i18n/useTranslations";
import { Link } from "type-route";

export type Props = {
    className?: string;
    software: CompiledData.Software;
    onGoBack: () => void;
    editLink: Link | undefined;
};

export const SoftwareDetails = memo((props: Props) => {
    const { className, software, onGoBack, editLink } = props;

    const { classes, cx, css } = useStyles();

    const { t } = useTranslation({ SoftwareDetails });

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
            {editLink !== undefined && (
                <Button {...editLink}>{t("update software information")}</Button>
            )}
            <Card>
                {(() => {
                    const { comptoirDuLibreSoftware, ...rest } = software;

                    return <pre>{JSON.stringify(rest, null, 2)}</pre>;
                })()}
            </Card>
        </div>
    );
});

export namespace SoftwareDetails {
    export type I18nScheme = {
        "update software information": undefined;
    };
}

const useStyles = makeStyles({ "name": { SoftwareDetails } })(() => ({
    "root": {},
}));
