import React, {useEffect, useState} from 'react';
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import axios from 'axios'
import dayjs from "dayjs";

const RawMaterialTab = ({selectedOutlet,
  endDate,
  startDate,
  startTime,
  endTime}) => {
  const { t } = useTranslation();
  const [dataExport, setDataExport] = useState([])

  console.log("selectedOutlet", selectedOutlet)
  console.log("endDate", endDate)
  console.log("startDate", startDate)
  console.log("startTime", startTime)
  console.log("endTime", endTime)

  const columns = [
    {
      name: `${t("rawMaterial")}`,
      selector: "raw_material",
      sortable: true
    },
    {
      name: `${t("usedAmount")}`,
      selector: "used_amount",
      sortable: true
    },
    {
      name: `${t("remainingAmount")}`,
      selector: "remaining_amount",
      sortable: true
    },
    {
      name: `${t("unit")}`,
      selector: "unit",
      sortable: true
    }
  ];
  const getRecipe = async (id, start_range, end_range) => {
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

    console.log("id outlet raw material report", id)
    console.log("start_range raw material report", start_range)
    console.log("end_range raw material report", end_range)

    const API_URL = process.env.REACT_APP_API_URL;
    const outlet_id = id ? `outlet_id=${id}` : "";

    try {
      const transaction = await axios.get(`${API_URL}/api/v1/transaction?${outlet_id}&date_start=${start_range}&date_end=${end_range}`)
      const { data } = await axios.get(`${API_URL}/api/v1/recipe`);
      const rawMaterials = await axios.get(`${API_URL}/api/v1/raw-material`);

      console.log("recipe data data", data.data)
      console.log("transaction.data.data", transaction.data.data)
      console.log("rawMaterials.data.data", rawMaterials.data.data)
      const idProductTransaction = []
      transaction.data.data.map(value => {
        value.Transaction_Items.map(value2 => {
          idProductTransaction.push({product_id: value2.product_id, quantity: value2.quantity})
        })
      })

      const recipeMaterials = []
      data.data.map(value => {
        idProductTransaction.map(value2 => {
          if(value.product_id === value2.product_id) {
            console.log("value recipe bismillah", value.Recipe_Materials)
            console.log("value2.quantity", value2.quantity)
            if(value.Recipe_Materials.length > 0) {
              console.log("value.Recipe_Materials.quantity", value.Recipe_Materials[0].quantity)
              value.Recipe_Materials[0].salto = value.Recipe_Materials[0].quantity * value2.quantity
              console.log("value aslinya", value.Recipe_Materials)
              recipeMaterials.push(value.Recipe_Materials[0])
            }
          }
        })
      })

      console.log("idProductTransaction", idProductTransaction)
      console.log("recipeMaterials", recipeMaterials)

      setDataExport(recipeMaterials)
    } catch (err) {
      setDataExport([])
      console.error(err)
    }
  };

  useEffect(() => {
    getRecipe(selectedOutlet.id, startDate, endDate)
  }, [selectedOutlet, startDate, endDate])

  const rawMaterialReport = dataExport.map(value => {
    return {
      raw_material: value.Raw_Material?.name,
      used_amount: value.salto,
      remaining_amount: value.Raw_Material?.stock,
      unit: value.Unit?.name
    }
  })

  return (
    <>
      <div style={{ display: "none" }}>
        <table id="table-raw-material-report">
          <tr>
            <th>{t("exportRawMaterialResult")}</th>
          </tr>
          <tr>
            <th scope="col" style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("rawMaterial")}</th>
            <th scope="col" style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("usedAmount")}</th>
            <th scope="col" style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("remainingAmount")}</th>
            <th scope="col" style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("unit")}</th>
          </tr>
          {dataExport ? (
            dataExport.map(item => 
              <tr>
                <td>{item.Raw_Material?.name}</td>
                <td>{item.salto}</td>
                <td>{item.Raw_Material?.stock}</td>
                <td>{item.Unit?.name}</td>
            </tr>
            )
          ) : null }
        </table>
      </div>
      <div>
        <DataTable
          noHeader
          pagination
          columns={columns}
          data={rawMaterialReport}
          style={{ minHeight: "100%" }}
        />
      </div>
    </>
  );
}

export default RawMaterialTab;
