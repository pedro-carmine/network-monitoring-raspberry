import React, { Fragment, useState } from "react";

const InputId = () => {
    const [pi_id, setDescription] = useState("")

    const onSubmitForm = async (event) => {
        event.preventDefault();
        try {
            const body = { pi_id }
            const response = await fetch(`data/id/${pi_id}`, {
                method: "GET"
            });

            window.location = "/";
        } catch (error) {
            console.error(error.message());
        }
    }

    return <Fragment>
        <h1 className={"text-center mt-5"}>Network Monitoring Hub</h1>
        <form className={"d-flex mt-3"} onSubmit={onSubmitForm}>
            <input
                type={"text"}
                className={"form-control me-1"}
                value={pi_id}
                onChange={e => setDescription(e.target.value)}
            />
            <button className={"btn btn-outline-primary btn-sm"}>Get Data</button>
        </form>
    </Fragment>
};

export default InputId;