import React, { Fragment , useState, useEffect} from "react";

const ListData = () => {

    const [data, setData]  = useState([]);

    const getData = async () => {
      try {
          const response = await fetch("http://localhost:8080/data");
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
            {" "}
            <table className="table mt-5">
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