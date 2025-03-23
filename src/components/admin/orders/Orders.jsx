import {useEffect, useRef, useState, useMemo, useContext} from "react";
import ReactPaginate from "react-paginate";
import "./style.scss"
import {CSSTransition} from "react-transition-group";
import axios from "axios";
import {MyContext} from "../../App/App";

const Orders = () => {
    let value = useContext(MyContext);
    const [modalShow, setModalShow] = useState({show: false, status: false});
    const nodeRef = useRef(null);
    const ref = useRef(null);
    const [driversList, setDriversList] = useState([]);
    const [statistics, setStatistics] = useState([]);
    const [information, setInformation] = useState([]);
    const [tabs, setTabs] = useState("active");
    const worksPage = 100;
    const [pageNumber, setPageNumber] = useState(0);
    const [getSearchText, setGetSearchText] = useState("");
    const pagesVisited = pageNumber * worksPage;

    const pageCount = Math.ceil(driversList.length / worksPage);

    const changePage = ({selected}) => {
        setPageNumber(selected)

        setTimeout(() => {
            ref.current?.scrollIntoView({behavior: "smooth"});
        }, 500);
    };

    useEffect(() => {
        axios.get(`${value.url}/dashboard/order/`, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then((response) => {
            setDriversList(response.data.orders);
            setStatistics(response.data.statistics);
        })
    }, []);

    const filteredList = driversList.filter(item => item.status === tabs);
    const paginatedList = filteredList.slice(pagesVisited, pagesVisited + worksPage);

    const productList = paginatedList
        .filter((item) => {
            const searchText = getSearchText.toString().toLowerCase().replace(/\s+/g, '').replace(/\+/g, '');
            const phoneNumber = item.client.phone.toString().toLowerCase().replace(/\s+/g, '').replace(/\+/g, '');
            return searchText === "" || phoneNumber.includes(searchText);
        }).map((item, index) => {
            return <tr key={index}>
                <td>{index + 1}</td>
                <td>
                    <div className="text-driver">
                        <div className="name">
                            {item.client.first_name}
                            {item.client.last_name}
                        </div>
                        <div className="phone">
                            {item.client.phone}
                        </div>
                    </div>
                </td>

                <td>
                    <div className="text-driver">
                        {item.driver && <>
                            <div className="name">
                                {item.driver.first_name}
                                {item.driver.last_name}
                            </div>
                            <div className="phone">
                                {item.driver.phone}
                            </div>
                        </>}
                    </div>
                </td>

                <td>
                    {item.carservice.service}
                </td>

                <td>
                    {item.services && item.services.map((item, index) => {
                        return <>
                            {item.name}:{item.cost} &ensp;
                        </>
                    })}
                </td>

                <td>
                    <div className="icon">
                        <img onClick={() => {
                            setInformation(item)
                            setModalShow({show: true, status: "car-information"});
                        }} src="./images/admin/document.png" alt=""/>
                    </div>
                </td>

                <td>
                    {item.reject_comment}
                </td>
            </tr>
        });

    return <div className="orders-container">
        <CSSTransition
            in={modalShow.show}
            nodeRef={nodeRef}
            timeout={300}
            classNames="alert"
            unmountOnExit
        >
            <div className="modal-sloy">
                <div ref={nodeRef} className="modal-card">
                    {modalShow.status === "car-information" && (
                        <div className="car-information">
                            <div className="cancel-btn">
                                <img
                                    onClick={() => setModalShow({status: "", show: false})}
                                    src="./images/admin/x.png"
                                    alt=""
                                />
                            </div>
                            <div className="title">
                                Qo'shimcha malumotlar
                            </div>


                            <div className="information">
                                <div className="info">
                                    <div className="title">Moshina modeli:</div>
                                    <div className="text">Chevrolet</div>
                                </div>

                                <div className="info">
                                    <div className="title">Moshina nomi:</div>
                                    <div className="text">Malibu 2</div>
                                </div>

                                <div className="info">
                                    <div className="title">Moshina raqami:</div>
                                    <div className="text">AB288B</div>
                                </div>

                                <div className="info">
                                    <div className="title">Moshina rangi:</div>
                                    <div className="text">Qora</div>
                                </div>

                                <div className="info">
                                    <div className="title">Ro'yxatdan o'tgan sana:</div>
                                    <div className="text">20.10.2024</div>
                                </div>

                                <div className="info">
                                    <div className="title">Tex passport berilgan sana:</div>
                                    <div className="text">02.05.2024</div>
                                </div>

                                <div className="info">
                                    <div className="title">Ruxsotnoma berilgan sana:</div>
                                    <div className="text">21.05.2024</div>
                                </div>

                                <div className="info">
                                    <div className="title">Yuk orta olishi:</div>
                                    <div className="text">Yo'q</div>
                                </div>

                                <div className="info">
                                    <div className="title">Kondisaner:</div>
                                    <div className="text">Bor</div>
                                </div>

                                <div className="info">
                                    <div className="title">Tasdiqlanganmi:</div>
                                    <div className="text">Ha</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </CSSTransition>

        <div className="header">
            <div className="search-box">
                <img src="./images/admin/find-person.png" alt=""/>
                <input onChange={(e) => setGetSearchText(e.target.value)} placeholder="Telefon raqam kiriting"
                       type="text"/>
            </div>

            <div className="statisitcs">
                {statistics.length > 0 && statistics.map((item, index) => (
                    <div onClick={() => setTabs(item.status)} key={index}
                         className={`statistic-box ${tabs === item.status ? "active" : ""}`}>
                        <div className="name">
                            {item.status === "active" && "Faol buyurtmalar"}
                            {item.status === "inactive" && "Jarayonda"}
                            {item.status === "assigned" && "Tugallangan"}
                            {item.status === "rejected" && "Bekor qilingan"}

                        </div>
                        <div className="num">{item.count}</div>
                    </div>
                ))}
            </div>
        </div>

        <div className="wrapper-table">
            <table>
                <thead>
                <tr>
                    <th>№</th>
                    <th>Mijoz</th>
                    <th>Haydovchi</th>
                    <th>Tarif</th>
                    <th>Xizmatlat</th>
                    <th>Qo'shimcha ma'lumotlar</th>
                    <th>Bekor bolish sababi</th>
                </tr>

                </thead>

                <tbody>
                {productList}
                </tbody>
            </table>
        </div>


        <div className="pagination">
            {driversList.length > 100 ? <ReactPaginate
                breakLabel="..."
                previousLabel={<img src="./images/admin/prev.png" alt=""/>}
                nextLabel={<img src="./images/admin/next.png" alt=""/>}
                pageCount={pageCount}
                onPageChange={changePage}
                containerClassName={"paginationBttns"}
                previousLinkClassName={"previousBttn"}
                nextLinkClassName={"nextBttn"}
                disabledCalassName={"paginationDisabled"}
                activeClassName={"paginationActive"}
            /> : ""}
        </div>

    </div>
}

export default Orders