import "./style.scss";
import Navbar from "../Navbar/Navbar";
import {useContext, useEffect, useState} from "react";
import Slider from "react-slick";
import Footer from "../footer/Footer";
import axios from "axios";
import {MyContext} from "../App/App";
import i18next from "i18next";

const Home = () => {
    let value = useContext(MyContext);
    const [activeTabItem, setActiveTabItem] = useState(0)
    const [imageIndex, setImageIndex] = useState(0);
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [appLink, setAppLink] = useState([]);
    const [statistics, setStatistics] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [services, setServices] = useState([]);
    const settings = {
        lazyLoad: true,
        slidesToShow: reviews.length < 5 ? reviews.length : 5,
        dots: false,
        infinite: true,
        speed: 1000,
        autoplay: true,
        slidesToScroll: 1,
        initialSlide: 1,
        centerMode: true,
        centerPadding: 0,
        beforeChange: (current, next) => setImageIndex(next),
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: reviews.length < 3 ? reviews.length : 3,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: reviews.length < 3 ? reviews.length : 3,
                    slidesToScroll: 1,
                    initialSlide: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: reviews.length < 3 ? reviews.length : 3,
                    slidesToScroll: 1
                }
            }
        ]
    };
    const settingsTwo = {
        lazyLoad: true,
        slidesToShow: 1,
        dots: false,
        infinite: true,
        speed: 1000,
        autoplay: true,
        slidesToScroll: 1,
        initialSlide: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    useEffect(() => {
        axios.get(`${value.url}/site/applink/`).then((response) => {
            setAppLink(response.data);
        })

        axios.get(`${value.url}/site/statistics/`).then((response) => {
            setStatistics(response.data);
        })

        axios.get(`${value.url}/site/review/`).then((response) => {
            setReviews(response.data);
        })

        axios.get(`${value.url}/site/service/`).then((response) => {
            setServices(response.data);
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

    return <div className="home-wrapper">

        <div className="home_page">
            <div className="navbar_box">
                <Navbar/>
            </div>
            <div className="home_contents">
                <div className="left_side">
                    <div className="home_text">
                        Стань водителем на
                        <span>своих условиях</span>
                    </div>
                </div>
                <div className="right_side">
                    <div className="home_form_box">
                        <div className="title_form">
                            Подтвердите ваш номер
                            телефона и заполните заявку
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

                        <button onClick={sendMessage} type="button" className="send_btn">
                            Yuborish
                        </button>
                    </div>
                </div>
                <div className="left_side_mobile">
                    <div className="home_text">
                        Стань водителем на
                        <span>своих условиях</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="home_sections">
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

            <div className="title_home_two">
                <div className="text_title">
                    Тарифы
                </div>
                <div className="line_title"></div>
            </div>
        </div>

        <div className="section_two">
            <div className="main_card">
                <div className="header">
                    {
                        services.map((item, index) => {
                            return <div key={index} onClick={() => setActiveTabItem(index)}
                                        className={`item-tab ${activeTabItem === index ? "tab-active" : ""}`}>
                                {item.translations[i18next.language].name}
                            </div>
                        })
                    }
                </div>

                {services.length > 0 &&
                    <div className="body">
                        <div className="left-side">
                            <div className="top-text">
                                {services[activeTabItem].translations[i18next.language].title}
                            </div>
                            <div className="bottom-text">
                                {services[activeTabItem].translations[i18next.language].text}
                            </div>
                        </div>
                        <div className="right-side">
                            {services[activeTabItem].prices.map((item, index) => {
                                return <div key={index} className="item-lists">
                                    <div className="title-info">
                                        {item.translations[i18next.language].name}
                                    </div>
                                    <div className="title-info">
                                        не более {item.cost} сум/км
                                    </div>
                                </div>
                            })}

                        </div>
                    </div>}
            </div>

            <div className="mobile-main-card">
                <Slider {...settingsTwo}>
                    {services.map((item, index) => {
                        return <div key={index} className="slide-box">
                            <div className="slide">
                                <div className="header">
                                    <div className="tab-active item-tab">
                                        {item.translations[i18next.language].name}
                                    </div>
                                </div>
                                <div className="body">
                                    <div className="left-side">
                                        <div className="top-text">
                                            {item.translations[i18next.language].title}
                                        </div>
                                        <div className="bottom-text">
                                            {item.translations[i18next.language].text}
                                        </div>
                                    </div>
                                    <div className="right-side">
                                        {item.prices.map((item, index) => {
                                            return <div key={index} className="item-lists">
                                                <div className="title-info">
                                                    {item.translations[i18next.language].name}
                                                </div>
                                                <div className="title-info">
                                                    не более {item.cost} сум/км
                                                </div>
                                            </div>
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    })}
                </Slider>
            </div>
        </div>

        <div className="home_sections">
            <div className="title_home_two">
                <div className="text_title">
                    Услуги
                </div>
                <div className="line_title"></div>
            </div>

            {statistics.length > 0 && <div className="service-container">
                <div className="service-box">
                    <div className="circe">
                        <img src="./images/service1.png" alt=""/>
                    </div>
                    <div className="count">
                        {statistics[0].avilable_drivers}
                    </div>
                    <div className="name">+ Avaible taxi</div>
                </div>

                <div className="service-box">
                    <div className="circe">
                        <img src="./images/service2.png" alt=""/>
                    </div>
                    <div className="count">
                        {statistics[0].clients}
                    </div>
                    <div className="name">+ Happy Clients</div>
                </div>

                <div className="service-box">
                    <div className="circe">
                        <img src="./images/service3.png" alt=""/>
                    </div>
                    <div className="count">
                        {statistics[0].drivers}
                    </div>
                    <div className="name">+ Our Drivers</div>
                </div>

                <div className="service-box">
                    <div className="circe">
                        <img src="./images/service4.png" alt=""/>
                    </div>
                    <div className="count">
                        {statistics[0].rides}
                    </div>
                    <div className="name">+ Road trip done</div>
                </div>
            </div>}

            {statistics.length > 0 && <div className="description_service">
                {statistics[0].translations[i18next.language].text}
            </div>}


            <div className="title_home_two">
                <div className="text_title">
                    Отзовы
                </div>
                <div className="line_title"></div>
            </div>

            <div className="carousel-comment">

                <Slider {...settings}>
                    {reviews.map((img, idx) => (
                        <div key={idx} className={idx === imageIndex ? "slide activeSlide" : "slide"}>
                            <img src={img.image} alt={img.image}/>
                        </div>
                    ))}
                </Slider>

                {
                    reviews.map((item, index) => {
                        if (index === imageIndex) {
                            return <div key={index}>
                                <div className="des-person">
                                    {item.text}
                                </div>
                                <div className="name-person">
                                    {item.name}
                                </div>
                            </div>
                        }
                    })
                }
            </div>
        </div>

        <Footer/>
    </div>
}
export default Home