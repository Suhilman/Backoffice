import React from "react";
import axios from "axios";
import dayjs from "dayjs";
import { Table } from "react-bootstrap";
import rupiahFormat from "rupiah-format";

import "../style.css";

export const RecapTab = ({ selectedOutlet, startDate, endDate }) => {
  const [allRecaps, setAllRecaps] = React.useState([]);

  const getRecap = async (id, start_range, end_range) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const outlet_id = id ? `?outlet_id=${id}&` : "?";

    if (start_range === end_range) {
      end_range = dayjs(end_range)
        .add(1, "day")
        .format("YYYY-MM-DD");
    }

    if (new Date(start_range) > new Date(end_range)) {
      start_range = dayjs(start_range)
        .subtract(1, "day")
        .format("YYYY-MM-DD");
      end_range = dayjs(end_range)
        .add(1, "day")
        .format("YYYY-MM-DD");
    }

    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/recap${outlet_id}date_start=${start_range}&date_end=${end_range}`
      );
      setAllRecaps(data.data);
    } catch (err) {
      if (err.response.status === 404) {
        setAllRecaps([]);
      }
      console.log(err);
    }
  };

  React.useEffect(() => {
    getRecap(selectedOutlet.id, startDate, endDate);
  }, [selectedOutlet, startDate, endDate]);

  const recapData = () => {
    const data = [];

    allRecaps.forEach((item) => {
      data.push({
        recap_date: item.time_open,
        user: item.User?.User_Profile?.name || "-",
        recap_time_open: item.time_open,
        recap_time_close: item.time_close,
        total_actual: item.actual_total,
        total_system: item.system_total,
        difference: item.difference
      });
    });

    data.sort((a, b) => new Date(b.recap_date) - new Date(a.recap_date));

    // const totalTransactions = data.reduce(
    //   (init, curr) => (init += curr.transaction),
    //   0
    // );
    // const totalAmount = data.reduce((init, curr) => (init += curr.total), 0);

    // data.push({
    //   method: "",
    //   transaction: totalTransactions,
    //   total: totalAmount
    // });

    return data;
  };

  return (
    <>
      <Table striped>
        <thead>
          <tr>
            <th></th>
            <th>Recap Date</th>
            <th>User</th>
            <th>Recap Time Open</th>
            <th>Recap Time Close</th>
            <th>Total Actual</th>
            <th>Total System</th>
            <th>Difference</th>
          </tr>
        </thead>
        <tbody>
          {recapData().map((item, index) => {
            return (
              <tr key={index}>
                <td></td>
                <td>{dayjs(item.recap_date).format("DD/MM/YYYY")}</td>
                <td>{item.user}</td>
                <td>{dayjs(item.recap_time_open).format("HH:mm")}</td>
                <td>
                  {item.recap_time_close
                    ? dayjs(item.recap_time_close).format("HH:mm")
                    : "-"}
                </td>
                <td>{rupiahFormat.convert(item.total_actual)}</td>
                <td>{rupiahFormat.convert(item.total_system)}</td>
                <td>{rupiahFormat.convert(item.difference)}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};
