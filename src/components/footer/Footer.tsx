import { FC } from "react";
import instagramIcon from "../../assets/images/icons/instagram.svg";
import telegramIcon from "../../assets/images/icons/telegram.svg";
import whatsappIcon from "../../assets/images/icons/whatsapp.svg";
import vkIcon from "../../assets/images/icons/vk.svg";
import facebookIcon from "../../assets/images/icons/facebook.svg";

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray">
      <div className="container px-4 py-6 sm:py-8 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start">
          <div className="flex flex-col items-start mb-4 sm:mb-0">
            <h2 className="mb-4 text-primary font-extrabold sm:text-start">wemay</h2>
            <span className="text-sm sm:text-start font-medium">Сервис выгодных предложений</span>
          </div>
          
       
          
          <div className="mt-6 sm:mt-0 flex flex-col sm:flex-row sm:items-start">
            <ul className="flex gap-4 sm:gap-8 mb-4 sm:mb-0">
              <li>
                <a href="">
                  <img src={instagramIcon} alt="instagram"  className="w-[40px] h-[40px]" />
                </a>
              </li>
              <li>
                <a href="">
                  <img src={telegramIcon} alt="telegram"  className="w-[40px] h-[40px]"/>
                </a>
              </li>
              <li>
                <a href="">
                  <img src={whatsappIcon} alt="whatsapp"  className="w-[40px] h-[40px]" />
                </a>
              </li>
              <li>
                <a href="">
                  <img src={vkIcon} alt="vk"  className="w-[40px] h-[40px]" />
                </a>
              </li>
              <li>
                <a href="">
                  <img src={facebookIcon} alt="facebook" className="w-[40px] h-[40px]" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <p className="text-center font-medium text-gray-600 mt-6 sm:mt-8">
          &copy; wemay {currentYear}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
