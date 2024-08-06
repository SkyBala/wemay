import { FC, useEffect, useState } from "react";
import Modal from "../ui/modal/Modal";
import { AuthType } from "../../types/types";
import RegisterOrLogin from "./registerOrLogin/RegisterOrLogin";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import ForgotPassword from "./forgotPassword/ForgotPassword";
import ChangePassword from "./changePassword/ChangePassword";
import { useLocation } from "react-router-dom";
import successIcon from "../../assets/images/icons/success.svg";
import crossIcon from "../../assets/images/icons/cross.svg";

interface IAuthProps {
  isOpen: boolean;
  close: () => void;
  type?: AuthType;
}

interface IParams {
  token: string;
  uid: string;
}

const Auth: FC<IAuthProps> = ({ isOpen, close, type = "register" }) => {
  const { search } = useLocation();
  const isAuth = useSelector((state: RootState) => state.auth.isAuth);
  const [authType, setAuthType] = useState<AuthType>(type);
  // @ts-ignore
  const params: IParams = search
    .slice(1)
    .split("&")
    .reduce(
      (prev, param) => ({
        ...prev,
        [param.split("=")[0]]: param.split("=")[1],
      }),
      {}
    );
  const [isAuthOpen, setIsAuthOpen] = useState(!!(params.token && params.uid));

  useEffect(() => {
    params.token && params.uid && setAuthType("reset-password");
  }, [params]);

  useEffect(() => {
    if (isOpen) setIsAuthOpen(true);
  }, [isOpen, params]);

  const closeAuth = () => {
    close();
    setIsAuthOpen(false);
  };

  return (
    <Modal
      close={closeAuth}
      modalStyle="z-[60] p-20"
      isOpen={isAuthOpen}
      contentStyle="relative pt-20 px-40 pb-[32px] max-w-[600px] w-full font-mulish tb:px-[15px]"
    >
      <button
        onClick={closeAuth}
        className="absolute top-4 right-4"
      >
        <img src={crossIcon} alt="close" className="w-6 h-6" />
      </button>
      {isAuth ? (
        <>
          <h2 className="mb-[56px] font-montserrat">Вы авторизовались!</h2>
          <img src={successIcon} alt="success" className="mx-auto" />
          <button
            onClick={closeAuth}
            className="btn mt-[32px] py-[22px] w-full"
          >
            Хорошо
          </button>
        </>
      ) : authType === "login" || authType === "register" ? (
        <RegisterOrLogin authType={authType} setAuthType={setAuthType} />
      ) : authType === "forgot-password" ? (
        <ForgotPassword setAuthType={setAuthType} />
      ) : (
        authType === "reset-password" && (
          <ChangePassword
            token={params.token}
            uid={params.uid}
            close={closeAuth}
          />
        )
      )}
    </Modal>
  );
};

export default Auth;
