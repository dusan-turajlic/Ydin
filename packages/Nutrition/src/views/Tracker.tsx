import { Suspense } from "react";
import { useParams } from "react-router-dom";
import WeekDaySelector from "@/components/WeekDaySelector";
import TopNavigation from "@/components/TopNavigation";
import DiaryTracker from "@/components/DiaryTracker";
import MacroProgressBar from "@/components/MacroProgressBar";
import FoodSearchSheet from "@/components/FoodSearchSheet";
import { LoadingSpinner } from "@/components/ui";

/**
 * Loading skeleton for macro progress bar
 */
function MacroProgressSkeleton() {
    return (
        <div className="flex flex-col gap-2 px-4 my-4 pb-2">
            <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex flex-col gap-1">
                        <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                        <div className="h-2 w-full bg-muted rounded animate-pulse" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Tracker() {
    const { code } = useParams();

    return (
        <div className="flex flex-col gap-1 max-w-96 m-auto">
            <TopNavigation />
            <WeekDaySelector />
            <Suspense fallback={<MacroProgressSkeleton />}>
                <MacroProgressBar />
            </Suspense>
            <Suspense fallback={<div className="flex justify-center py-8"><LoadingSpinner show /></div>}>
                <DiaryTracker />
            </Suspense>
            <span className="h-30" />
            <FoodSearchSheet code={code} />
        </div>
    );
}
