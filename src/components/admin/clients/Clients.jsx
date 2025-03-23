import {useEffect, useRef, useState, useContext} from "react";
import {CSSTransition} from "react-transition-group";
import {useFormik} from "formik";
import ReactPaginate from "react-paginate";
import axios from "axios";
import {TextField} from "@mui/material";
import "./style.scss"
import {MyContext} from "../../App/App";

const Clients = () => {
    let value = useContext(MyContext);
    const [modalShow, setModalShow] = useState({show: false, status: false});
    const nodeRef = useRef(null);
    const ref = useRef(null);
    const [getSearchText, setGetSearchText] = useState("");
    const [driverPhoto, setDriverPhoto] = useState(null);
    const [driversList, setDriversList] = useState([]);
    const [driverId, setDriverId] = useState("");
    const [reason, setReason] = useState("");
    const [profileImage, setProfileImage] = useState(null);

    const worksPage = 100;
    const [pageNumber, setPageNumber] = useState(0);
    const pagesVisited = pageNumber * worksPage;
    const pageCount = Math.ceil(driversList.length / worksPage);

    const validate = (values) => {
        const errors = {};

        if (!values.first_name) {
            errors.first_name = "Required";
        }

        if (!values.last_name) {
            errors.last_name = "Required";
        }

        if (!values.phone) {
            errors.phone = "Required";
        }
        return errors;
    };
    const formik = useFormik({
        initialValues: {
            first_name: "",
            last_name: "",
            phone: "",
        },
        validate,
        onSubmit: (values) => {
            if (!driverId && profileImage) {
                sendAllInfo()
            } else {
                sendAllInfo()
            }
        },
    });

    useEffect(() => {
        getDrivers()
    }, []);

    const getDrivers = () => {
        axios.get(`${value.url}/dashboard/client/`).then((response) => {
            setDriversList(response.data);
        })
    }

    const changePage = ({selected}) => {
        setPageNumber(selected)

        setTimeout(() => {
            ref.current?.scrollIntoView({behavior: "smooth"});
        }, 500);
    };

    const getInputPhoto = (event) => {
        const file = event.target.files[0];
        setProfileImage(file);
    };

    const sendAllInfo = () => {
        const formData = new FormData();
        let user = {
            first_name: formik.values.first_name,
            last_name: formik.values.last_name,
            phone: formik.values.phone,
            role: "client",
            complete_profile: true,
            is_verified: true
        }

        if (profileImage) {
            formData.append('profile_image', profileImage);
        }

        if (!driverId) {
            axios.post(`${value.url}/dashboard/client/`, {user},
                {}).then((response) => {
                setModalShow({status: "", show: false})
                getDrivers()
            })
        }

        if (driverId) {
            axios.patch(`${value.url}/dashboard/client/${driverId}/`, {user},
                {}).then((response) => {
                setModalShow({status: "", show: false})
                getDrivers()
            })
        }
    }

    const editInfo = (driver) => {
        formik.setValues({
            first_name: driver.user.first_name,
            last_name: driver.user.last_name,
            phone: driver.user.phone,
        });
        setDriverId(driver.id)
    }

    const blockDriver = (status) => {
        if (status === "block" && reason.trim().length > 0) {
            axios.post(`${value.url}/dashboard/client/${driverId}/block_client/`,
                {reason}).then((response) => {
                setModalShow({status: "", show: false})
                getDrivers()
                setReason("")
            })
        }

        if (status === "unblock") {
            axios.post(`${value.url}/dashboard/client/${driverId}/unblock_client/`,
                {}).then((response) => {
                setModalShow({status: "", show: false})
                getDrivers()
            })
        }
    }

    const verify = (id) => {
        axios.post(`${value.url}/dashboard/client/${id}/verify_client/`,
            {}).then((response) => {
            getDrivers()
        })
    }

    const productList = driversList.slice(pagesVisited, pagesVisited + worksPage)
        .filter((item) => {
            const searchText = getSearchText.toString().toLowerCase().replace(/\s+/g, '').replace(/\+/g, '');
            const phoneNumber = item.user.phone.toString().toLowerCase().replace(/\s+/g, '').replace(/\+/g, '');
            return searchText === "" || phoneNumber.includes(searchText);
        }).map((item, index) => {
            return <tr key={index}>
                <td>{index + 1}</td>
                <td className="driver-wrapper">
                    <div className="icon-driver">
                        <img onClick={() => {
                            setModalShow({show: true, status: "driver-photo"});
                            setDriverPhoto(item.profile_image)
                        }} src={item.user.profile_image} alt=""/>
                    </div>
                    <div className="text-driver">
                        <div className="name">
                            {item.user && item.user.first_name} &nbsp;
                            {item.user && item.user.last_name}
                        </div>
                    </div>
                </td>
                <td>
                    {item.user && item.user.phone}
                </td>
                <td>
                    <div className={item.user.is_verified ? "icon-check" : "icon-check disablet"}>
                        <img onClick={() => {
                            verify(item.id)
                        }} src="./images/admin/check.png" alt=""/>
                    </div>
                </td>
                <td>
                    <div className={item.user.is_block ? "icon-check" : "icon-check disablet"}>
                        <img onClick={() => {
                            setModalShow({show: true, status: "blocked"});
                            if (item.user.is_block) {
                                setReason(item.user.reason)
                            }
                            setDriverId(item.id)
                        }} src="./images/admin/block.png" alt="block"/>

                        {item.user.reason && item.user.is_block && <div className="reason-block">
                            <img src="./images/admin/warning.png" alt=""/>
                            <div className="text">
                                {item.user.reason}
                            </div>
                        </div>}

                    </div>
                </td>
                <td>
                </td>
                <div className="edit-icon">
                    <img onClick={() => {
                        setModalShow({show: true, status: "edit-driver"});
                        editInfo(item)
                    }} src="./images/admin/edit-tools.png" alt=""/>
                </div>
            </tr>
        });

    return <div className="clients-container">
        <CSSTransition
            in={modalShow.show}
            nodeRef={nodeRef}
            timeout={300}
            classNames="alert"
            unmountOnExit
        >
            <div className="modal-sloy">
                <div ref={nodeRef} className="modal-card">

                    {modalShow.status === "add-driver" && (
                        <div className="add-driver">
                            <div className="cancel-btn">
                                <img
                                    onClick={() => setModalShow({status: "", show: false})}
                                    src="./images/admin/x.png"
                                    alt=""
                                />
                            </div>

                            <div className="title">Mijoz qo'shish</div>

                            <div className="title-form">Mijoz ma'lumotlari:</div>

                            <div className="form-container">
                                <div className="select-box">
                                    <div className="select-sides-file">
                                        <input onChange={getInputPhoto} type="file"/>
                                        <div className={`sloy-image ${profileImage ? "active" : ""}`}>
                                            Profil rasmi
                                            <img src="./images/admin/image.png" alt=""/>
                                        </div>
                                    </div>

                                    <div className="select-sides">
                                        <TextField
                                            error={formik.errors.first_name === "Required"}
                                            value={formik.values.first_name}
                                            onChange={formik.handleChange}
                                            name="first_name"
                                            type="text"
                                            sx={{m: 1, minWidth: "100%"}} size="small" id="outlined-basic"
                                            label="Ism" variant="outlined" className="textField"/>
                                    </div>
                                </div>

                                <div className="select-box">
                                    <div className="select-sides">
                                        <TextField
                                            error={formik.errors.phone === "Required"}
                                            value={formik.values.phone}
                                            onChange={formik.handleChange}
                                            name="phone"
                                            type="text"
                                            sx={{m: 1, minWidth: "100%"}} size="small" id="outlined-basic"
                                            label="Telefon raqam" variant="outlined" className="textField"/>
                                    </div>
                                    <div className="select-sides">
                                        <TextField
                                            error={formik.errors.last_name === "Required"}
                                            value={formik.values.last_name}
                                            onChange={formik.handleChange}
                                            name="last_name"
                                            type="text"
                                            sx={{m: 1, minWidth: "100%"}} size="small" id="outlined-basic"
                                            label="Familiya" variant="outlined" className="textField"/>
                                    </div>
                                </div>
                            </div>

                            <div onClick={() => {
                                formik.handleSubmit()
                            }} className="add-btn">
                               Qo'shish
                            </div>
                        </div>
                    )}

                    {modalShow.status === "driver-photo" && (
                        <div className="driver-photo">
                            <div className="cancel-btn">
                                <img
                                    onClick={() => setModalShow({status: "", show: false})}
                                    src="./images/admin/x.png"
                                    alt=""
                                />
                            </div>

                            <div className="photo">
                                <img src={driverPhoto} alt=""/>
                            </div>
                        </div>
                    )}

                    {modalShow.status === "blocked" && (
                        <div className="blocked">
                            <div className="cancel-btn">
                                <img onClick={() => {
                                    setModalShow({status: "", show: false})
                                    setReason("")
                                }}
                                     src="./images/admin/x.png"
                                     alt=""
                                />
                            </div>

                            <div className="title">
                                Haydovchini bloklash
                            </div>

                            <div className="reason-text">
                                <textarea value={reason} onChange={(e) => setReason(e.target.value)}
                                          placeholder="Blok qilish sababini kiriting..." name="reason"
                                          id="reason"></textarea>

                                <div className="buttons">
                                    <div onClick={() => {
                                        blockDriver("unblock")
                                    }}
                                         className="cancel">Bekor qilish
                                    </div>

                                    <div onClick={() => {
                                        blockDriver("block")
                                    }} className="success">Bloklash
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}

                    {modalShow.status === "edit-driver" && (
                        <div className="edit-driver">
                            <div className="cancel-btn">
                                <img
                                    onClick={() => setModalShow({status: "", show: false})}
                                    src="./images/admin/x.png"
                                    alt=""
                                />
                            </div>

                            <div className="title">Mijoz ma'lumotlarini tahrirlash</div>

                            <div className="title-form">Mijoz ma'lumotlari:</div>

                            <div className="form-container">
                                <div className="select-box">
                                    <div className="select-sides-file">
                                        <input onChange={getInputPhoto} type="file"/>
                                        <div className={`sloy-image ${profileImage ? "active" : ""}`}>
                                            Profil rasmi
                                            <img src="./images/admin/image.png" alt=""/>
                                        </div>
                                    </div>

                                    <div className="select-sides">
                                        <TextField
                                            error={formik.errors.first_name === "Required"}
                                            value={formik.values.first_name}
                                            onChange={formik.handleChange}
                                            name="first_name"
                                            type="text"
                                            sx={{m: 1, minWidth: "100%"}} size="small" id="outlined-basic"
                                            label="Ism" variant="outlined" className="textField"/>
                                    </div>
                                </div>

                                <div className="select-box">
                                    <div className="select-sides">
                                        <TextField
                                            error={formik.errors.phone === "Required"}
                                            value={formik.values.phone}
                                            onChange={formik.handleChange}
                                            name="phone"
                                            type="text"
                                            sx={{m: 1, minWidth: "100%"}} size="small" id="outlined-basic"
                                            label="Telefon raqam" variant="outlined" className="textField"/>
                                    </div>
                                    <div className="select-sides">
                                        <TextField
                                            error={formik.errors.last_name === "Required"}
                                            value={formik.values.last_name}
                                            onChange={formik.handleChange}
                                            name="last_name"
                                            type="text"
                                            sx={{m: 1, minWidth: "100%"}} size="small" id="outlined-basic"
                                            label="Familiya" variant="outlined" className="textField"/>
                                    </div>
                                </div>
                            </div>

                            <div onClick={() => {
                                formik.handleSubmit()
                            }} className="add-btn">
                               Saqlash
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

            <div onClick={() => {
                setModalShow({show: true, status: "add-driver"});
            }} className="add-driver-btn">
                Mijoz qo'shish
            </div>

        </div>
        <div className="table-wrapper">
            <table>
                <thead>
                <tr>
                    <th>№</th>
                    <th>Mijoz haqida</th>
                    <th>Telefon raqam</th>
                    <th>Tasdiqlash</th>
                    <th>Bloklash</th>
                    <th></th>
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

export default Clients