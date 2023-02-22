import { memo } from "react";

export type Props = {
    className?: string;
};

export const FourOhFour = memo((props: Props) => {
    const { className } = props;

    return <div className={className}>Not found</div>;
});
