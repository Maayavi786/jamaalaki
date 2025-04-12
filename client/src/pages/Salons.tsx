import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import SearchBar from "@/components/SearchBar";
import SalonCard from "@/components/SalonCard";
import FilterChips from "@/components/FilterChips";
import { Badge } from "@/components/ui/badge";
import { Salon } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { getIslamicPatternSvg } from "@/lib/utils";

const Salons = () => {
  const { t } = useTranslation("common");
  const { isLtr, isRtl } = useLanguage();
  const [location] = useLocation();
  const { toast } = useToast();
  
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [queryParams, setQueryParams] = useState<Record<string, any>>({});
  
  // Parse URL query parameters on initial load
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const params: Record<string, any> = {};
    
    // Basic search
    if (searchParams.has('q')) {
      params.q = searchParams.get('q');
    }
    
    // Service filter
    if (searchParams.has('service')) {
      params.service = searchParams.get('service');
    }
    
    // Boolean filters
    const booleanFilters = [];
    if (searchParams.has('isLadiesOnly') && searchParams.get('isLadiesOnly') === 'true') {
      params.isLadiesOnly = true;
      booleanFilters.push('ladiesOnly');
    }
    
    if (searchParams.has('hasPrivateRooms') && searchParams.get('hasPrivateRooms') === 'true') {
      params.hasPrivateRooms = true;
      booleanFilters.push('privateRoom');
    }
    
    if (searchParams.has('isHijabFriendly') && searchParams.get('isHijabFriendly') === 'true') {
      params.isHijabFriendly = true;
      booleanFilters.push('hijabFriendly');
    }
    
    setQueryParams(params);
    setSelectedFilters(booleanFilters);
  }, [location]);
  
  // Create the API endpoint URL with query parameters
  const createApiUrl = () => {
    const url = new URL('/api/salons', window.location.origin);
    
    Object.entries(queryParams).forEach(([key, value]) => {
      if (key !== 'q' && key !== 'service') {
        url.searchParams.append(key, String(value));
      }
    });
    
    return url.toString();
  };
  
  // Fetch salons data
  const { data: salons, isLoading, error } = useQuery<Salon[]>({
    queryKey: [createApiUrl()],
    enabled: true
  });
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load salons. Please try again later.",
        variant: "destructive"
      });
    }
  }, [error, toast]);
  
  // Create pattern SVG background
  useEffect(() => {
    const patternSvg = getIslamicPatternSvg();
    const patternBg = document.createElement('div');
    patternBg.className = 'pattern-bg';
    patternBg.style.backgroundImage = `url('data:image/svg+xml;charset=utf-8,${encodeURIComponent(patternSvg)}')`;
    
    document.body.appendChild(patternBg);
    
    return () => {
      document.body.removeChild(patternBg);
    };
  }, []);
  
  // Filter options for the filter chips
  const filterOptions = [
    { id: "ladiesOnly", color: "#D4AF37", label: t("ladiesOnly") },
    { id: "privateRoom", color: "#FFB6C1", label: t("privateRoom") },
    { id: "hijabFriendly", color: "#E6E6FA", label: t("hijabFriendly") },
    { id: "topRated", color: "#4CAF50", label: t("topRated") },
    { id: "newArrivals", color: "#FF9800", label: t("newArrivals") }
  ];
  
  const toggleFilter = (id: string) => {
    setSelectedFilters(prev => 
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
    
    // Update query params
    const newParams = { ...queryParams };
    
    if (id === 'ladiesOnly') {
      newParams.isLadiesOnly = !prev.includes(id);
    } else if (id === 'privateRoom') {
      newParams.hasPrivateRooms = !prev.includes(id);
    } else if (id === 'hijabFriendly') {
      newParams.isHijabFriendly = !prev.includes(id);
    }
    
    setQueryParams(newParams);
  };
  
  const handleSearch = (searchParams: any) => {
    const newParams: Record<string, any> = {};
    
    if (searchParams.searchTerm) {
      newParams.q = searchParams.searchTerm;
    }
    
    if (searchParams.serviceType && searchParams.serviceType !== 'all') {
      newParams.service = searchParams.serviceType;
    }
    
    const filtersList = [];
    
    if (searchParams.ladiesOnly) {
      newParams.isLadiesOnly = true;
      filtersList.push('ladiesOnly');
    }
    
    if (searchParams.privateRoom) {
      newParams.hasPrivateRooms = true;
      filtersList.push('privateRoom');
    }
    
    if (searchParams.hijabFriendly) {
      newParams.isHijabFriendly = true;
      filtersList.push('hijabFriendly');
    }
    
    setQueryParams(newParams);
    setSelectedFilters(filtersList);
  };
  
  // Filter salons based on search term and service type
  const filteredSalons = salons ? salons.filter(salon => {
    let matchesSearch = true;
    let matchesService = true;
    
    // Search term filter
    if (queryParams.q) {
      const searchTerm = queryParams.q.toLowerCase();
      const nameEn = salon.nameEn.toLowerCase();
      const nameAr = salon.nameAr.toLowerCase();
      const city = salon.city.toLowerCase();
      
      matchesSearch = nameEn.includes(searchTerm) || 
                      nameAr.includes(searchTerm) || 
                      city.includes(searchTerm);
    }
    
    // TODO: Implement service type filtering when service data is available
    
    return matchesSearch && matchesService;
  }) : [];
  
  return (
    <>
      <Helmet>
        <title>{isLtr ? "Salons | Jamaalaki" : "الصالونات | جمالكِ"}</title>
        <meta name="description" content={isLtr 
          ? "Browse and filter luxury salons designed for women in Saudi Arabia"
          : "تصفح وتصفية صالونات الرفاهية المصممة للنساء في المملكة العربية السعودية"
        } />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className={`text-3xl font-bold mb-6 ${isLtr ? 'font-playfair' : 'font-tajawal'}`}>
          {t("salons")}
        </h1>
        
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>
        
        <div className="mb-6">
          <h2 className={`text-lg font-medium mb-3 ${isRtl ? 'font-tajawal' : ''}`}>
            {isLtr ? "Filter by:" : "تصفية حسب:"}
          </h2>
          <FilterChips 
            options={filterOptions}
            selectedFilters={selectedFilters}
            toggleFilter={toggleFilter}
          />
        </div>
        
        {/* Active filters */}
        {selectedFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedFilters.map(filter => {
              const option = filterOptions.find(opt => opt.id === filter);
              if (!option) return null;
              
              return (
                <Badge 
                  key={filter} 
                  className="bg-primary text-white flex items-center gap-1"
                  onClick={() => toggleFilter(filter)}
                >
                  {option.label}
                  <span className="ml-1 cursor-pointer">&times;</span>
                </Badge>
              );
            })}
          </div>
        )}
        
        {/* Results count */}
        <div className="mb-6">
          <p className={`text-muted-foreground ${isRtl ? 'font-tajawal' : ''}`}>
            {filteredSalons.length} {isLtr ? "salons found" : "صالون تم العثور عليه"}
          </p>
        </div>
        
        {/* Salons grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredSalons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSalons.map(salon => (
              <SalonCard key={salon.id} salon={salon} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className={`text-lg font-medium ${isRtl ? 'font-tajawal' : ''}`}>
              {isLtr 
                ? "No salons found matching your criteria." 
                : "لم يتم العثور على صالونات تطابق معاييرك."
              }
            </p>
            <p className={`text-muted-foreground mt-2 ${isRtl ? 'font-tajawal' : ''}`}>
              {isLtr 
                ? "Try adjusting your filters or search term." 
                : "حاولي تعديل المرشحات أو مصطلح البحث."
              }
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Salons;
