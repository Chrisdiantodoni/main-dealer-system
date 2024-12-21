import React from "react";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { Link } from "react-router-dom";
import useDarkMode from "@/hooks/useDarkMode";

import LogoWhite from "@/assets/images/logo/logo-white.svg";
import Logo from "@/assets/images/Logo-name.png";
import SvgImage from "@/assets/images/svg/img-2.svg";

const UnderConstructionPage = () => {
  const [isDark] = useDarkMode();
  return (
    <div className="min-h-screen">
      <div className="absolute left-0 top-0 w-full">
        <div className="flex flex-wrap justify-start items-center py-6 container">
          <div>
            <Link to="/">
              <img src={isDark ? LogoWhite : Logo} alt="" className="w-28" />
            </Link>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="flex justify-center flex-wrap items-center min-h-screen flex-col text-center">
          <img src={SvgImage} alt="" />
          <h4 className="text-3xl font-medium text-slate-900 dark:text-white mb-2">
            We are under maintenance.
          </h4>
          <p className="font-normal text-base text-slate-500 dark:text-slate-300">
            We’re making the system more awesome. <br />
            We’ll be back shortly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnderConstructionPage;
