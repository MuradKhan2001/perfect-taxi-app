import {useContext, useState, useRef, useEffect} from "react";
import "./style.scss";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {CSSTransition} from "react-transition-group";
import "bootstrap/dist/css/bootstrap.min.css";
import {MyContext} from "../App/App";
import Footer from "../footer/Footer";
import axios from "axios";
import i18next from "i18next";


const AboutUs = () => {
    let value = useContext(MyContext);
    const nodeRef = useRef(null);
    const [nav, setNav] = useState(false);
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [languageMenu, setLanguageMenu] = useState(false)
    const [map, setMap] = useState(false)
    const [appLink, setAppLink] = useState([]);
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [contact, setContact] = useState([]);
    const [phone, setPhone] = useState("");

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

    useEffect(() => {
        axios.get(`${value.url}/site/applink/`).then((response) => {
            setAppLink(response.data);
        })

        axios.get(`${value.url}/site/contact/`).then((response) => {
            setContact(response.data);
        })
    }, []);

    const sendMessage = () => {
        if (first_name.trim().length > 0 && last_name.trim().length > 0 && phone.trim().length > 0) {

            axios.post(`${value.url}/site/driver-request/`, {first_name, last_name, phone},
                {}).then((response) => {
                alert("Murojaatingiz yuborildi !!!")
                setLastName("")
                setPhone("")
                setFirstName("")
            })

        } else alert("Iltimos formani to'ldiring!!!")
    }


    return <div className="about-us-container">

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
                                setTimeout(() => {
                                    if (item.id === 2) {
                                        window.scrollTo(0, 2200)
                                    } else if (item.id === 3) {
                                        window.scrollTo(0, 1300)
                                    }
                                }, 300)

                                setNav(false)
                            }} className={`nav-item`}>{item.name}</div>
                        })}

                        {/*<div onClick={() => navigate("/driver-form")} className="driver_btn">*/}
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
                    Контакты
                </div>
                <div className="line_title"></div>
            </div>

            <div className="contents">
                <div className="content">
                    <div className="img-box">
                        <img src="./images/call.png" alt=""/>
                    </div>
                    <div className="mobile-box">
                        <div className="name-box">
                            Телефон
                        </div>
                        <div className="text">
                            {contact.length > 0 && contact[0].phone}
                        </div>
                    </div>
                </div>

                <div className="content">
                    <div className="img-box">
                        <img src="./images/poi.png" alt=""/>
                    </div>

                    <div className="mobile-box">
                        <div className="name-box">
                            Адресс
                        </div>
                        <div className="text">
                            {contact.length > 0 && contact[0].translations[i18next.language].address}
                        </div>
                    </div>
                </div>

                <div className="content">
                    <div className="img-box">
                        <img src="./images/email_outlined.png" alt=""/>
                    </div>
                    <div className="mobile-box">
                        <div className="name-box">
                            Почта
                        </div>
                        <div className="text">
                            <a href={`mailto:${contact.length > 0 && contact[0].email}`} target="_blank"
                               rel="noopener noreferrer">
                                {contact.length > 0 && contact[0].email}
                            </a>
                        </div>

                    </div>

                </div>
            </div>

            <div onClick={() => setMap(!map)} className="map-navbar">
                <img src="./images/map.png" alt=""/>
                <span> Показать на карте</span>
                <img className={map ? "arrow-icon" : ""} src="./images/next_ui.png" alt=""/>
            </div>

            {
                map && <div className="map-container">
                    <iframe
                        src="https://yandex.uz/map-widget/v1/?ll=69.198898%2C41.258569&mode=search&oid=233486199925&ol=biz&z=16.74"
                        frameBorder="1" allowFullScreen="true"
                    ></iframe>
                </div>
            }

            <div className="form-box">
                <div className="title-form">
                    Связаться с нами
                </div>

                <div className="input_box">
                    <label htmlFor="phone_number">Ism</label>
                    <input value={first_name} onChange={(e) => setFirstName(e.target.value)} placeholder="Ism"
                           id="phone_number"
                           type="text"/>
                </div>
                <div className="input_box">
                    <label htmlFor="phone_number">Familiya</label>
                    <input value={last_name} onChange={(e) => setLastName(e.target.value)}
                           placeholder="Familiya"
                           id="phone_number" type="text"/>
                </div>
                <div className="input_box">
                    <label htmlFor="phone_number">Введите номер телефона</label>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+998 (__)"
                           id="phone_number"
                           type="number"/>
                </div>

                <div onClick={sendMessage} className="btn-box">
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

                    {appLink.length > 0 && <div className="bottom_btns">
                        <a target="_blank" href={appLink[0].play_market}>
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
                        </a>


                        <a target="_blank" href={appLink[0].app_store}>
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
                        </a>
                    </div>}
                </div>
                <div className="right_side">
                    <img src="./images/Приложение.png" alt=""/>
                </div>
            </div>

        </div>

        <Footer/>
    </div>
}

export default AboutUs