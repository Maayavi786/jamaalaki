import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterOption {
  id: string;
  color?: string;
  label: string;
}

interface FilterChipsProps {
  options: FilterOption[];
  selectedFilters: string[];
  toggleFilter: (id: string) => void;
  isCheckbox?: boolean;
}

const FilterChips = ({ 
  options, 
  selectedFilters, 
  toggleFilter,
  isCheckbox = false
}: FilterChipsProps) => {
  const { t } = useTranslation("common");
  const { isRtl } = useLanguage();

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <div
          key={option.id}
          onClick={() => toggleFilter(option.id)}
          className={`
            ${isCheckbox 
              ? "bg-background dark:bg-neutral-900/30" 
              : "bg-muted dark:bg-neutral-800/30"} 
            ${isCheckbox ? "px-3 py-1.5" : "px-5 py-3"} 
            rounded-full text-sm flex items-center gap-1.5 cursor-pointer 
            hover:bg-opacity-90 transition-colors
            ${selectedFilters.includes(option.id) && !isCheckbox ? "ring-1 ring-primary" : ""}
          `}
        >
          {!isCheckbox && option.color && (
            <span 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: option.color }}
            ></span>
          )}
          
          {isCheckbox && (
            <Checkbox 
              id={option.id} 
              checked={selectedFilters.includes(option.id)}
              className="text-primary rounded"
            />
          )}
          
          <span className={isRtl ? 'font-tajawal' : ''}>
            {option.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default FilterChips;
