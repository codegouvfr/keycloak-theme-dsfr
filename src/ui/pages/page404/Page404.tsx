type Props = {
    className?: string;
};

export default function Page404(props: Props) {
    const { className } = props;

    return <div className={className}>Not found</div>;
}
