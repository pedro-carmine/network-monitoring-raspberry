import React, { Fragment , useState, useEffect} from "react";

const ListData = () => {

    const [data, setData]  = useState([]);
    const [pi_id, setDescription] = useState("");

    const refresh = async () => {
        window.state = "/";
    }

    const onSubmitForm = async (event) => {
        event.preventDefault();
        try {
            if (pi_id === "") {
                getData();
            }
            else {
                const emp = [{id_pi: pi_id}];
                setData(data.filter(({id_pi}) => emp.some(exclude => exclude.id_pi === id_pi)));
            }

        } catch (error) {
            console.error(error.message());
        }
    }

    const getData = async () => {
      try {
          const response = await fetch("/data");
          const jsonData = await response.json();

          setData(jsonData);
      }  catch (error) {
          console.error(error.message());
      }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <Fragment>
            <form className={"d-flex mt-5"} onSubmit={onSubmitForm}>
                <input
                    type={"text"}
                    className={"form-control me-1"}
                    value={pi_id}
                    onChange={e => setDescription(e.target.value)}
                />
                <button className={"btn btn-outline-primary btn-sm"}>Get Data</button>
            </form>
            <table className="table mt-3">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Maximum</th>
                        <th>Minimum</th>
                        <th>Average</th>
                        <th>Date</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                {data.map(singleData => (
                    <tr key={ (singleData.id_pi, singleData.id_date, singleData.hour) }>
                        <td>{singleData.id_pi}</td>
                        <td>{singleData.max}</td>
                        <td>{singleData.min}</td>
                        <td>{singleData.avg}</td>
                        <td>{`${singleData.day}/${singleData.month}/${singleData.year}`}</td>
                        <td>{singleData.hour}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </Fragment>
    );
};

export default ListData;