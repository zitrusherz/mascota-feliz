// components/ui/progress.tsx
"use client"

import * as React from "react"

interface ProgressProps {
    value?: number
    className?: string
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
    ({ className = "", value = 0, ...props }, ref) => (
        <div
            ref={ref}
            className={`relative h-4 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}
            {...props}
        >
            <div
                className="h-full bg-teal-600 transition-all duration-300 ease-in-out"
                style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
            />
        </div>
    )
)
Progress.displayName = "Progress"

export { Progress }