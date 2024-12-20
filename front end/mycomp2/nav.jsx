import { useState } from "react";
import { BsSearchHeart } from "react-icons/bs";
import { RxCrossCircled } from "react-icons/rx";
import { MdDensityMedium } from "react-icons/md";

import css from "./NavBar.module.scss";
import WalletConnectButton from "./WalletConnect";

const NavBar = () => {
    
  //search bar toggle with search and cross button
  const [search, setSearch] = useState(false);
  const openSearchBar = () =>{
    setSearch(true);
    console.log(search);
  };

  const closeSearchBar = () =>{
    setSearch(false);
    console.log(search);
  }

  //toggle btn
  const [toggle, setToggle] = useState(false);
  const toggled = () =>{
    setToggle(prev => !prev)
    console.log(toggle)
  }

  return (
    <>
      <div className={css.wrapper}>
        <div className={css.nav_left}>
          <h1>VITALEDGE</h1>
        </div>

        <div className={`${css.main_menu} ${toggle ? css["main_menu--open"] : {}}`}>
          <ul>
            <li>
              <a to="">HOME</a>
            </li>
            {/* <li>
              <a to="/attorney">ATTORNEY</a>
            </li> */}
            <li>
              <a to="/about">ABOUT</a>
            </li>
            <li>
              <a to="/services">SERVICES</a>
            </li>
            <li>
              <a to="/contact">CONTACT US</a>
            </li>
            <li>
              <a to="/wallet">
              <WalletConnectButton/>

              </a>
            </li>
          </ul>
        </div>

        <div>
          <div className={css.btns}>
            <span>
              <BsSearchHeart onClick={openSearchBar}></BsSearchHeart>

              <RxCrossCircled
                className={search ? css.show_btn : css.hide_btn}
                onClick={closeSearchBar}
              ></RxCrossCircled>
            </span>
            <MdDensityMedium className={css.toggle_btn} onClick={toggled}></MdDensityMedium>
          </div>
        </div>

        <div className={search ? css.search_show : css.search_hide}>
          <input placeholder="Search here. . ."></input>
        </div>
      </div>
    </>
  );
};

export default NavBar;