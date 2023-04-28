import { type ReactNode, type HTMLAttributes } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { Input, type InputProps } from "@codegouvfr/react-dsfr/Input";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { fr } from "@codegouvfr/react-dsfr";

export type AutocompleteFreeSoloInputProps = {
    className?: string;
    value: string;
    onValueChange: (value: string) => void;
    options: string[];
    getOptionLabel?: (value: string) => string;
    renderOption?: (liProps: HTMLAttributes<HTMLLIElement>, option: string) => ReactNode;
    noOptionText: ReactNode;
    dsfrInputProps: InputProps.RegularInput;
};

export function AutocompleteFreeSoloInput(props: AutocompleteFreeSoloInputProps) {
    const {
        className,
        value,
        onValueChange,
        options,
        getOptionLabel,
        renderOption,
        noOptionText,
        dsfrInputProps
    } = props;

    return (
        <Autocomplete
            className={cx(fr.cx("fr-input-group"), className)}
            freeSolo
            disablePortal
            options={options}
            getOptionLabel={getOptionLabel}
            renderOption={renderOption}
            noOptionsText={noOptionText}
            value={value}
            renderInput={params => (
                <Input
                    {...dsfrInputProps}
                    style={{
                        "width": params.size,
                        ...dsfrInputProps.style
                    }}
                    ref={params.InputProps.ref}
                    nativeInputProps={{
                        ...params.inputProps,
                        ...dsfrInputProps.nativeInputProps,
                        "ref": element =>
                            [
                                (params.inputProps as any).ref,
                                dsfrInputProps.nativeInputProps?.ref
                            ].forEach(ref => {
                                if (ref === undefined || ref === null) {
                                    return;
                                }

                                if (typeof ref === "function") {
                                    ref(element);
                                } else {
                                    (ref as any).current = element;
                                }
                            }),
                        "onBlur": (...args) =>
                            params.inputProps.onBlur?.(...args) ??
                            dsfrInputProps.nativeInputProps?.onBlur?.(...args),
                        "onChange": (...args) => {
                            params.inputProps.onChange?.(...args);
                            onValueChange(args[0].target.value);
                        },
                        "onFocus": (...args) =>
                            params.inputProps.onFocus?.(...args) ??
                            dsfrInputProps.nativeInputProps?.onFocus?.(...args),
                        "onMouseDown": (...args) =>
                            params.inputProps.onMouseDown?.(...args) ??
                            dsfrInputProps.nativeInputProps?.onMouseDown?.(...args)
                    }}
                />
            )}
        />
    );
}
