import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { Service } from '@shared/schema';
import FilterChips from '@/components/FilterChips';
import ServiceCard from '@/components/ServiceCard';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getIslamicPatternSvg } from '@/lib/utils';

const Services = () => {
  const { t } = useTranslation(['services', 'common']);
  const { isRtl } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);

  // Fetch all services
  const { data: services = [], isLoading, error } = useQuery({
    queryKey: ['/api/services'],
  });

  // Filter options
  const categories = [
    { id: 'all', label: t('services:all') },
    { id: 'haircuts', label: t('services:haircuts') },
    { id: 'coloring', label: t('services:coloring') },
    { id: 'styling', label: t('services:styling') },
    { id: 'facial', label: t('services:facial') },
    { id: 'makeup', label: t('services:makeup') },
    { id: 'nails', label: t('services:nails') },
    { id: 'massage', label: t('services:massage') },
  ];

  // Filter services based on category and search query
  useEffect(() => {
    if (!Array.isArray(services)) return;

    let filtered = [...services];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => {
        // This is a mock implementation - in a real app, 
        // services should have a category field
        const serviceNameLower = service.nameEn.toLowerCase();
        return serviceNameLower.includes(selectedCategory);
      });
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(service =>
        service.nameEn.toLowerCase().includes(query) ||
        service.nameAr.toLowerCase().includes(query) ||
        service.descriptionEn.toLowerCase().includes(query) ||
        service.descriptionAr.toLowerCase().includes(query)
      );
    }

    setFilteredServices(filtered);
  }, [services, selectedCategory, searchQuery]);

  // Handle category selection
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className={`container mx-auto py-12 px-4 ${isRtl ? 'font-tajawal' : ''}`}>
      {/* Hero Section */}
      <div className="relative bg-black text-white rounded-xl overflow-hidden mb-16">
        <div 
          className="absolute inset-0 opacity-20"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(getIslamicPatternSvg('#ffffff'))}")`, 
            backgroundSize: '300px' 
          }}
        ></div>
        <div className="relative z-10 py-16 px-6 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('services:ourServices')}</h1>
          <p className="text-lg mb-8">
            {isRtl 
              ? 'استكشفي مجموعة واسعة من خدمات التجميل المتميزة المصممة خصيصًا لك'
              : 'Explore our wide range of premium beauty services tailored just for you'}
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Input
              type="text"
              placeholder={t('common:searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="mb-12">
        <div className="mb-8 overflow-x-auto">
          <FilterChips
            options={categories}
            selectedFilters={[selectedCategory]}
            toggleFilter={handleCategoryChange}
          />
        </div>
      </div>

      {/* Services Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">Error loading services. Please try again later.</p>
          <Button onClick={() => window.location.reload()} variant="outline">Refresh</Button>
        </div>
      ) : filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} salonId={service.salonId} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg mb-4">{t('services:noServicesFound')}</p>
        </div>
      )}
    </div>
  );
};

export default Services;