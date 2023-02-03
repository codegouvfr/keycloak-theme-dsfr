import { useState, useMemo, type ReactNode, type HTMLAttributes } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { Input, type InputProps } from "@codegouvfr/react-dsfr/Input";
import CircularProgress from "@mui/material/CircularProgress";
import { createUseDebounce } from "powerhooks/useDebounce";
import { same } from "evt/tools/inDepth/same";
import { useRerenderOnChange } from "powerhooks/tools/StatefulObservable/hooks/useRerenderOnChange";

export type AutoCompleteProps<T extends string | Record<string, unknown>> = {
    className?: string;
    debounceDelay: number;
    getOptions: (inputText: string) => Promise<T[]>;
    defaultValue?: T;
    onValueChange: (value: T | undefined) => void;
    getOptionLabel: (value: T) => string;
    renderOption?: (liProps: HTMLAttributes<HTMLLIElement>, option: T) => ReactNode;
    noOptionText: ReactNode;
    loadingText: ReactNode;
    dsfrInputProps: InputProps.RegularInput;
};

export function SearchInput<T extends string | Record<string, unknown>>(
    props: AutoCompleteProps<T>,
) {
    const {
        className,
        debounceDelay,
        getOptions,
        getOptionLabel,
        renderOption,
        defaultValue = null,
        onValueChange,
        noOptionText,
        loadingText,
        dsfrInputProps,
    } = props;

    const { useDebounce, obsIsDebouncing } = useMemo(
        () => createUseDebounce({ "delay": debounceDelay }),
        [debounceDelay],
    );
    const [options, setOptions] = useState<readonly T[]>([]);
    const [inputValue, setInputValue] = useState("");

    const { isOpen, setIsOpen } = (function useClosure() {
        const [isOpen, setIsOpen] = useState(false);

        return {
            "isOpen": isOpen && inputValue !== "",
            setIsOpen,
        };
    })();

    const { isLoading, setIsLoading } = (function useClosure() {
        useRerenderOnChange(obsIsDebouncing);

        const [isLoading, setIsLoading] = useState(false);

        return {
            "isLoading": isLoading || obsIsDebouncing.current,
            setIsLoading,
        };
    })();

    useDebounce(() => {
        let active = true;

        (async () => {
            setOptions([]);
            setIsLoading(true);

            const options = await getOptions(inputValue);

            if (!active) {
                return;
            }

            setOptions(options);

            setIsLoading(false);
        })();

        return () => {
            active = false;
        };
    }, [inputValue]);

    return (
        <Autocomplete
            className={className}
            open={isOpen}
            onOpen={() => setIsOpen(true)}
            onClose={() => setIsOpen(false)}
            onInputChange={(_event, newValue) => setInputValue(newValue)}
            onChange={(_event, newValue) => onValueChange(newValue ?? undefined)}
            defaultValue={defaultValue}
            filterOptions={(options: T[]) => options}
            getOptionLabel={getOptionLabel}
            renderOption={renderOption}
            noOptionsText={noOptionText}
            loadingText={loadingText}
            options={options}
            loading={isLoading}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            isOptionEqualToValue={(option: T, value: T) => same(option, value)}
            renderInput={params => (
                <div style={{ "position": "relative" }}>
                    <Input
                        {...dsfrInputProps}
                        style={{
                            "marginBottom": 0,
                            ...dsfrInputProps.style,
                        }}
                        ref={params.InputProps.ref}
                        nativeInputProps={{
                            ...params.inputProps,
                            ...dsfrInputProps.nativeInputProps,
                        }}
                    />
                    {isLoading && isOpen && (
                        <CircularProgress
                            style={{
                                "position": "absolute",
                                "top": 0,
                                "right": 0,
                            }}
                            color="inherit"
                            size={20}
                        />
                    )}
                </div>
            )}
        />
    );
}
