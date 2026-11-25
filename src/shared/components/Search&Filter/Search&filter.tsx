import "./Search&filter.css";

export interface SearchFilterOption {
    label: string;
    value: string;
}

export interface SearchFilterItem {
    name: string;
    label: string;
    value: string;
    options: SearchFilterOption[];
    onChange: (value: string) => void;
    allLabel?: string;
}

interface SearchFilterProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    filters?: SearchFilterItem[];
    placeholder?: string;
    className?: string;
}

function SearchFilter({
    searchValue,
    onSearchChange,
    filters = [],
    placeholder = "Search...",
    className = "",
}: SearchFilterProps) {
    return (
        <div className={`search-filter ${className}`.trim()}>
            <label className="search-filter__search">
                <svg
                    className="search-filter__icon"
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                >
                    <circle cx="8.75" cy="8.75" r="5.75" />
                    <path d="m13 13 4 4" />
                </svg>
                <input
                    className="search-filter__input"
                    type="search"
                    value={searchValue}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder={placeholder}
                    aria-label={placeholder}
                />
            </label>

            {filters.map((filter) => (
                <label className="search-filter__field" key={filter.name}>
                    <span className="search-filter__label">{filter.label}</span>
                    <select
                        className="search-filter__select"
                        name={filter.name}
                        value={filter.value}
                        onChange={(event) => filter.onChange(event.target.value)}
                    >
                        <option value="">{filter.allLabel ?? "All"}</option>
                        {filter.options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>
            ))}
        </div>
    );
}

export default SearchFilter;