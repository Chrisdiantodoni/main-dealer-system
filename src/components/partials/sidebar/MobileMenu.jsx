import React, { useRef, useEffect, useState } from "react";

import Navmenu from "./Navmenu";
import { menuItems } from "@/constant/data";
import SimpleBar from "simplebar-react";
import useSemiDark from "@/hooks/useSemiDark";
import useSkin from "@/hooks/useSkin";
import useDarkMode from "@/hooks/useDarkMode";
import { Link, useNavigate } from "react-router-dom";
import useMobileMenu from "@/hooks/useMobileMenu";
import Icon from "@/components/ui/Icon";

// import images
import MobileLogo from "@/assets/images/Logo-Alfa.png";
import MobileLogoWhite from "@/assets/images/logo/logo-c-white.svg";
import svgRabitImage from "@/assets/images/svg/rabit.svg";
import SelectComponent from "@/components/ui/Select/Select";
import user from "@/services/API/user";
import { useMutation, useQuery } from "react-query";
import createStore from "@/context";

const MobileMenu = ({ className = "custom-class" }) => {
  const scrollableNodeRef = useRef();
  const [scroll, setScroll] = useState(false);
  const [mainDealers, setMainDealers] = useState([]);
  const { handle, mainDealer } = createStore();
  const [selectMainDealer, setSelectMainDealer] = useState({});
  const mode = import.meta.env.VITE_MODE;

  const { isLoading } = useQuery({
    queryKey: ["getUserMd"],
    queryFn: async () => {
      const response = await user.getUserMainDealer();
      setMainDealers(
        response.data.map((item) => ({
          label: item?.main_dealer?.main_dealer_name,
          value: item,
        }))
      );
      return response;
    },
  });
  useEffect(() => {
    const handleScroll = () => {
      if (scrollableNodeRef.current.scrollTop > 0) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };
    scrollableNodeRef.current.addEventListener("scroll", handleScroll);
  }, [scrollableNodeRef]);

  const [isSemiDark] = useSemiDark();
  // skin
  const [skin] = useSkin();
  const [isDark] = useDarkMode();
  const [mobileMenu, setMobileMenu] = useMobileMenu();

  useEffect(() => {
    setSelectMainDealer({
      label: mainDealer?.main_dealer?.main_dealer_name,
      value: mainDealer,
    });
  }, [mainDealer]);

  const navigate = useNavigate();

  const { mutate: handleSelectMainDealer } = useMutation({
    mutationFn: async (data) => {
      const body = {
        main_dealer_id: data?.value?.main_dealer_id,
      };
      const response = await user.selectMainDealer(body);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        handle("mainDealer", res?.data);
        localStorage.setItem("user_main_dealers", JSON.stringify(res?.data));
        navigate("/dashboard");
      }
    },
  });
  return (
    <div
      className={`${className} fixed  top-0 bg-white dark:bg-slate-800 shadow-lg  h-full   w-[248px]`}
    >
      <div className="logo-segment flex justify-between items-center bg-white dark:bg-slate-800 z-[9] h-[85px]  px-4 ">
        {(mode === "development" || mode === "staging") && (
          <div className="absolute top-0 left-0 -rotate-45 mt-8  text-xs bg-red-700 text-white capitalize px-2 w-44 -ml-12 text-center">
            {mode}
          </div>
        )}
        <Link to="/dashboard">
          <div className="flex items-center justify-center space-x-4 ">
            <div className="logo-icon">
              {!isDark && !isSemiDark ? (
                <img src={MobileLogo} alt="" className="w-20" />
              ) : (
                <img src={MobileLogoWhite} alt="" className="w-20" />
              )}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Alfa Scorpii MD
              </h1>
            </div>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => setMobileMenu(!mobileMenu)}
          className="cursor-pointer text-slate-900 dark:text-white text-2xl"
        >
          <Icon icon="heroicons:x-mark" />
        </button>
      </div>

      <div
        className={`h-[60px]  absolute top-[80px] nav-shadow z-[1] w-full transition-all duration-200 pointer-events-none ${
          scroll ? " opacity-100" : " opacity-0"
        }`}
      ></div>
      <SimpleBar
        className="sidebar-menu px-4 h-[calc(100%-80px)]"
        scrollableNodeProps={{ ref: scrollableNodeRef }}
      >
        <SelectComponent
          // label={"Pilih Dealer"}
          options={mainDealers}
          isClearable={false}
          isLoading={isLoading}
          value={selectMainDealer}
          onChange={handleSelectMainDealer}
        />
        <Navmenu menus={menuItems} />
        {/* <div className="bg-slate-900 mb-24 lg:mb-10 mt-24 p-4 relative text-center rounded-2xl text-white">
          <img
            src={svgRabitImage}
            alt=""
            className="mx-auto relative -mt-[73px]"
          />
          <div className="max-w-[160px] mx-auto mt-6">
            <div className="widget-title">Unlimited Access</div>
            <div className="text-xs font-light">
              Upgrade your system to business plan
            </div>
          </div>
          <div className="mt-6">
            <button className="btn bg-white hover:bg-opacity-80 text-slate-900 btn-sm w-full block">
              Upgrade
            </button>
          </div>
        </div> */}
      </SimpleBar>
    </div>
  );
};

export default MobileMenu;
