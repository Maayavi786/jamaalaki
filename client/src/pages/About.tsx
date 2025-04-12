import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, Mail, Phone } from 'lucide-react';
import { getIslamicPatternSvg } from '@/lib/utils';

const About = () => {
  const { t } = useTranslation('about');
  const { isRtl } = useLanguage();

  // Team members data
  const teamMembers = [
    {
      name: 'Sarah Al-Qahtani',
      nameAr: 'سارة القحطاني',
      role: t('founder'),
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    },
    {
      name: 'Maha Al-Otaibi',
      nameAr: 'مها العتيبي',
      role: t('operations'),
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    },
    {
      name: 'Layla Al-Shammari',
      nameAr: 'ليلى الشمري',
      role: t('marketing'),
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    },
  ];

  return (
    <div className={`container mx-auto py-12 px-4 ${isRtl ? 'font-tajawal' : ''}`}>
      {/* Hero Section */}
      <div className="relative bg-black text-white rounded-xl overflow-hidden mb-20">
        <div 
          className="absolute inset-0 opacity-20"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(getIslamicPatternSvg('#ffffff'))}")`, 
            backgroundSize: '300px' 
          }}
        ></div>
        <div className="relative z-10 py-20 px-6 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('aboutTitle')}</h1>
          <p className="text-lg mb-8">{t('aboutSubtitle')}</p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold mb-8 text-center">{t('ourStory')}</h2>
        <div className="max-w-3xl mx-auto">
          <p className="mb-4 text-lg">{t('ourStoryP1')}</p>
          <p className="mb-4 text-lg">{t('ourStoryP2')}</p>
          <p className="mb-4 text-lg">{t('ourStoryP3')}</p>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold mb-8 text-center">{t('ourValues')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6 border-t-4 border-primary hover:shadow-lg transition-all">
            <h3 className="text-xl font-bold mb-4">{t('customerCentric')}</h3>
            <p>{t('customerCentricDesc')}</p>
          </div>
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6 border-t-4 border-primary hover:shadow-lg transition-all">
            <h3 className="text-xl font-bold mb-4">{t('quality')}</h3>
            <p>{t('qualityDesc')}</p>
          </div>
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6 border-t-4 border-primary hover:shadow-lg transition-all">
            <h3 className="text-xl font-bold mb-4">{t('convenience')}</h3>
            <p>{t('convenienceDesc')}</p>
          </div>
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6 border-t-4 border-primary hover:shadow-lg transition-all">
            <h3 className="text-xl font-bold mb-4">{t('community')}</h3>
            <p>{t('communityDesc')}</p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold mb-8 text-center">{t('meetOurTeam')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                <img 
                  src={member.image} 
                  alt={isRtl ? member.nameAr : member.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">
                {isRtl ? member.nameAr : member.name}
              </h3>
              <p className="text-muted-foreground">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div>
        <h2 className="text-3xl font-bold mb-8 text-center">{t('getInTouch')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-all">
            <div className="mb-4 flex justify-center">
              <MapPin className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">{t('visitUs')}</h3>
            <p>King Fahd Road, Riyadh</p>
            <p>Saudi Arabia</p>
          </div>
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-all">
            <div className="mb-4 flex justify-center">
              <Mail className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">{t('emailUs')}</h3>
            <p>info@glamhaven.sa</p>
            <p>support@glamhaven.sa</p>
          </div>
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-all">
            <div className="mb-4 flex justify-center">
              <Phone className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">{t('callUs')}</h3>
            <p>+966 11 234 5678</p>
            <p>+966 55 123 4567</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;