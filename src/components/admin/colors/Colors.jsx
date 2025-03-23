import "./style.scss"
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {MyContext} from "../../App/App";

const Colors = () => {
    let value = useContext(MyContext);
    const [name, setName] = useState('')
    const [colorsList, setColorsList] = useState([])
    const [edit, setEdit] = useState(false)
    const [editId, setEditId] = useState('')

    const getDrivers = () => {
        axios.get(`${value.url}/dashboard/color/`).then((response) => {
            setColorsList(response.data);
        })
    }

    useEffect(() => {
        getDrivers()
    }, []);

    const addColor = (status) => {
        if (status === "add") {
            if (name.trim().length > 0) {
                axios.post(`${value.url}/dashboard/color/`, {name},
                    {}).then((response) => {
                    setName('')
                    getDrivers()
                })
            } else alert("Rang nomini kiriting")
        }

        if (status === "edit") {
            if (name.trim().length > 0) {
                axios.put(`${value.url}/dashboard/color/${editId}/`, {name},
                    {}).then((response) => {
                    setName('')
                    getDrivers()
                    setEdit(false)
                })
            } else alert("Rang nomini kiriting")
        }
    }

    const delColor = (id) => {
        axios.delete(`${value.url}/dashboard/color/${id}/`).then((response) => {
            setName('')
            getDrivers()
            setEdit(false)
        })
    }

    return <div className="colors-wrapper">
        <div className="header">
            <div className="form-wrapper">
                <input value={name} onChange={(e) => setName(e.target.value)}
                       placeholder="Moshina rangi nomi..."
                       type="text"/>

                {edit ? <div onClick={() => addColor("edit")} className="add-color">
                    <img src="./images/admin/checkmark.png" alt=""/>
                </div> : <div onClick={() => addColor("add")} className="add-color">
                    <img src="./images/admin/add.png" alt=""/>
                </div>}

            </div>
        </div>
        <div className="colors-cards">
            <div className="wrapper-box">
                {
                    colorsList.map((color, index) => (
                        <div key={index} className="color-card">
                            <div className="name">{color.name}</div>
                            <div className="bttons">
                                <div onClick={() => {
                                    setEdit(true)
                                    setName(color.name)
                                    setEditId(color.id)
                                }} className="btn">
                                    <img src="./images/admin/edit-tools.png" alt=""/>
                                </div>

                                <div onClick={() => delColor(color.id)} className="btn">
                                    <img src="./images/admin/delete.png" alt=""/>
                                </div>
                            </div>
                        </div>
                    ))
                }

            </div>
        </div>
    </div>
}

export default Colors;