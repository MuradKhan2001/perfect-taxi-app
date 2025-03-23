import "./style.scss";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {MyContext} from "../App/App";
import axios from "axios";

const Footer = () => {
    let value = useContext(MyContext);
    const {t} = useTranslation();
    const [appLink, setAppLink] = useState([]);
    const [contact, setContact] = useState([]);
    const menu = [{
        id: 1, name: t('home'), link: "/"
    }, {
        id: 2, name: t('services'), link: "/"
    }, {
        id: 3, name: t('tariff'), link: "/"
    }, {
        id: 4, name: t('aboutus'), link: "/about-us"
    }];
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${value.url}/site/applink/`).then((response) => {
            setAppLink(response.data);
        })

        axios.get(`${value.url}/site/contact/`).then((response) => {
            setContact(response.data);
        })
    }, []);

    return <>
        <div className="footer-container">

            <div className="section-logo">
                <img src="./images/logo2.png" alt=""/>
            </div>

            <div className="section-contact">
                <div className="title-footer">
                    Есть вопросы звоните ?
                </div>
                <div className="item-footer">
                    {contact.length > 0 && contact[0].phone}
                </div>
                <div className="item-footer">
                    <a href={`mailto:${contact.length > 0 && contact[0].email}`} target="_blank" rel="noopener noreferrer">
                        {contact.length > 0 && contact[0].email}
                    </a>
                </div>
            </div>

            <div className="section-menu">
                <div className="title-footer">
                    О компании
                </div>
                {
                    menu.map((item, index) => {
                        return <div key={index} onClick={() => {
                            navigate(item.link)
                            setTimeout(() => {
                                if (item.id === 2) {
                                    window.scrollTo(0, 2200)
                                }
                                if (item.id === 3) {
                                    window.scrollTo(0, 1300)
                                }
                                if (item.id === 4) {
                                    window.scrollTo(0, 0)
                                }
                                if (item.id === 1) {
                                    window.scrollTo(0, 0)
                                }
                            }, 200)
                        }} className="item-footer">
                            {item.name}
                        </div>
                    })
                }
            </div>

            <div className="section-social-medias">
                <div className="title-footer">
                    Соц. Сети
                </div>

                {
                    contact.length > 0 && <div className="icons-box">
                        <a href={contact[0].istagram} target="_blank" rel="noopener noreferrer">
                            <img src="./images/instagram1.png" alt=""/>
                        </a>
                        <a href={contact[0].telegram} target="_blank" rel="noopener noreferrer">
                            <img src="./images/telegram1.png" alt=""/>
                        </a>
                        <a href={contact[0].facebook} target="_blank" rel="noopener noreferrer">
                            <img src="./images/facebook1.png" alt=""/>
                        </a>
                    </div>
                }

                {appLink.length > 0 && <div className="btns">
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
        </div>
    </>
};

export default Footer;