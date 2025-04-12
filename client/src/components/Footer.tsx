import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layers } from "lucide-react";
import { 
  FaFacebookF, 
  FaInstagram, 
  FaTwitter, 
  FaSnapchat 
} from "react-icons/fa";

const Footer = () => {
  const { t } = useTranslation("footer");
  const { isLtr, isRtl } = useLanguage();

  return (
    <footer className="bg-neutral-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1 - About */}
          <div>
            <h3 className={`font-bold text-xl mb-4 ${isLtr ? 'font-playfair' : 'font-tajawal'}`}>
              {isLtr ? "Glam Haven" : "جلام هيفن"}
            </h3>
            
            <p className={`text-white/70 text-sm mb-4 ${isRtl ? 'font-tajawal' : ''}`}>
              {t("about")}
            </p>
            
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <FaFacebookF />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <FaInstagram />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <FaTwitter />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <FaSnapchat />
              </a>
            </div>
          </div>
          
          {/* Column 2 - Quick Links */}
          <div>
            <h3 className={`font-medium text-xl mb-4 ${isRtl ? 'font-tajawal' : ''}`}>
              {t("quickLinks")}
            </h3>
            
            <ul className={`space-y-2 text-white/70 ${isRtl ? 'font-tajawal' : ''}`}>
              <li>
                <Link href="/">
                  <a className="hover:text-primary transition-colors">{t("home", { ns: "common" })}</a>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <a className="hover:text-primary transition-colors">{t("services", { ns: "common" })}</a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="hover:text-primary transition-colors">{t("about", { ns: "common" })}</a>
                </Link>
              </li>
              <li>
                <Link href="/salon-owners">
                  <a className="hover:text-primary transition-colors">
                    {isLtr ? "For Salon Owners" : "لأصحاب الصالونات"}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/loyalty">
                  <a className="hover:text-primary transition-colors">
                    {isLtr ? "Loyalty Program" : "برنامج الولاء"}
                  </a>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3 - Help & Support */}
          <div>
            <h3 className={`font-medium text-xl mb-4 ${isRtl ? 'font-tajawal' : ''}`}>
              {t("helpSupport")}
            </h3>
            
            <ul className={`space-y-2 text-white/70 ${isRtl ? 'font-tajawal' : ''}`}>
              <li>
                <Link href="/faq">
                  <a className="hover:text-primary transition-colors">{t("faq")}</a>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <a className="hover:text-primary transition-colors">{t("privacyPolicy")}</a>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <a className="hover:text-primary transition-colors">{t("termsOfService")}</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="hover:text-primary transition-colors">{t("contactUs")}</a>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 4 - Newsletter */}
          <div>
            <h3 className={`font-medium text-xl mb-4 ${isRtl ? 'font-tajawal' : ''}`}>
              {t("stayUpdated")}
            </h3>
            
            <p className={`text-white/70 text-sm mb-4 ${isRtl ? 'font-tajawal' : ''}`}>
              {t("newsletter")}
            </p>
            
            <div className="flex">
              <Input 
                type="email" 
                className="bg-white/10 border border-white/20 rounded-l-lg py-2 px-4 text-white w-full focus:outline-none focus:ring-1 focus:ring-primary" 
                placeholder={t("emailPlaceholder")}
              />
              <Button className="bg-primary hover:bg-primary/90 text-white px-4 rounded-r-lg transition-colors">
                <Layers className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className={`text-white/50 text-sm mb-4 md:mb-0 ${isRtl ? 'font-tajawal' : ''}`}>
            {t("allRightsReserved")}
          </p>
          
          <div className="flex items-center gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Mada_Logo.svg/200px-Mada_Logo.svg.png" alt="Mada" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/200px-PayPal.svg.png" alt="PayPal" className="h-6" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
