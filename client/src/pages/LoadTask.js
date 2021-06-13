import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router";
import Context from "../context/newTask/context";
import { ADDHOST, DELHOST, NEW_REF } from "../refs";
import ClipLoader from "react-spinners/ClipLoader";

const LoadTask = () => {
    const { setAll, inputValues } = useContext(Context);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    useEffect(() => {
        getJsonData();
        setLoading(true);
    }, []);

    const sendRequest = (url) => {
        const requestOptions = {
            headers: { "Content-Type": "application/json" },
        };

        return fetch(url, requestOptions).then((response) => {
            if (response.ok) {
                return response.json();
            }

            return response.json().then((error) => {
                const e = new Error("Что-то пошло не так");
                e.data = error;
                throw e;
            });
        });
    };

    const getJsonData = async () => {
        await sendRequest(ADDHOST)
            .then((data) => {
                console.log(data);
                console.log(typeof data);
                setData(data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onLoad = (id) => {
        setAll(data[id].newTaskstate);
        inputValues.current = data[id].inputValues;
        history.push(NEW_REF);
    };

    const postFetch = (url, body = null) => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        };

        return fetch(url, requestOptions).then((response) => {
            if (response.ok) {
                return response.json();
            }

            return response.json().then((error) => {
                const e = new Error("Что-то пошло не так");
                e.data = error;
                throw e;
            });
        });
    };

    const onDelete = async (id) => {
        const d = data.filter((item, i) => i !== id);
        setData(d);
        await postFetch(DELHOST, d).catch((err) => {
            console.log(err);
        });
    };

    const GetData = () => {
        console.log(data);
        if (data.length === 0) {
            return (
                <>
                    <h3 className='text-center'>Список сохранённых конфигураций пуст!</h3>
                </>
            );
        }

        const GetRows = () => {
            return data.map((obj, i) => {
                return (
                    <>
                        <tr key={i}>
                            <th className="text-center" scope="row">
                                {i + 1}
                            </th>
                            <td className="text-center">{obj.name || "<пусто>"}</td>
                            <td className="text-center">{obj.date || "<пусто>"}</td>
                            <td className="p-2">
                                <div className="d-flex">
                                    <Button
                                        className="w-50 ml-3"
                                        variant="primary"
                                        pointer={i}
                                        size="sm"
                                        onClick={() => onLoad(i)}
                                    >
                                        Загрузить
                                    </Button>
                                    <Button
                                        className="w-50 ml-3"
                                        variant="danger"
                                        size="sm"
                                        pointer={i}
                                        onClick={() => onDelete(i)}
                                    >
                                        Удалить
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    </>
                );
            });
        };

        return (
            <>
                <table className="table table-striped ref_table ">
                    <thead>
                        <tr>
                            <th scope="col" style={{ width: "5%" }}>
                                #
                            </th>
                            <th scope="col">Название</th>
                            <th scope="col">Дата загрузки</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <GetRows />
                    </tbody>
                </table>
            </>
        );
    };

    return (
        <>
            {loading ? (
                <div className="d-flex justify-content-center">
                    <ClipLoader color={"#1C1D1C"} loading={loading} size={50} />
                </div>
            ) : (
                <GetData />
            )}
        </>
    );
};

export default LoadTask;