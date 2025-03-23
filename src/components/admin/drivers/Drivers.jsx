import {useCallback, useEffect, useRef, useState, useMemo, useContext} from "react";
import {CSSTransition} from "react-transition-group";
import {useFormik} from "formik";
import ImageViewer from 'react-simple-image-viewer';
import ReactPaginate from "react-paginate";
import axios from "axios";
import {
    TextField,
    MenuItem,
    InputLabel,
    FormControl,
    Select
} from "@mui/material";
import "./style.scss"
import {MyContext} from "../../App/App";

const Drivers = () => {
    let value = useContext(MyContext);
    const [modalShow, setModalShow] = useState({show: false, status: false});
    const nodeRef = useRef(null);
    const ref = useRef(null);
    const [getSearchText, setGetSearchText] = useState("");
    const [driverPhoto, setDriverPhoto] = useState(null);
    const [carInformation, setCarInformation] = useState([]);
    const [currentImage, setCurrentImage] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [photoBox, setPhotoBox] = useState([]);
    const [driversList, setDriversList] = useState([]);
    const [driverId, setDriverId] = useState("");
    const [reason, setReason] = useState("");
    const [services, setServices] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);

    const [luggage, setLuggage] = useState(false);
    const [airconditioner, setAirconditioner] = useState(false);
    const [inmark, setInMark] = useState(false)

    const [profileImage, setProfileImage] = useState(null);
    const [car_images, setCar_images] = useState([]);
    const [car_tex_passport_images, setCar_tex_passport_images] = useState([]);
    const [license_images, setLicenseImages] = useState([]);

    const [car_models, setCar_models] = useState([]);
    const [car_names, setCar_names] = useState([]);
    const [car_colors, setCar_colors] = useState([]);

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

        if (!values.car_model) {
            errors.car_model = "Required";
        }

        if (!values.car_color) {
            errors.car_color = "Required";
        }

        if (!values.car_name) {
            errors.car_name = "Required";
        }

        if (!values.car_number) {
            errors.car_number = "Required";
        }

        if (!values.car_manufactured_date) {
            errors.car_manufactured_date = "Required";
        }

        if (!values.car_tex_passport_date) {
            errors.car_tex_passport_date = "Required";
        }

        if (!values.license_date) {
            errors.license_date = "Required";
        }

        return errors;
    };
    const formik = useFormik({
        initialValues: {
            first_name: "",
            last_name: "",
            phone: "",
            car_model: "",
            car_name: "",
            car_number: "",
            car_color: "",
            car_manufactured_date: null,
            car_tex_passport_date: null,
            license_date: null
        },
        validate,
        onSubmit: (values) => {
            if (!driverId && profileImage && car_images && car_tex_passport_images && license_images) {
                sendAllInfo()
            } else {
                sendAllInfo()
            }
        },
    });

    const openImageViewer = useCallback((index) => {
        setCurrentImage(index);
        setIsViewerOpen(true);
    }, []);

    useEffect(() => {
        getDrivers()

        axios.get(`${value.url}/api/v1/carbrand/`, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then((response) => {
            setCar_models(response.data);
        })

        axios.get(`${value.url}/api/v1/color/`, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then((response) => {
            setCar_colors(response.data);
        })

        axios.get(`${value.url}/api/v1/carservises/`, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then((response) => {
            setServices(response.data);
        })

    }, []);

    const getDrivers = () => {
        axios.get(`${value.url}/dashboard/driver/`).then((response) => {
            setDriversList(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    const getCarNames = (id) => {
        axios.get(`${value.url}/api/v1/carbrand/${id}/`, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then((response) => {
            setCar_names(response.data);
        })
    }

    const changePage = ({selected}) => {
        setPageNumber(selected)

        setTimeout(() => {
            ref.current?.scrollIntoView({behavior: "smooth"});
        }, 500);
    };

    const closeImageViewer = () => {
        setCurrentImage(0);
        setIsViewerOpen(false);
    };

    const getInputPhoto = (event) => {
        const file = event.target.files[0];
        setProfileImage(file);
    };

    const getInputDocs = (event) => {
        // const file = event.target.files;
        const file = [...event.target.files];

        if (event.target.name == "car_images") {
            setCar_images(file);
        }

        if (event.target.name == "car_tex_passport_images") {
            setCar_tex_passport_images(file);
        }

        if (event.target.name == "license_images") {
            setLicenseImages(file);
        }
    };

    const sendAllInfo = () => {
        const formData = new FormData();
        let user = {
            first_name: formik.values.first_name,
            last_name: formik.values.last_name,
            phone: formik.values.phone,
            role: "driver",
            complete_profile: true,
            is_verified: true
        }
        let allInfo = {
            car_model: formik.values.car_model,
            car_name: formik.values.car_name,
            car_number: formik.values.car_number,
            car_color: formik.values.car_color,
            car_manufactured_date: formik.values.car_manufactured_date,
            car_tex_passport_date: formik.values.car_tex_passport_date,
            license_date: formik.values.license_date,
            luggage: luggage,
            airconditioner: airconditioner,
            inmark: inmark
        }

        let mergedObject = {
            user: user,
            ...allInfo
        };

        if (profileImage) {
            formData.append('profile_image', profileImage);
        }

        car_images.forEach((image, index) => {
            formData.append(`car_images[${index}]`, image);
        });
        car_tex_passport_images.forEach((image, index) => {
            formData.append(`car_tex_passport_images[${index}]`, image);
        });
        license_images.forEach((image, index) => {
            formData.append(`license_images[${index}]`, image);
        });

        if (!driverId) {
            axios.post(`${value.url}/dashboard/driver/`, mergedObject,
                {}).then((response) => {
                axios.post(`${value.url}/dashboard/driver/${response.data.id}/upload_photos/`, formData,
                    {}).then((response) => {
                    setModalShow({status: "", show: false})
                    getDrivers()
                })
            })
        }

        if (driverId) {
            axios.patch(`${value.url}/dashboard/driver/${driverId}/`, mergedObject,
                {}).then((response) => {
                setModalShow({status: "", show: false})
                getDrivers()
                if (car_images.length > 0 || car_tex_passport_images.length > 0 || license_images.length > 0) {
                    axios.post(`${value.url}/dashboard/driver/${driverId}/upload_photos/`, formData,
                        {}).then((response) => {

                    })
                }
            })
        }
    }

    const editInfo = (driver) => {
        formik.setValues({
            first_name: driver.user.first_name,
            last_name: driver.user.last_name,
            phone: driver.user.phone,
            car_model: driver.car_model.id,
            car_name: driver.car_name.id,
            car_color: driver.car_color.id,
            car_number: driver.car_number,
            car_manufactured_date: driver.car_manufactured_date,
            car_tex_passport_date: driver.car_tex_passport_date,
            license_date: driver.license_date
        });
        setInMark(driver.inmark)
        setAirconditioner(driver.airconditioner)
        setLuggage(driver.luggage)
        setDriverId(driver.id)
        getCarNames(driver.car_model.id)
    }

    const blockDriver = (status) => {
        if (status === "block" && reason.trim().length > 0) {
            axios.post(`${value.url}/dashboard/driver/${driverId}/block_driver/`,
                {reason}).then((response) => {
                setModalShow({status: "", show: false})
                getDrivers()
                setReason("")
            })
        }

        if (status === "unblock") {
            axios.post(`${value.url}/dashboard/driver/${driverId}/unblock_driver/`,
                {}).then((response) => {
                setModalShow({status: "", show: false})
                getDrivers()
            })
        }
    }

    const verify = (id) => {
        axios.post(`${value.url}/dashboard/driver/${id}/verify_driver/`,
            {}).then((response) => {
            getDrivers()
        })
    }

    const handleCheckboxChange = (serviceId) => {
        setSelectedIds((prevSelected) =>
            prevSelected.includes(serviceId)
                ? prevSelected.filter((id) => id !== serviceId) // Olib tashlash
                : [...prevSelected, serviceId] // Qo‘shish
        );
    };

    const sendService = () => {
        axios.post(`${value.url}/dashboard/driver/${driverId}/add_service/`,
            {service_list: selectedIds}).then((response) => {
            setModalShow({status: "", show: false})
            setSelectedIds([])
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
                    }} src={item.profile_image} alt=""/>
                </div>
                <div className="text-driver">
                    <div className="name">
                        {item.user && item.user.first_name} &nbsp;
                        {item.user && item.user.last_name}
                    </div>
                    <div className="phone">
                        {item.user && item.user.phone}
                    </div>
                </div>
            </td>
            <td>
                <div className="icon">
                    <img onClick={() => {
                        setModalShow({show: true, status: "car-information"});
                        setCarInformation(item)
                    }} src="./images/admin/sport-car.png" alt=""/>
                </div>
            </td>
            <td>
                <div className="icon">
                    <img onClick={() => {
                        openImageViewer(index)
                        setPhotoBox(item.car_images)
                    }} src="./images/admin/car-photo.png" alt=""/>
                </div>
            </td>
            <td>
                <div className="icon">
                    <img onClick={() => {
                        openImageViewer(index)
                        setPhotoBox(item.car_tex_passport_images)
                    }} src="./images/admin/document.png" alt=""/>
                </div>
            </td>
            <td>
                <div onClick={() => {
                    openImageViewer(index)
                    setPhotoBox(item.license_images)
                }} className="icon">
                    <img src="./images/admin/document.png" alt=""/>
                </div>
            </td>
            <td>{item.mark}</td>
            <td>
                <div onClick={() => {
                    setModalShow({show: true, status: "driver-service"});
                    setDriverId(item.id)

                }} className="icon">
                    <img src="./images/admin/steering.png" alt=""/>
                </div>
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

    return <div className="drivers-container">
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

                            <div className="title">Haydovchi qo'shish</div>

                            <div className="title-form">Haydovchi ma'lumotlari:</div>

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
                                </div>
                            </div>

                            <div className="title-form">Avtomobil ma'lumotlari:</div>

                            <div className="form-container">

                                <div className="select-box">
                                    <div className="select-sides">
                                        <FormControl sx={{m: 1, minWidth: "100%"}} size="small" className="selectMui">
                                            <InputLabel id="demo-select-large-label">Modeli</InputLabel>
                                            <Select
                                                error={formik.errors.car_model === "Required"}
                                                labelid="demo-select-small-label"
                                                id="demo-select-small"
                                                value={formik.values.car_model}
                                                name="car_model"
                                                label="Avtomobil rangi"
                                                onChange={formik.handleChange}
                                            >
                                                {
                                                    car_models.map((item, index) => {
                                                        return <MenuItem onClick={() => getCarNames(item.id)}
                                                                         key={index}
                                                                         value={item.id}>{item.name}</MenuItem>
                                                    })
                                                }
                                            </Select>
                                        </FormControl>
                                    </div>

                                    <div className="select-sides">
                                        <FormControl sx={{m: 1, minWidth: "100%"}} size="small" className="selectMui">
                                            <InputLabel id="demo-select-large-label">Nomi</InputLabel>
                                            <Select
                                                error={formik.errors.car_name === "Required"}
                                                labelid="demo-select-small-label"
                                                id="demo-select-small"
                                                value={formik.values.car_name}
                                                name="car_name"
                                                label="Avtomobil rangi"
                                                onChange={formik.handleChange}
                                            >
                                                {
                                                    car_names.map((item, index) => {
                                                        return <MenuItem key={index}
                                                                         value={item.id}>{item.name}</MenuItem>
                                                    })
                                                }
                                            </Select>
                                        </FormControl>

                                    </div>

                                    <div className="select-sides">
                                        <TextField
                                            error={formik.errors.car_number === "Required"}
                                            value={formik.values.car_number}
                                            onChange={formik.handleChange}
                                            name="car_number"
                                            type="text"
                                            sx={{m: 1, minWidth: "100%"}} size="small" id="outlined-basic"
                                            label="Avtomobil raqami" variant="outlined" className="textField"/>
                                    </div>
                                </div>

                                <div className="select-box ">
                                    <div className="select-sides">
                                        <FormControl sx={{m: 1, minWidth: "100%"}} size="small" className="selectMui">
                                            <InputLabel id="demo-select-large-label">Avtomobil rangi</InputLabel>
                                            <Select
                                                error={formik.errors.car_color === "Required"}
                                                labelid="demo-select-small-label"
                                                id="demo-select-small"
                                                name="car_color"
                                                value={formik.values.car_color}
                                                onChange={formik.handleChange}
                                            >
                                                {
                                                    car_colors.map((item, index) => {
                                                        return <MenuItem key={index}
                                                                         value={item.id}>{item.name}</MenuItem>
                                                    })
                                                }
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>
                            </div>

                            <div className="title-form">Xujjatlar berilgan sanalar:</div>

                            <div className="form-container">
                                <div className="select-box ">
                                    <div className="select-sides-time">
                                        <label htmlFor="">Avtomobil ishlab chiqarilgan sana:</label>
                                        <input
                                            className={`working_time ${formik.errors.car_manufactured_date === "Required" ? "working_time_required" : ""}`}
                                            name="car_manufactured_date" onChange={formik.handleChange}
                                            value={formik.values.car_manufactured_date}
                                            type="date"/>
                                    </div>

                                    <div className="select-sides-time">
                                        <label htmlFor="">Tex passport berilgan sana:</label>
                                        <input
                                            className={`working_time ${formik.errors.car_tex_passport_date === "Required" ? "working_time_required" : ""}`}
                                            name="car_tex_passport_date" onChange={formik.handleChange}
                                            value={formik.values.car_tex_passport_date}
                                            type="date"/>
                                    </div>

                                    <div className="select-sides-time">
                                        <label htmlFor="">Ruxsatnoma berilgan sana:</label>
                                        <input
                                            className={`working_time ${formik.errors.license_date === "Required" ? "working_time_required" : ""}`}
                                            name="license_date" onChange={formik.handleChange}
                                            value={formik.values.license_date}
                                            type="date"/>
                                    </div>
                                </div>
                            </div>

                            <div className="title-form">Avtomobil haqida qo'shimcha ma'lumotlar:</div>

                            <div className="form-container">
                                <div className="select-box">
                                    <div className="select-sides">
                                        <div className="title-on">
                                            Yuk olishi:
                                        </div>
                                        <div className="on-of">
                                            <div onClick={() => setLuggage(true)}
                                                 className={`of ${luggage ? "on" : ""}`}>
                                                Ha
                                            </div>
                                            <div onClick={() => setLuggage(false)}
                                                 className={`of ${!luggage ? "on" : ""}`}>
                                                Yoq
                                            </div>
                                        </div>
                                    </div>

                                    <div className="select-sides">
                                        <div className="title-on">
                                            Kondisaner:
                                        </div>
                                        <div className="on-of">
                                            <div onClick={() => setAirconditioner(true)}
                                                 className={`of ${airconditioner ? "on" : ""}`}>
                                                Bor
                                            </div>
                                            <div onClick={() => setAirconditioner(false)}
                                                 className={`of ${!airconditioner ? "on" : ""}`}>
                                                Yoq
                                            </div>
                                        </div>
                                    </div>

                                    <div className="select-sides">
                                        <div className="title-on">
                                            Inamarka:
                                        </div>
                                        <div className="on-of">
                                            <div onClick={() => setInMark(true)}
                                                 className={`of ${inmark ? "on" : ""}`}>
                                                Ha
                                            </div>
                                            <div onClick={() => setInMark(false)}
                                                 className={`of ${!inmark ? "on" : ""}`}>
                                                Yoq
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="title-form">Xujjatlar:</div>

                            <div className="form-container">
                                <div className="select-box">
                                    <div className="select-sides-file">
                                        <input multiple={true} name="car_images" onChange={getInputDocs} type="file"/>
                                        <div className={`sloy-image ${car_images.length > 0 ? "active" : ""}`}>
                                            Avtomobil rasmi
                                            <img src="./images/admin/image.png" alt=""/>
                                        </div>
                                    </div>

                                    <div className="select-sides-file">
                                        <input multiple={true} name="car_tex_passport_images" onChange={getInputDocs}
                                               type="file"/>
                                        <div
                                            className={`sloy-image ${car_tex_passport_images.length > 0 ? "active" : ""}`}>
                                            Tex passport rasmi
                                            <img src="./images/admin/image.png" alt=""/>
                                        </div>
                                    </div>

                                    <div className="select-sides-file">
                                        <input multiple={true} name="license_images" onChange={getInputDocs}
                                               type="file"/>
                                        <div className={`sloy-image ${license_images.length > 0 ? "active" : ""}`}>
                                            Ruxsatnoma rasmi
                                            <img src="./images/admin/image.png" alt=""/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div onClick={() => {
                                formik.handleSubmit()
                            }} className="add-btn">
                                <img src="./images/admin/add.png" alt=""/>
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

                    {modalShow.status === "car-information" && (
                        <div className="car-information">
                            <div className="cancel-btn">
                                <img onClick={() => setModalShow({status: "", show: false})}
                                     src="./images/admin/x.png"
                                     alt=""
                                />
                            </div>
                            <div className="title">
                                Avtomobil ma'lumotlari
                            </div>
                            {carInformation &&
                                <div className="information">
                                    <div className="info">
                                        <div className="title">Moshina modeli:</div>
                                        <div className="text">{carInformation.car_model.name}</div>
                                    </div>

                                    <div className="info">
                                        <div className="title">Moshina nomi:</div>
                                        <div className="text">{carInformation.car_name.name}</div>
                                    </div>

                                    <div className="info">
                                        <div className="title">Moshina raqami:</div>
                                        <div className="text">{carInformation.car_number}</div>
                                    </div>

                                    <div className="info">
                                        <div className="title">Moshina rangi:</div>
                                        <div className="text">{carInformation.car_color.name}</div>
                                    </div>

                                    {
                                        carInformation.avilable_service.length > 0 &&
                                        <div className="info">
                                            <div className="title">Haydovchi xizmatlari:</div>
                                            <div
                                                className="text">{carInformation.avilable_service &&
                                                carInformation.avilable_service.map((item, index) => {
                                                    return <span key={index}>{item.service.service} </span>
                                                })}</div>
                                        </div>
                                    }


                                    <div className="info">
                                        <div className="title">Ro'yxatdan o'tgan sana:</div>
                                        <div className="text">{carInformation.car_manufactured_date}</div>
                                    </div>

                                    <div className="info">
                                        <div className="title">Tex passport berilgan sana:</div>
                                        <div className="text">{carInformation.car_tex_passport_date}</div>
                                    </div>

                                    <div className="info">
                                        <div className="title">Ruxsotnoma berilgan sana:</div>
                                        <div className="text">{carInformation.license_date}</div>
                                    </div>

                                    <div className="info">
                                        <div className="title">Yuk orta olishi:</div>
                                        <div className="text">{carInformation.luggage === true ? "Ha" : "Yo'q"}</div>
                                    </div>

                                    <div className="info">
                                        <div className="title">Kondisaner:</div>
                                        <div
                                            className="text">{carInformation.airconditioner === true ? "Bor" : "Yo'q"}</div>
                                    </div>

                                    <div className="info">
                                        <div className="title">Inamarka:</div>
                                        <div
                                            className="text">{carInformation.inmark === true ? "Ha" : "Yo'q"}</div>
                                    </div>

                                    <div className="info">
                                        <div className="title">Tasdiqlanganmi:</div>
                                        <div className="text">{carInformation.status === "active" ? "Ha" : "Yo'q"}</div>
                                    </div>
                                </div>}
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

                            <div className="title">Haydovchi ma'lumotlarini tahrirlash</div>

                            <div className="title-form">Haydovchi ma'lumotlari:</div>

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
                                </div>
                            </div>

                            <div className="title-form">Avtomobil ma'lumotlari:</div>

                            <div className="form-container">
                                <div className="select-box">
                                    <div className="select-sides">
                                        <FormControl sx={{m: 1, minWidth: "100%"}} size="small" className="selectMui">
                                            <InputLabel id="demo-select-large-label">Modeli</InputLabel>
                                            <Select
                                                error={formik.errors.car_model === "Required"}
                                                labelid="demo-select-small-label"
                                                id="demo-select-small"
                                                value={formik.values.car_model}
                                                name="car_model"
                                                label="Avtomobil rangi"
                                                onChange={formik.handleChange}
                                            >
                                                {
                                                    car_models.map((item, index) => {
                                                        return <MenuItem onClick={() => getCarNames(item.id)}
                                                                         key={index}
                                                                         value={item.id}>{item.name}</MenuItem>
                                                    })
                                                }
                                            </Select>
                                        </FormControl>
                                    </div>

                                    <div className="select-sides">
                                        <FormControl sx={{m: 1, minWidth: "100%"}} size="small" className="selectMui">
                                            <InputLabel id="demo-select-large-label">Nomi</InputLabel>
                                            <Select
                                                error={formik.errors.car_name === "Required"}
                                                labelid="demo-select-small-label"
                                                id="demo-select-small"
                                                value={formik.values.car_name}
                                                name="car_name"
                                                label="Avtomobil rangi"
                                                onChange={formik.handleChange}
                                            >
                                                {
                                                    car_names.map((item, index) => {
                                                        return <MenuItem key={index}
                                                                         value={item.id}>{item.name}</MenuItem>
                                                    })
                                                }
                                            </Select>
                                        </FormControl>
                                    </div>

                                    <div className="select-sides">
                                        <TextField
                                            error={formik.errors.car_number === "Required"}
                                            value={formik.values.car_number}
                                            onChange={formik.handleChange}
                                            name="car_number"
                                            type="text"
                                            sx={{m: 1, minWidth: "100%"}} size="small" id="outlined-basic"
                                            label="Avtomobil raqami" variant="outlined" className="textField"/>
                                    </div>
                                </div>

                                <div className="select-box ">
                                    <div className="select-sides">
                                        <FormControl sx={{m: 1, minWidth: "100%"}} size="small" className="selectMui">
                                            <InputLabel id="demo-select-large-label">Avtomobil rangi</InputLabel>
                                            <Select
                                                error={formik.errors.car_color === "Required"}
                                                labelid="demo-select-small-label"
                                                id="demo-select-small"
                                                name="car_color"
                                                value={formik.values.car_color}
                                                onChange={formik.handleChange}
                                            >
                                                {
                                                    car_colors.map((item, index) => {
                                                        return <MenuItem key={index}
                                                                         value={item.id}>{item.name}</MenuItem>
                                                    })
                                                }
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>
                            </div>

                            <div className="title-form">Xujjatlar berilgan sanalar:</div>

                            <div className="form-container">
                                <div className="select-box ">
                                    <div className="select-sides-time">
                                        <label htmlFor="">Avtomobil ishlab chiqarilgan sana:</label>
                                        <input
                                            className={`working_time ${formik.errors.car_manufactured_date === "Required" ? "working_time_required" : ""}`}
                                            name="car_manufactured_date" onChange={formik.handleChange}
                                            value={formik.values.car_manufactured_date}
                                            type="date"/>
                                    </div>

                                    <div className="select-sides-time">
                                        <label htmlFor="">Tex passport berilgan sana:</label>
                                        <input
                                            className={`working_time ${formik.errors.car_tex_passport_date === "Required" ? "working_time_required" : ""}`}
                                            name="car_tex_passport_date" onChange={formik.handleChange}
                                            value={formik.values.car_tex_passport_date}
                                            type="date"/>
                                    </div>

                                    <div className="select-sides-time">
                                        <label htmlFor="">Ruxsatnoma berilgan sana:</label>
                                        <input
                                            className={`working_time ${formik.errors.license_date === "Required" ? "working_time_required" : ""}`}
                                            name="license_date" onChange={formik.handleChange}
                                            value={formik.values.license_date}
                                            type="date"/>
                                    </div>
                                </div>
                            </div>

                            <div className="title-form">Avtomobil haqida qo'shimcha ma'lumotlar:</div>

                            <div className="form-container">
                                <div className="select-box">
                                    <div className="select-sides">
                                        <div className="title-on">
                                            Yuk olishi:
                                        </div>
                                        <div className="on-of">
                                            <div onClick={() => setLuggage(true)}
                                                 className={`of ${luggage ? "on" : ""}`}>
                                                Ha
                                            </div>
                                            <div onClick={() => setLuggage(false)}
                                                 className={`of ${!luggage ? "on" : ""}`}>
                                                Yoq
                                            </div>
                                        </div>
                                    </div>

                                    <div className="select-sides">
                                        <div className="title-on">
                                            Kondisaner:
                                        </div>
                                        <div className="on-of">
                                            <div onClick={() => setAirconditioner(true)}
                                                 className={`of ${airconditioner ? "on" : ""}`}>
                                                Bor
                                            </div>
                                            <div onClick={() => setAirconditioner(false)}
                                                 className={`of ${!airconditioner ? "on" : ""}`}>
                                                Yoq
                                            </div>
                                        </div>
                                    </div>

                                    <div className="select-sides">
                                        <div className="title-on">
                                            Inamarka:
                                        </div>
                                        <div className="on-of">
                                            <div onClick={() => setInMark(true)}
                                                 className={`of ${inmark ? "on" : ""}`}>
                                                Ha
                                            </div>
                                            <div onClick={() => setInMark(false)}
                                                 className={`of ${!inmark ? "on" : ""}`}>
                                                Yoq
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="title-form">Xujjatlar:</div>

                            <div className="form-container">
                                <div className="select-box">
                                    <div className="select-sides-file">
                                        <input multiple={true} name="car_images" onChange={getInputDocs} type="file"/>
                                        <div className={`sloy-image ${car_images.length > 0 ? "active" : ""}`}>
                                            Avtomobil rasmi
                                            <img src="./images/admin/image.png" alt=""/>
                                        </div>
                                    </div>

                                    <div className="select-sides-file">
                                        <input multiple={true} name="car_tex_passport_images" onChange={getInputDocs}
                                               type="file"/>
                                        <div
                                            className={`sloy-image ${car_tex_passport_images.length > 0 ? "active" : ""}`}>
                                            Tex passport rasmi
                                            <img src="./images/admin/image.png" alt=""/>
                                        </div>
                                    </div>

                                    <div className="select-sides-file">
                                        <input multiple={true} name="license_images" onChange={getInputDocs}
                                               type="file"/>
                                        <div className={`sloy-image ${license_images.length > 0 ? "active" : ""}`}>
                                            Ruxsatnoma rasmi
                                            <img src="./images/admin/image.png" alt=""/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div onClick={() => {
                                formik.handleSubmit()
                            }} className="add-btn">
                                <img src="./images/admin/checkmark.png" alt=""/>
                            </div>

                        </div>
                    )}

                    {modalShow.status === "driver-service" && (
                        <div className="driver-service">
                            <div className="cancel-btn">
                                <img onClick={() => setModalShow({status: "", show: false})}
                                     src="./images/admin/x.png"
                                     alt=""
                                />
                            </div>
                            <div className="title">
                                Haydovchi xizmatlari
                            </div>
                            <div className="form-wrapper">
                                {
                                    services.map((service, index) => (
                                        <label key={index}>
                                            <input onChange={() => handleCheckboxChange(service.id)}
                                                   checked={selectedIds.includes(service.id)} type="checkbox"
                                                   name="agree"/>
                                            {service.service}
                                        </label>
                                    ))
                                }
                            </div>
                            <div onClick={sendService} className="btn-success">
                                Tasdiqlash
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </CSSTransition>

        <div className="open-viewer">
            {isViewerOpen && (
                <ImageViewer
                    src={photoBox.map((item) => item.image)}
                    currentIndex={currentImage}
                    disableScroll={false}
                    closeOnClickOutside={true}
                    onClose={closeImageViewer}
                />
            )}
        </div>

        <div className="header">

            <div className="search-box">
                <img src="./images/admin/search.png" alt=""/>
                <input onChange={(e) => setGetSearchText(e.target.value)} placeholder="Telefon raqam kiriting" type="text"/>
            </div>

            <div onClick={() => {
                setModalShow({show: true, status: "add-driver"});
            }} className="add-driver-btn">
                Haydovchi qo'shish
            </div>

        </div>

        <div className="table-wrapper">
            <table>
                <thead>
                <tr>
                    <th>№</th>
                    <th>Haydovchi haqida</th>
                    <th>Moshina ma'lumotlari</th>
                    <th>Moshina rasmlari</th>
                    <th>Tex p.d</th>
                    <th>Ruxsatnoma</th>
                    <th>Baholash</th>
                    <th>Xizmat qo'shish</th>
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

export default Drivers