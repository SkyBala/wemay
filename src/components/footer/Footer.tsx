import { FC } from "react";
import instagramIcon from "../../assets/images/icons/instagram.svg";
import telegramIcon from "../../assets/images/icons/telegram.svg";
import whatsappIcon from "../../assets/images/icons/whatsapp.svg";
import vkIcon from "../../assets/images/icons/vk.svg";
import facebookIcon from "../../assets/images/icons/facebook.svg";
const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className=" bg-gray">
      <div className="container">
        <div className="flex justify-between items-center">
            <div className="flex flex-col items-start">  
               <h2 className="mb-[16px] text-primary font-extrabold">wemay</h2>
               <span className="text-14 font-medium leading-[16px]">           Сервис выгодных предложений </span>
        </div>
     
    <span className="mt-[10px] font-semibold ">
             Новости и блог
              </span>
      
        <div className="mt-60 mb-[75px] max-w-[965px] flex justify-between leading-[24px] tb:mb-[126px] tb:flex-col tb:gap-[80px] flex-col">
         <ul className="mt-[24px] flex gap-[16px]">
              <li>
                <a href="">
                  <img src={instagramIcon} alt="instagram" />
                </a>
              </li>
              <li>
                <a href="">
                  <img src={telegramIcon} alt="telegram" />
                </a>
              </li>
              <li>
                <a href="">
                  <img src={whatsappIcon} alt="whatsapp" />
                </a>
              </li>
              <li>
                <a href="">
                  <img src={vkIcon} alt="vk" />
                </a>
              </li>
              <li>
                <a href="">
                  <img src={facebookIcon} alt="facebook" />
                </a>
              </li>
            </ul>
         
          
        </div>
        </div>
      
        <p className="text-center font-medium text-[#4F4F4F]">
          &copy; wemay {currentYear}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
