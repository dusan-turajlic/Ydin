import { useCallback, useEffect, useRef, useState } from "react";
import { useSetAtom, useAtomValue } from "jotai";
import { DayButton } from "@ydin/design-system";
import useEmblaCarousel from 'embla-carousel-react'
import { Day, DateConfig, type CoreDate, type Week } from "@/domain";
import { selectedDayAtom, selectedDayUUIDAtom } from "@/atoms/day";

function WeekDaySelector() {
    const shouldAppendRef = useRef<string | null>(null);

    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: "start",
        dragFree: false,
        containScroll: false,
        skipSnaps: false,
        startIndex: 1
    });

    // Use the centralized selected day atom
    const setSelectedDay = useSetAtom(selectedDayAtom);
    const selectedDayUUID = useAtomValue(selectedDayUUIDAtom);

    const [weeks, setWeeks] = useState<Week[]>(() => {
        const thisWeek = Day.getWeek(Day.today());
        return [
            thisWeek.prev(),
            thisWeek,
            thisWeek.next()
        ];
    });

    const appendNextWeek = useCallback(() => {
        setWeeks((curr) => {
            const lastWeek = curr.at(-1)!;
            return [...curr, lastWeek.next()];
        });
    }, []);

    const prependPrevWeek = useCallback(() => {
        setWeeks((curr) => {
            const firstWeek = curr[0];
            return [firstWeek.prev(), ...curr];
        });
    }, []);

    // Edge-detection: when you arrive at first/last snap, add a week
    useEffect(() => {
        if (!emblaApi) return;

        const onSelect = () => {
            const internalEngin = emblaApi.internalEngine();
            if (!internalEngin) return;

            const indexis = internalEngin.slideIndexes;

            if (internalEngin.index.get() === indexis.at(-1)) {
                shouldAppendRef.current = 'next';
                setTimeout(() => {
                    appendNextWeek();
                }, 400);
            }

            if (internalEngin.index.get() === indexis.at(0)) {
                setTimeout(() => {
                    prependPrevWeek();
                    emblaApi.scrollTo(indexis.at(1) ?? 1, true);
                }, 400);
                shouldAppendRef.current = 'prev';
            }
        };

        emblaApi.on("select", onSelect);
        return () => {
            emblaApi.off("select", onSelect);
        };
    }, [emblaApi, appendNextWeek, prependPrevWeek]);

    return (
        <div className="w-full">
            <div ref={emblaRef} className="bg-surface-base overflow-hidden">
                <div className="flex">
                    {weeks.map((week) => (
                        <div key={week.uuid} className="embla__container w-full flex justify-center items-center gap-1 px-4">
                            {week.days.map((coreDate: CoreDate) => {
                                const dayUUID = Day.toUUID(coreDate);
                                const dayLabel = Day.toShortWeekday(coreDate, DateConfig.locale);
                                const dateNum = coreDate.dayOfMonth;
                                return (
                                    <DayButton
                                        key={dayUUID}
                                        day={dayLabel.toUpperCase()}
                                        date={dateNum}
                                        active={dayUUID === selectedDayUUID}
                                        onPress={() => setSelectedDay(coreDate)}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default WeekDaySelector;
