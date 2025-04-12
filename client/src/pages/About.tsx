import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Clock, 
  Award, 
  Heart, 
  Users,
  MapPin
} from "lucide-react";

const About = () => {
  const { t } = useTranslation(["common", "about"]);
  const { isRtl, isLtr } = useLanguage();

  const values = [
    {
      icon: <Heart className="h-10 w-10 text-primary mb-4" />,
      title: t("customerCentric", { ns: "about" }),
      description: t("customerCentricDesc", { ns: "about" })
    },
    {
      icon: <Award className="h-10 w-10 text-primary mb-4" />,
      title: t("quality", { ns: "about" }),
      description: t("qualityDesc", { ns: "about" })
    },
    {
      icon: <Clock className="h-10 w-10 text-primary mb-4" />,
      title: t("convenience", { ns: "about" }),
      description: t("convenienceDesc", { ns: "about" })
    },
    {
      icon: <Users className="h-10 w-10 text-primary mb-4" />,
      title: t("community", { ns: "about" }),
      description: t("communityDesc", { ns: "about" })
    }
  ];

  const team = [
    {
      name: "Sarah Al-Qahtani",
      nameAr: "سارة القحطاني",
      role: t("founder", { ns: "about" }),
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80"
    },
    {
      name: "Leila Abdulrahman",
      nameAr: "ليلى عبدالرحمن",
      role: t("operations", { ns: "about" }),
      image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
    {
      name: "Noor Al-Farsi",
      nameAr: "نور الفارسي",
      role: t("marketing", { ns: "about" }),
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="flex flex-col items-center mb-16 text-center">
        <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isRtl ? 'font-tajawal' : 'font-playfair'}`}>
          {t("aboutTitle", { ns: "about" })}
        </h1>
        <p className={`text-lg text-muted-foreground max-w-2xl mb-8 ${isRtl ? 'font-tajawal' : ''}`}>
          {t("aboutSubtitle", { ns: "about" })}
        </p>
        <Link href="/salons">
          <Button className="bg-primary text-white hover:bg-primary/90 px-6 py-2.5">
            {t("exploreNow", { ns: "about" })}
          </Button>
        </Link>
      </div>

      {/* Our Story */}
      <div className="mb-20">
        <h2 className={`text-3xl font-bold text-center mb-8 ${isRtl ? 'font-tajawal' : 'font-playfair'}`}>
          {t("ourStory", { ns: "about" })}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80" 
              alt="Glam Haven Story" 
              className="rounded-xl shadow-lg"
            />
          </div>
          <div>
            <p className={`text-muted-foreground mb-4 ${isRtl ? 'font-tajawal' : ''}`}>
              {t("ourStoryP1", { ns: "about" })}
            </p>
            <p className={`text-muted-foreground mb-4 ${isRtl ? 'font-tajawal' : ''}`}>
              {t("ourStoryP2", { ns: "about" })}
            </p>
            <p className={`text-muted-foreground ${isRtl ? 'font-tajawal' : ''}`}>
              {t("ourStoryP3", { ns: "about" })}
            </p>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="mb-20">
        <h2 className={`text-3xl font-bold text-center mb-12 ${isRtl ? 'font-tajawal' : 'font-playfair'}`}>
          {t("ourValues", { ns: "about" })}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-md text-center">
              <div className="flex justify-center">
                {value.icon}
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isRtl ? 'font-tajawal' : ''}`}>{value.title}</h3>
              <p className={`text-muted-foreground ${isRtl ? 'font-tajawal' : ''}`}>{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Our Team */}
      <div className="mb-20">
        <h2 className={`text-3xl font-bold text-center mb-12 ${isRtl ? 'font-tajawal' : 'font-playfair'}`}>
          {t("meetOurTeam", { ns: "about" })}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div key={index} className="bg-white dark:bg-neutral-900 rounded-xl overflow-hidden shadow-md">
              <img 
                src={member.image} 
                alt={isLtr ? member.name : member.nameAr} 
                className="w-full h-64 object-cover object-center"
              />
              <div className="p-6 text-center">
                <h3 className={`text-xl font-bold mb-1 ${isRtl ? 'font-tajawal' : ''}`}>
                  {isLtr ? member.name : member.nameAr}
                </h3>
                <p className={`text-primary font-medium mb-4 ${isRtl ? 'font-tajawal' : ''}`}>{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-neutral-100 dark:bg-neutral-800 p-8 rounded-xl">
        <h2 className={`text-3xl font-bold text-center mb-8 ${isRtl ? 'font-tajawal' : 'font-playfair'}`}>
          {t("getInTouch", { ns: "about" })}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-start mb-6">
              <MapPin className="h-5 w-5 text-primary mt-1" />
              <div className="ml-4">
                <h3 className={`font-bold mb-1 ${isRtl ? 'font-tajawal' : ''}`}>
                  {t("visitUs", { ns: "about" })}
                </h3>
                <p className={`text-muted-foreground ${isRtl ? 'font-tajawal' : ''}`}>
                  {isLtr 
                    ? "King Fahd Road, Riyadh, Saudi Arabia" 
                    : "طريق الملك فهد، الرياض، المملكة العربية السعودية"
                  }
                </p>
              </div>
            </div>
            <div className="flex items-start mb-6">
              <svg className="h-5 w-5 text-primary mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
              </svg>
              <div className="ml-4">
                <h3 className={`font-bold mb-1 ${isRtl ? 'font-tajawal' : ''}`}>
                  {t("emailUs", { ns: "about" })}
                </h3>
                <p className="text-muted-foreground">contact@glamhaven.com</p>
              </div>
            </div>
            <div className="flex items-start">
              <svg className="h-5 w-5 text-primary mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
              </svg>
              <div className="ml-4">
                <h3 className={`font-bold mb-1 ${isRtl ? 'font-tajawal' : ''}`}>
                  {t("callUs", { ns: "about" })}
                </h3>
                <p className="text-muted-foreground" dir="ltr">+966 12 345 6789</p>
              </div>
            </div>
          </div>
          <div>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.5182638363807!2d46.67593051487869!3d24.711646184127906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2ee2896970f3fd%3A0x5f5dc85788a5fc62!2sKing%20Fahd%20Rd%2C%20Riyadh%20Saudi%20Arabia!5e0!3m2!1sen!2sus!4v1634567890123!5m2!1sen!2sus" 
              className="w-full h-80 rounded-lg" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;