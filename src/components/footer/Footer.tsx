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
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start">
          <div className="flex flex-col items-center mb-4 sm:mb-0">
            <h2 className="mb-4 text-primary font-extrabold sm:text-center">wemay</h2>
            <span className="text-sm sm:text-base font-medium">Сервис выгодных предложений</span>
          </div>
          
          <span className="mt-4 sm:mt-0 font-semibold items-start">Новости и блог</span>
          
          <div className="mt-6 sm:mt-0 flex flex-col sm:flex-row sm:items-center">
            <ul className="flex gap-4 sm:gap-8 mb-4 sm:mb-0">
              <li>
                <a href="">
                  <img src={instagramIcon} alt="instagram" className="w-8 h-8 sm:w-16 sm:h-16" />
                </a>
              </li>
              <li>
                <a href="">
                  <img src={telegramIcon} alt="telegram" className="w-8 h-8 sm:w-16 sm:h-16" />
                </a>
              </li>
              <li>
                <a href="">
                  <img src={whatsappIcon} alt="whatsapp" className="w-8 h-8 sm:w-16 sm:h-16" />
                </a>
              </li>
              <li>
                <a href="">
                  <img src={vkIcon} alt="vk" className="w-8 h-8 sm:w-16 sm:h-16" />
                </a>
              </li>
              <li>
                <a href="">
                  <img src={facebookIcon} alt="facebook" className="w-8 h-8 sm:w-16 sm:h-16" />
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
