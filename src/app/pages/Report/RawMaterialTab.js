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
  const getRecipe = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/recipe`);
      const rawMaterials = await axios.get(`${API_URL}/api/v1/raw-material`);
      const result = []
      data.data.map(value => {
        value.Recipe_Materials.map(value2 => {
          if(selectedOutlet.id){
            if(selectedOutlet.id == value2.Raw_Material.outlet_id) {
              // if(new Date(startDate) < new Date(endDate))
              result.push(value2)
            }
          } else {
            result.push(value2)
          }
        })
      })
      
      // console.log("ini id dan jumlah quantity yang kan mengurangi stock", result)
      // console.log("ini id dan jumlah quantity yang kan dikurangi stock", rawMaterials.data.data)
      result.map(value => {
        rawMaterials.data.data.map(value2 => {
          if(value.raw_material_id === value2.id) {
            value.remainingAmount = value2.stock - value.quantity
          }
        })
      })
      setDataExport(result)
    } catch (err) {
      console.log(err)
    }
  };

  useEffect(() => {
    getRecipe()
  }, [selectedOutlet, endDate, startDate, startTime, endTime])
  console.log("dataExport", dataExport)

  const rawMaterialReport = dataExport.map(value => {
    return {
      raw_material: value.Raw_Material.name,
      used_amount: value.quantity,
      remaining_amount: value.remainingAmount,
      unit: value.Unit.name
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
                <td>{item.quantity}</td>
                <td>{item.remainingAmount}</td>
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
