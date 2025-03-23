import {useContext, useState, useRef} from "react";
import "./style.scss";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import i18next from "i18next";
import {CSSTransition} from "react-transition-group";
import "bootstrap/dist/css/bootstrap.min.css";
import {MyContext} from "../App/App";
import Footer from "../footer/Footer";


const DriverForm = () => {
    let value = useContext(MyContext);
    const nodeRef = useRef(null);
    const [nav, setNav] = useState(false);
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [languageMenu, setLanguageMenu] = useState(false)
    const [map, setMap] = useState(false)

    const menu = [{
        id: 1, name: t('home'), link: "/"
    }, {
        id: 2, name: t('services'), link: "/"
    }, {
        id: 3, name: t('tariff'), link: "/"
    }, {
        id: 4, name: t('aboutus'), link: "/about-us"
    }];

    const language = [
        {
            code: 'uz',
            name: 'UZ',
            country_code: 'uz'
        },
        {
            code: 'en',
            name: 'EN',
            country_code: 'en'
        },
        {
            code: 'ru',
            name: 'RU',
            country_code: 'ru'
        }
    ];


    return <div className="driver-form-container">

        <nav className="navbar-wrapper">

            <div className="logo">
                <img onClick={() => {
                    navigate('/')
                }} src="./images/logo1.png" alt=""/>
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
                                setTimeout(()=>{
                                    if (item.id === 2) {
                                        window.scrollTo(0, 2200)
                                    }else
                                    if (item.id === 3) {
                                        window.scrollTo(0, 1300)
                                    }
                                },300)

                                setNav(false)
                            }} className={`nav-item`}>{item.name}</div>
                        })}

                        <div onClick={() => navigate("/driver-form")} className="driver_btn">
                            <img src="./images/checkmark.png" alt=""/>
                            Стать водителем
                        </div>

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

                <div onClick={() => navigate("/driver-form")} className="driver_btn">
                    <img src="./images/checkmark.png" alt=""/>
                    Стать водителем
                </div>

                <div className="nav-show">
                    <img onClick={() => {
                        setNav(true)
                    }} src="./images/menu_hamburger.png" alt=""/>
                </div>
            </div>

        </nav>

        <div className="home_sections">
            <div className="title_home_two">
                <div className="text_title">
                    Стать водителем
                </div>
                <div className="line_title"></div>
            </div>

            <div className="form-box">
                <div className="title-form">
                    Заполните данные и отправьте нам, и мы вам перезвоним. Спасибо что снами сотрудничаете.
                </div>

                <div className="body">
                    <div className="left">
                        <label htmlFor="firtst_name"> Введите имя </label>
                        <input id="firtst_name" placeholder="Асадбек" type="text"/>

                        <label htmlFor="phone_number"> Введите номер телефона </label>
                        <input id="phone_number" placeholder="+998 90 721 88 36" type="text"/>

                        <label htmlFor="code"> Введите СМС код </label>
                        <input className="icon-verify" id="code" placeholder="883 643" type="text"/>
                    </div>
                    <div className="right">
                        <label htmlFor="last_name"> Введите фамилию </label>
                        <input id="last_name" placeholder="Ботиров" type="text"/>

                        <label htmlFor="gmail"> Введите электронную почту </label>
                        <input id="gmail" placeholder="mrasadbek02@gmail.com" type="text"/>

                        <label htmlFor="verify"> Напишите код из картинки </label>

                        <div className="form-icons">
                            <img src="./images/img.png" alt=""/>
                            <input id="verify" placeholder="Z8hC2" type="text"/>
                        </div>
                    </div>
                </div>

               <div className="btn-box">
                   <button type="button">
                       <img src="./images/checkmark.png" alt="check"/>
                       Отправить
                   </button>
               </div>
            </div>

            <div className="title_home_one">
                <div className="text_title">
                    Наше приложение <span>perfect</span> taxi
                </div>
                <div className="line_title"></div>
            </div>

            <div className="saction_one">
                <div className="left_side">
                    <div className="top_text">
                        Скачайте наше
                        бесплатное приложение <span>perfect</span> taxi
                    </div>

                    <div className="bottom_btns">
                        <div className="app-btn">
                            <div className="left">
                                <img src="./images/google-play2.png" alt=""/>
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
                                <img src="./images/apple-logo2.png" alt=""/>
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
                <div className="right_side">
                    <img src="./images/Приложение.png" alt=""/>
                </div>
            </div>

        </div>

        <Footer/>

    </div>
}

export default DriverForm