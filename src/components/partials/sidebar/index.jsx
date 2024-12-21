import React, { useRef, useEffect, useState } from "react";
import SidebarLogo from "./Logo";
import Navmenu from "./Navmenu";
import { menuItems } from "@/constant/data";
import SimpleBar from "simplebar-react";
import useSidebar from "@/hooks/useSidebar";
import useSemiDark from "@/hooks/useSemiDark";
import useSkin from "@/hooks/useSkin";
import svgRabitImage from "@/assets/images/svg/rabit.svg";
import { useMutation, useQuery } from "react-query";
import user from "@/services/API/user";
import SelectComponent from "@/components/ui/Select/Select";
import createStore from "@/context";
import { useNavigate } from "react-router-dom";
import SearchMenu from "@/components/ui/SearchMenu";

const Sidebar = () => {
  const scrollableNodeRef = useRef();
  const [scroll, setScroll] = useState(false);
  const [mainDealers, setMainDealers] = useState([]);
  const [selectMainDealer, setSelectMainDealer] = useState({});
  const { handle, mainDealer } = createStore();
  const [search, setSearch] = useState("");
  const mode = import.meta.env.VITE_MODE;

  const { isLoading } = useQuery({
    queryKey: ["getUserMd"],
    queryFn: async () => {
      const response = await user.getUserMainDealer();
      console.log({ response });
      setMainDealers(
        response.data.map((item) => ({
          label: item?.main_dealer?.main_dealer_name,
          value: item?.main_dealer_id,
        }))
      );
      return response;
    },
  });

  useEffect(() => {
    setSelectMainDealer({
      label: mainDealer?.main_dealer?.main_dealer_name,
      value: mainDealer,
    });
  }, [mainDealer]);

  const navigate = useNavigate();

  const { mutate: handleSelectMainDealer } = useMutation({
    mutationKey: ["changeMainDealer"],
    mutationFn: async (data) => {
      const body = {
        main_dealer_id: data?.value?.main_dealer_id || data?.value,
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

  const [collapsed, setMenuCollapsed] = useSidebar();
  const [menuHover, setMenuHover] = useState(false);

  // semi dark option
  const [isSemiDark] = useSemiDark();
  // skin
  const [skin] = useSkin();

  const searchedMenu = menuItems
    ?.map((filter) => {
      const searchmenu = search.toLowerCase();

      // Cek apakah judul utama (title) cocok
      const isTitleMatch = filter?.title?.toLowerCase().includes(searchmenu);

      // Cek apakah ada childtitle yang cocok
      const filteredChild = filter?.child?.filter((child) => {
        return child?.childtitle?.toLowerCase().includes(searchmenu);
      });

      // Jika title cocok, atau ada child yang cocok, kembalikan hasilnya
      if (isTitleMatch || (filteredChild && filteredChild.length > 0)) {
        // Jika child ada yang cocok, hanya kembalikan child yang sesuai
        return {
          ...filter,
          child: filteredChild?.length ? filteredChild : filter.child, // Tampilkan child yang cocok
        };
      }

      // Jika tidak ada kecocokan, jangan kembalikan apa-apa (undefined)
      return null;
    })
    .filter(Boolean);
  return (
    <div className={isSemiDark ? "dark" : ""}>
      <div
        className={`sidebar-wrapper bg-white dark:bg-slate-800     ${
          collapsed ? "w-[72px] close_sidebar" : "w-[248px]"
        }
      ${menuHover ? "sidebar-hovered" : ""}
      ${
        skin === "bordered"
          ? "border-r border-slate-200 dark:border-slate-700"
          : "shadow-base"
      }
      `}
        onMouseEnter={() => {
          setMenuHover(true);
        }}
        onMouseLeave={() => {
          setMenuHover(false);
        }}
      >
        {(mode === "development" || mode === "staging") && (
          <div className="absolute top-0 left-0 -rotate-45 mt-8  text-xs bg-red-700 text-white capitalize px-2 w-44 -ml-12 text-center">
            {mode}
          </div>
        )}
        <SidebarLogo menuHover={menuHover} />
        <div
          className={`h-[60px]  absolute top-[150px] nav-shadow z-[1] w-full transition-all duration-200 pointer-events-none ${
            scroll ? " opacity-100" : " opacity-0"
          }`}
        ></div>
        <SimpleBar
          className="sidebar-menu px-4 h-[calc(100%-160px)]"
          scrollableNodeProps={{ ref: scrollableNodeRef }}
        >
          {" "}
          {(!collapsed || menuHover) && (
            <SelectComponent
              isClearable={false}
              options={mainDealers}
              isLoading={isLoading}
              value={selectMainDealer}
              onChange={handleSelectMainDealer}
            />
          )}
          {(!collapsed || menuHover) && (
            <div className="flex my-3">
              <SearchMenu
                value={search}
                onChange={(search) => setSearch(search)}
              />
            </div>
          )}
          <Navmenu menus={searchedMenu} />
          {/* {!collapsed && (
            <div className="bg-slate-900 mb-16 mt-24 p-4 relative text-center rounded-2xl text-white">
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
            </div>
          )} */}
        </SimpleBar>
      </div>
    </div>
  );
};

export default Sidebar;
