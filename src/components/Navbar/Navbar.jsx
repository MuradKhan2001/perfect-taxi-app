import {useContext, useState, useRef} from "react";
import "./style.scss";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import i18next from "i18next";
import {CSSTransition} from "react-transition-group";
import "bootstrap/dist/css/bootstrap.min.css";
import {MyContext} from "../App/App";

const Navbar = () => {
    let value = useContext(MyContext);
    const nodeRef = useRef(null);
    const [nav, setNav] = useState(false);
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [languageMenu, setLanguageMenu] = useState(false)

    const menu = [{
        id: 1, name: t('home'), link: "/"
    }, {
        id: 2, name: t('services'), link: "/"
    }, {
        id: 3, name: t('tariff'), link: "/"
    }, {
        id: 4, name: t('aboutus'), link: "/about-us"
    }];

    const language = [{
        code: 'uz', name: 'UZ', country_code: 'uz'
    }, {
        code: 'en', name: 'EN', country_code: 'en'
    }, {
        code: 'ru', name: 'RU', country_code: 'ru'
    }];


    return <nav className="navbar-wrapper">
        <div className="logo">
            <img onClick={() => {
                navigate('/')
            }} src="./images/logo2.png" alt=""/>
        </div>

        <CSSTransition
            in={window.innerWidth > 768 ? true : nav}
            nodeRef={nodeRef}
            timeout={100}
            classNames="alert"
            unmountOnExit
        >
            <div className="nav-list">
                <div ref={nodeRef} className="sloy-mobile">

                    <div onClick={() => {
                    }} className="nav-item-hide">
                        <img onClick={() => setNav(false)} src="./images/close.png" alt=""/>
                    </div>

                    <div className="nav-title-mobile">
                        О компании
                    </div>
                    {menu.map((item, index) => {
                        return <div key={index} onClick={() => {
                            navigate(item.link)
                            if (item.id === 2) {
                                window.scrollTo(0, 2200)
                            } else if (item.id === 3) {
                                window.scrollTo(0, 1300)
                            }
                            setNav(false)
                        }} className={`nav-item`}>{item.name}</div>
                    })}

                    {/*<div onClick={() => navigate("driver-form")} className="driver_btn">*/}
                    {/*    <img src="./images/checkmark.png" alt=""/>*/}
                    {/*    Стать водителем*/}
                    {/*</div>*/}

                    <div className="bttns-mobile">
                        <div className="app-btn">
                            <div className="left">
                                <img src="./images/google-play.png" alt=""/>
                            </div>
                            <div className="right">
                                <div className="top-text">
                                    Доступно в
                                </div>
                                <div className="bottom-text">
                                    Google Play
                                </div>
                            </div>
                        </div>
                        <div className="app-btn">
                            <div className="left">
                                <img src="./images/apple-logo.png" alt=""/>
                            </div>
                            <div className="right">
                                <div className="top-text">
                                    Доступно в
                                </div>
                                <div className="bottom-text">
                                    App store
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </CSSTransition>

        <div className="mobile-left-side">
            <div onClick={() => setLanguageMenu(!languageMenu)} className='language-box'>

                {i18next.language === "uz" && <img src="./images/uz.png" alt=""/>}

                {i18next.language === "en" && <img src="./images/en.png" alt=""/>}

                {i18next.language === "ru" && <img src="./images/ru.png" alt=""/>}

                <span>
                 {language.map((item, index) => {
                     return <div key={index}>
                         {i18next.language === item.code ? item.name : ""}
                     </div>
                 })}
            </span>
                <img src="./images/chevron_down.png" alt=""/>

                <CSSTransition
                    in={languageMenu}
                    nodeRef={nodeRef}
                    timeout={300}
                    classNames="alert"
                    unmountOnExit
                >
                    <div ref={nodeRef} className="language_menu">
                        {language.map(({code, name, country_code}) => (<div onClick={() => {
                            i18next.changeLanguage(code);
                            localStorage.setItem("lng", code);
                            if (code === "uz") localStorage.setItem("language", "uz");
                            if (code === "ru") localStorage.setItem("language", "ru");
                            if (code === "en") localStorage.setItem("language", "en")
                        }} className="items" key={country_code}>
                            {name}
                        </div>))}
                    </div>
                </CSSTransition>
            </div>

            {/*<div onClick={() => navigate("driver-form")} className="driver_btn">*/}
            {/*    <img src="./images/checkmark.png" alt=""/>*/}
            {/*    Стать водителем*/}
            {/*</div>*/}

            <div className="nav-show">
                <img onClick={() => {
                    setNav(true)
                }} src="./images/menu_hamburger.png" alt=""/>
            </div>
        </div>

    </nav>
}
export default Navbar