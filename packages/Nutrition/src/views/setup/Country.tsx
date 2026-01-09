import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { Button } from "@ydin/design-system";
import { WizardLayout } from "./WizardLayout";
import { wizardDataAtom } from "@/atoms/onboarding";
import { createSettings } from "@/services/storage/targets";
import { recalculateTargets } from "@/utils/ree";

/**
 * Search icon
 */
function SearchIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-foreground-secondary"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    );
}

/**
 * Check icon
 */
function CheckIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gold"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

interface Country {
    code: string;
    name: string;
    flag: string;
}

const SUGGESTED_COUNTRIES: Country[] = [
    { code: "US", name: "United States", flag: "🇺🇸" },
];

const POPULAR_COUNTRIES: Country[] = [
    { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
    { code: "CA", name: "Canada", flag: "🇨🇦" },
    { code: "AU", name: "Australia", flag: "🇦🇺" },
];

const ALL_COUNTRIES: Country[] = [
    { code: "AF", name: "Afghanistan", flag: "🇦🇫" },
    { code: "AL", name: "Albania", flag: "🇦🇱" },
    { code: "DZ", name: "Algeria", flag: "🇩🇿" },
    { code: "AR", name: "Argentina", flag: "🇦🇷" },
    { code: "AT", name: "Austria", flag: "🇦🇹" },
    { code: "BE", name: "Belgium", flag: "🇧🇪" },
    { code: "BR", name: "Brazil", flag: "🇧🇷" },
    { code: "CN", name: "China", flag: "🇨🇳" },
    { code: "DK", name: "Denmark", flag: "🇩🇰" },
    { code: "FI", name: "Finland", flag: "🇫🇮" },
    { code: "FR", name: "France", flag: "🇫🇷" },
    { code: "DE", name: "Germany", flag: "🇩🇪" },
    { code: "IN", name: "India", flag: "🇮🇳" },
    { code: "IE", name: "Ireland", flag: "🇮🇪" },
    { code: "IT", name: "Italy", flag: "🇮🇹" },
    { code: "JP", name: "Japan", flag: "🇯🇵" },
    { code: "MX", name: "Mexico", flag: "🇲🇽" },
    { code: "NL", name: "Netherlands", flag: "🇳🇱" },
    { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
    { code: "NO", name: "Norway", flag: "🇳🇴" },
    { code: "PL", name: "Poland", flag: "🇵🇱" },
    { code: "PT", name: "Portugal", flag: "🇵🇹" },
    { code: "RU", name: "Russia", flag: "🇷🇺" },
    { code: "ES", name: "Spain", flag: "🇪🇸" },
    { code: "SE", name: "Sweden", flag: "🇸🇪" },
    { code: "CH", name: "Switzerland", flag: "🇨🇭" },
];

interface CountryRowProps {
    country: Country;
    isSelected: boolean;
    onSelect: () => void;
}

function CountryRow({ country, isSelected, onSelect }: CountryRowProps) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted transition-colors"
        >
            <span className="text-2xl">{country.flag}</span>
            <span className="flex-1 text-left text-foreground">
                {country.name}
            </span>
            {isSelected ? (
                <CheckIcon />
            ) : (
                <div className="w-5 h-5 rounded-full border-2 border-foreground-secondary" />
            )}
        </button>
    );
}

interface CountrySectionProps {
    title: string;
    countries: Country[];
    selectedCode: string | null;
    onSelect: (code: string) => void;
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
            <div className="bg-surface rounded-xl overflow-hidden divide-y divide-border">
                {countries.map((country) => (
                    <CountryRow
                        key={country.code}
                        country={country}
                        isSelected={selectedCode === country.code}
                        onSelect={() => onSelect(country.code)}
                    />
                ))}
            </div>
        </div>
    );
}

export function Country() {
    const navigate = useNavigate();
    const [wizardData, setWizardData] = useAtom(wizardDataAtom);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSelect = (code: string) => {
        setWizardData((prev) => ({ ...prev, countryCode: code }));
    };

    // Filter countries by search
    const filteredCountries = useMemo(() => {
        if (!searchQuery.trim()) {
            return {
                suggested: SUGGESTED_COUNTRIES,
                popular: POPULAR_COUNTRIES,
                all: ALL_COUNTRIES,
            };
        }

        const query = searchQuery.toLowerCase();
        const allCountries = [
            ...SUGGESTED_COUNTRIES,
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
            suggested: [],
            popular: [],
            all: filtered,
        };
    }, [searchQuery]);

    const handleContinue = async () => {
        if (!wizardData.countryCode || isSubmitting) return;

        setIsSubmitting(true);

        try {
            // Calculate final targets
            const targets = recalculateTargets(
                wizardData.dailyCalories!,
                wizardData.weight!,
                wizardData.weightUnit
            );

            // Save to storage
            await createSettings({
                setupMode: wizardData.setupMode!,
                profile: {
                    age: wizardData.age!,
                    height: wizardData.height!,
                    heightUnit: wizardData.heightUnit,
                    weight: wizardData.weight!,
                    weightUnit: wizardData.weightUnit,
                    biologicalProfile: wizardData.biologicalProfile!,
                },
                activity: {
                    averageDailySteps: wizardData.averageDailySteps!,
                    strengthSessionsPerWeek: wizardData.strengthSessionsPerWeek,
                },
                countryCode: wizardData.countryCode,
                calorieStrategy: "same",
                targets,
            });

            // Navigate to main app
            navigate("/food", { replace: true });
        } catch (error) {
            console.error("Failed to save settings:", error);
            setIsSubmitting(false);
        }
    };

    return (
        <WizardLayout showProgress={false}>
            {/* Header */}
            <div className="py-4">
                <h1 className="text-xl font-bold text-foreground text-center">
                    Select Region
                </h1>
            </div>

            {/* Search */}
            <div className="mb-4">
                <div className="flex items-center gap-3 px-4 py-3 bg-surface rounded-xl">
                    <SearchIcon />
                    <input
                        type="text"
                        placeholder="Search country"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent text-foreground placeholder:text-foreground-secondary outline-none"
                    />
                </div>
            </div>

            {/* Country list */}
            <div className="flex-1 overflow-y-auto space-y-4 -mx-4">
                <CountrySection
                    title="Suggested"
                    countries={filteredCountries.suggested}
                    selectedCode={wizardData.countryCode}
                    onSelect={handleSelect}
                />
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
            </div>

            {/* Footer */}
            <div className="py-6 -mx-4 px-4 bg-background">
                <Button
                    className="w-full"
                    size="xl"
                    onPress={handleContinue}
                    isDisabled={!wizardData.countryCode || isSubmitting}
                >
                    {isSubmitting ? "Saving..." : "Continue"}
                </Button>
            </div>
        </WizardLayout>
    );
}

export default Country;

