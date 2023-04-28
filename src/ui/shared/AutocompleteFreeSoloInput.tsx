import { type ReactNode, type HTMLAttributes } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { Input, type InputProps } from "@codegouvfr/react-dsfr/Input";
import { assert } from "tsafe/assert";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { fr } from "@codegouvfr/react-dsfr";

export type AutocompleteFreeSoloInputProps = {
    className?: string;
    value: string | undefined;
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
            value={value ?? null}
            onChange={(_event, newValue) => {
                assert(newValue !== null);
                onValueChange(newValue);
            }}
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
                        "onChange": (...args) =>
                            params.inputProps.onChange?.(...args) ??
                            dsfrInputProps.nativeInputProps?.onChange?.(...args),
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
