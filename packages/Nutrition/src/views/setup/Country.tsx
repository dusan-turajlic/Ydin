import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { list as countryFlagList } from "country-flag-emoji";
import { Button, SearchInput, RadioGroup, Radio, AriaForm, SelectionIndicator } from "@ydin/design-system";
import { WizardLayout } from "./WizardLayout";
import { wizardDataAtom } from "@/atoms/onboarding";
import { Check } from "@ydin/design-system/icons";
import { startOpenFoodDex } from "@/services/api/startOpenFoodDexWorker";
import { DEFAULT_CONTRY_CODE_FROM_CATALOG, getLocelizedIndexUrl } from "@/constants";

interface Country {
    code: string;
    name: string;
    flag: string;
}

// Convert library format to our Country interface
const ALL_COUNTRIES: Country[] = countryFlagList.map((c) => ({
    code: c.code,
    name: c.name,
    flag: c.emoji,
}));

const POPULAR_CODES = new Set(["FI", "SE", "NO", "DK", "GB"]);

const POPULAR_COUNTRIES = ALL_COUNTRIES.filter((c) =>
    POPULAR_CODES.has(c.code)
);

interface CountrySectionProps {
    readonly title: string;
    readonly countries: Country[];
    readonly selectedCode: string | null;
    readonly onSelect: (code: string) => void;
}

function CountrySection({
    title,
    countries,
    selectedCode,
    onSelect,
}: CountrySectionProps) {
    if (countries.length === 0) return null;

    return (
        <div>
            <h3 className="px-4 py-2 text-xs text-foreground-secondary uppercase tracking-wider font-medium">
                {title}
            </h3>
            <RadioGroup
                value={selectedCode ?? undefined}
                onChange={onSelect}
                className="bg-surface rounded-xl overflow-hidden divide-y divide-border"
                aria-labelledby={title}
                isRequired
            >
                {countries.map((country) => (
                    <Radio
                        key={country.code}
                        value={country.code}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted transition-colors cursor-pointer outline-none focus-visible:bg-muted"
                    >
                        <span className="text-2xl">{country.flag}</span>
                        <span className="flex-1 text-left text-foreground">
                            {country.name}
                        </span>
                        <SelectionIndicator className="w-5 h-5">
                            <Check className="w-5 h-5 text-gold" />
                        </SelectionIndicator>
                    </Radio>
                ))}
            </RadioGroup>
        </div>
    );
}

export function Country() {
    const navigate = useNavigate();
    const [wizardData, setWizardData] = useAtom(wizardDataAtom);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSelect = (code: string) => {
        setWizardData((prev) => ({ ...prev, countryCode: code }));
    };

    // Filter countries by search
    const filteredCountries = useMemo(() => {
        if (!searchQuery.trim()) {
            return {
                popular: POPULAR_COUNTRIES,
                all: ALL_COUNTRIES,
            };
        }

        const query = searchQuery.toLowerCase();
        const allCountries = [
            ...POPULAR_COUNTRIES,
            ...ALL_COUNTRIES,
        ];
        const unique = allCountries.filter(
            (c, i, arr) => arr.findIndex((x) => x.code === c.code) === i
        );
        const filtered = unique.filter(
            (c) =>
                c.name.toLowerCase().includes(query) ||
                c.code.toLowerCase().includes(query)
        );

        return {
            popular: [],
            all: filtered,
        };
    }, [searchQuery]);

    const handleContinue = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!wizardData.countryCode) return;
        // Install the global index
        startOpenFoodDex(getLocelizedIndexUrl(DEFAULT_CONTRY_CODE_FROM_CATALOG));
        // Install the local indexes
        startOpenFoodDex(getLocelizedIndexUrl(wizardData.countryCode));

        navigate("/setup/mode");
    };

    return (
        <WizardLayout showProgress={false}>
            {/* Header */}
            <div className="py-4 sticky top-[env(safe-area-inset-top)] z-25">
                <h1 className="text-xl font-bold text-foreground text-center">
                    Select Region
                </h1>
            </div>

            {/* Search */}
            <div className="mb-4 sticky top-[calc(env(safe-area-inset-top)_+_calc(var(--spacing)_*_14))]">
                <SearchInput
                    aria-label="Search country"
                    placeholder="Search country"
                    value={searchQuery}
                    onChange={setSearchQuery}
                />
            </div>

            {/* Country list */}
            <AriaForm onSubmit={handleContinue} className="flex-1 overflow-y-auto space-y-4 -mx-4">
                <CountrySection
                    title="Popular"
                    countries={filteredCountries.popular}
                    selectedCode={wizardData.countryCode}
                    onSelect={handleSelect}
                />
                <CountrySection
                    title="All Regions"
                    countries={filteredCountries.all}
                    selectedCode={wizardData.countryCode}
                    onSelect={handleSelect}
                />
                <div className="h-32" />

                {/* Footer */}
                <div className="py-6 -mx-4 px-4 flex justify-center fixed bottom-0 left-0 right-0 bg-background">
                    <Button
                        className="w-full"
                        size="xl"
                        type="submit"
                        isDisabled={!wizardData.countryCode}
                    >
                        Continue
                    </Button>
                </div>
            </AriaForm>
        </WizardLayout>
    );
}

export default Country;
