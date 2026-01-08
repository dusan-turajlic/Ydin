import { useSetAtom, useAtomValue } from "jotai";
import { Time } from "@/domain";
import { Plus } from "@ydin/design-system/icons";
import { Button, FoodCard } from "@ydin/design-system";
import { logHourAtom, generateTimeSlots } from "@/atoms/time";
import { sheetExpandedAtom } from "@/atoms/sheet";
import { dayEntriesAtom, selectedDayUUIDAtom } from "@/atoms/day";

function DiaryTracker() {
    const timeSlots = generateTimeSlots();
    const selectedDayUUID = useAtomValue(selectedDayUUIDAtom);
    const dayEntries = useAtomValue(dayEntriesAtom);
    const setLogHour = useSetAtom(logHourAtom);
    const setIsExpanded = useSetAtom(sheetExpandedAtom);

    return (
        <div className="flow-root">
            <ul className="my-4 mx-2">
                {timeSlots.map((timeSlot, idx) => {
                    const label = Time.toLabel(timeSlot);
                    const hour = timeSlot.hours;
                    const uuid = Time.toUUID(timeSlot, selectedDayUUID);
                    return (
                        <li key={uuid}>
                            <div className="relative pb-5">
                                {idx < timeSlots.length - 1 && (
                                    <span
                                        aria-hidden="true"
                                        className="absolute top-1 left-6 h-full w-px bg-surface-card"
                                    />
                                )}
                                <div className="relative flex space-x-1">
                                    <div className="flex space-x-1">
                                        <Button variant="secondary" size="xs">
                                            {label}
                                        </Button>
                                        <Button
                                            variant="icon"
                                            size="icon-xs"
                                            onPress={() => {
                                                setLogHour(hour);
                                                setIsExpanded(true);
                                            }}
                                        >
                                            <Plus aria-hidden="true" className="size-3" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-col min-w-0 flex-1 gap-2">
                                        {(dayEntries[hour] ?? []).map((item) => (
                                            <FoodCard
                                                key={item.id}
                                                title={item.name}
                                                emoji="🍽️"
                                                calories={Math.round(item.macros.calories)}
                                                protein={Math.round(item.macros.protein)}
                                                fat={Math.round(item.macros.fat)}
                                                carbs={Math.round(item.macros.carbs)}
                                                serving={`${item.servingCount} × ${item.servingSize}${item.unit}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default DiaryTracker;
