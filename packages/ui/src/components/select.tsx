"use client"

interface SelectProps {
    options: {
        key: string
        value: string
    }[],
    onSelect?: (value: string) => void
}

export function Select ({options, onSelect}: SelectProps) {
    return (
        <>
        <select id="select-option" aria-label="Select an option"
        className="bg-accent-foreground border border-primary text-primary-foreground text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5"
        onChange={(e) => onSelect?.(e.target.value)}>
            {
                options.map(option => 
                <option key={option.key} value={option.value}>
                    {option.key}
                </option>)
            }
        </select>
        </>
    )
}

//onChange={(e) => {onSelect(e.target.value)}}