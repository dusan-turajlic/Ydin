import { Suspense } from "react";
import { useAtomValue } from "jotai";
import { useParams } from "react-router-dom";
import WeekDaySelector from "@/components/WeekDaySelector";
import TopNavigation from "@/components/TopNavigation";
import DiaryTracker from "@/components/DiaryTracker";
import MacroProgressBar from "@/components/MacroProgressBar";
import FoodSearchSheet from "@/components/FoodSearchSheet";
import { LoadingSpinner } from "@/components/ui";
import { sheetExpandedAtom } from "@/atoms/sheet";

export default function Tracker() {
    const { code } = useParams();
    const isExpanded = useAtomValue(sheetExpandedAtom);

    return (
        <div className={`flex flex-col gap-1 max-w-96 m-auto ${isExpanded ? 'overflow-hidden h-screen' : 'min-h-screen'}`}>
            <TopNavigation />
            <WeekDaySelector />
            <MacroProgressBar />
            <Suspense fallback={<div className="flex justify-center py-8"><LoadingSpinner show /></div>}>
                <DiaryTracker />
            </Suspense>
            <span className="h-30" />
            <FoodSearchSheet code={code} />
        </div>
    );
}
