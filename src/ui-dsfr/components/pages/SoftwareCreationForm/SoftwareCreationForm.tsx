import { createGroup } from "type-route";
import type { Route } from "type-route";
import { routes } from "ui-dsfr/routes";
import { useState } from "react";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { Input } from "@codegouvfr/react-dsfr/Input";
import CircularProgress from "@mui/material/CircularProgress";
import { createUseDebounce } from "./useDebounce";

SoftwareCreationForm.routeGroup = createGroup([routes.softwareCreationForm]);

type PageRoute = Route<typeof SoftwareCreationForm.routeGroup>;

SoftwareCreationForm.getDoRequireUserLoggedIn = () => true;

export type Props = {
    className?: string;
    route: Pick<PageRoute, "params">;
};

export function SoftwareCreationForm(props: Props) {
    const { className } = props;

    return (
        <div className={className}>
            <FreeSoloCreateOption />
            <Asynchronous />
        </div>
    );
}

const filter = createFilterOptions<Film>();

function FreeSoloCreateOption() {
    const [value, setValue] = useState<Film | null>(null);

    return (
        <Autocomplete
            value={value}
            onChange={(_event, newValue) => {
                setValue(newValue);
            }}
            filterOptions={(options, params) => {
                const filtered = filter(options, params);

                return filtered;
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            options={topFilms}
            getOptionLabel={option => option.title}
            renderOption={(props, option) => <li {...props}>{option.title}</li>}
            sx={{ width: 300 }}
            renderInput={params => (
                <Input
                    label="Foo bar baz"
                    ref={params.InputProps.ref}
                    nativeInputProps={params.inputProps}
                />
            )}
        />
    );
}

const { useDebounce } = createUseDebounce({ "delay": 1000 });

function Asynchronous() {
    const [value, setValue] = useState<Film | null>(null);
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<readonly Film[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState("");

    useDebounce(() => {
        let active = true;

        (async () => {
            setOptions([]);
            setIsLoading(true);

            console.log(inputValue, "-- start");

            await new Promise(resolve => setTimeout(resolve, 2000));

            if (!active) {
                console.log(inputValue, "-- cancel update");
                return;
            }

            console.log(inputValue, "-- proceed to update");

            setOptions([
                {
                    "title": `${inputValue} 1`,
                    "year": 2001,
                },
                {
                    "title": `${inputValue} 2`,
                    "year": 2002,
                },
                {
                    "title": `${inputValue} 3`,
                    "year": 2003,
                },
            ]);
            setIsLoading(false);
        })();

        return () => {
            console.log(inputValue, "-- cleanup");
            active = false;
        };
    }, [inputValue]);

    return (
        <>
            <Autocomplete
                id="asynchronous-demo"
                sx={{ width: 300, mt: 4 }}
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => {
                    setOptions([]);
                    setOpen(false);
                }}
                onChange={(_event, newValue) => setValue(newValue)}
                filterOptions={(options, params) => {
                    setInputValue(params.inputValue);

                    return options;
                }}
                getOptionLabel={option => option.title}
                options={options}
                loading={isLoading}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                renderInput={params => (
                    <div
                        style={{
                            "position": "relative",
                        }}
                    >
                        <Input
                            ref={params.InputProps.ref}
                            label="Foo bar baz"
                            nativeInputProps={params.inputProps}
                        />
                        {isLoading && (
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
            <div>Year: {value?.year}</div>
        </>
    );
}

interface Film {
    title: string;
    year: number;
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const topFilms: readonly Film[] = [
    { title: "The Shawshank Redemption", year: 1994 },
    { title: "The Godfather", year: 1972 },
    { title: "The Godfather: Part II", year: 1974 },
    { title: "The Dark Knight", year: 2008 },
    { title: "12 Angry Men", year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: "Pulp Fiction", year: 1994 },
    {
        title: "The Lord of the Rings: The Return of the King",
        year: 2003,
    },
    { title: "The Good, the Bad and the Ugly", year: 1966 },
    { title: "Fight Club", year: 1999 },
    {
        title: "The Lord of the Rings: The Fellowship of the Ring",
        year: 2001,
    },
    {
        title: "Star Wars: Episode V - The Empire Strikes Back",
        year: 1980,
    },
    { title: "Forrest Gump", year: 1994 },
    { title: "Inception", year: 2010 },
    {
        title: "The Lord of the Rings: The Two Towers",
        year: 2002,
    },
    { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
    { title: "Goodfellas", year: 1990 },
    { title: "The Matrix", year: 1999 },
    { title: "Seven Samurai", year: 1954 },
    {
        title: "Star Wars: Episode IV - A New Hope",
        year: 1977,
    },
    { title: "City of God", year: 2002 },
    { title: "Se7en", year: 1995 },
    { title: "The Silence of the Lambs", year: 1991 },
    { title: "It's a Wonderful Life", year: 1946 },
    { title: "Life Is Beautiful", year: 1997 },
    { title: "The Usual Suspects", year: 1995 },
    { title: "Léon: The Professional", year: 1994 },
    { title: "Spirited Away", year: 2001 },
    { title: "Saving Private Ryan", year: 1998 },
    { title: "Once Upon a Time in the West", year: 1968 },
    { title: "American History X", year: 1998 },
    { title: "Interstellar", year: 2014 },
    { title: "Casablanca", year: 1942 },
    { title: "City Lights", year: 1931 },
    { title: "Psycho", year: 1960 },
    { title: "The Green Mile", year: 1999 },
    { title: "The Intouchables", year: 2011 },
    { title: "Modern Times", year: 1936 },
    { title: "Raiders of the Lost Ark", year: 1981 },
    { title: "Rear Window", year: 1954 },
    { title: "The Pianist", year: 2002 },
    { title: "The Departed", year: 2006 },
    { title: "Terminator 2: Judgment Day", year: 1991 },
    { title: "Back to the Future", year: 1985 },
    { title: "Whiplash", year: 2014 },
    { title: "Gladiator", year: 2000 },
    { title: "Memento", year: 2000 },
    { title: "The Prestige", year: 2006 },
    { title: "The Lion King", year: 1994 },
    { title: "Apocalypse Now", year: 1979 },
    { title: "Alien", year: 1979 },
    { title: "Sunset Boulevard", year: 1950 },
    {
        title: "Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb",
        year: 1964,
    },
    { title: "The Great Dictator", year: 1940 },
    { title: "Cinema Paradiso", year: 1988 },
    { title: "The Lives of Others", year: 2006 },
    { title: "Grave of the Fireflies", year: 1988 },
    { title: "Paths of Glory", year: 1957 },
    { title: "Django Unchained", year: 2012 },
    { title: "The Shining", year: 1980 },
    { title: "WALL·E", year: 2008 },
    { title: "American Beauty", year: 1999 },
    { title: "The Dark Knight Rises", year: 2012 },
    { title: "Princess Mononoke", year: 1997 },
    { title: "Aliens", year: 1986 },
    { title: "Oldboy", year: 2003 },
    { title: "Once Upon a Time in America", year: 1984 },
    { title: "Witness for the Prosecution", year: 1957 },
    { title: "Das Boot", year: 1981 },
    { title: "Citizen Kane", year: 1941 },
    { title: "North by Northwest", year: 1959 },
    { title: "Vertigo", year: 1958 },
    {
        title: "Star Wars: Episode VI - Return of the Jedi",
        year: 1983,
    },
    { title: "Reservoir Dogs", year: 1992 },
    { title: "Braveheart", year: 1995 },
    { title: "M", year: 1931 },
    { title: "Requiem for a Dream", year: 2000 },
    { title: "Amélie", year: 2001 },
    { title: "A Clockwork Orange", year: 1971 },
    { title: "Like Stars on Earth", year: 2007 },
    { title: "Taxi Driver", year: 1976 },
    { title: "Lawrence of Arabia", year: 1962 },
    { title: "Double Indemnity", year: 1944 },
    {
        title: "Eternal Sunshine of the Spotless Mind",
        year: 2004,
    },
    { title: "Amadeus", year: 1984 },
    { title: "To Kill a Mockingbird", year: 1962 },
    { title: "Toy Story 3", year: 2010 },
    { title: "Logan", year: 2017 },
    { title: "Full Metal Jacket", year: 1987 },
    { title: "Dangal", year: 2016 },
    { title: "The Sting", year: 1973 },
    { title: "2001: A Space Odyssey", year: 1968 },
    { title: "Singin' in the Rain", year: 1952 },
    { title: "Toy Story", year: 1995 },
    { title: "Bicycle Thieves", year: 1948 },
    { title: "The Kid", year: 1921 },
    { title: "Inglourious Basterds", year: 2009 },
    { title: "Snatch", year: 2000 },
    { title: "3 Idiots", year: 2009 },
    { title: "Monty Python and the Holy Grail", year: 1975 },
];
