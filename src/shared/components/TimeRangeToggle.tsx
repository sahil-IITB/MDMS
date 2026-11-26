import "./TimeRangeToggle.css";
import { ALL_TIME_RANGES, type TimeRange } from "./timeRange";

export type { TimeRange } from "./timeRange";

export interface TimeRangeToggleProps {
    value: TimeRange;
    onChange: (range: TimeRange) => void;
    options?: TimeRange[];
    label?: string;
}

export function TimeRangeToggle({
    value,
    onChange,
    options = ALL_TIME_RANGES,
    label = "Time range",
}: TimeRangeToggleProps) {
    return (
        <div className="trt" role="group" aria-label={label}>
            {options.map((option) => (
                <button
                    key={option}
                    type="button"
                    className={`trt__btn${option === value ? " trt__btn--active" : ""}`}
                    aria-pressed={option === value}
                    onClick={() => onChange(option)}
                >
                    {option}
                </button>
            ))}
        </div>
    );
}
