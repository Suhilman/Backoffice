import React, {useEffect, useState} from 'react';
import axios from 'axios'
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";

import {
  Button,
  InputGroup,
  Form,
  Row,
  Col,
  Dropdown,
  ListGroup
} from "react-bootstrap";

const CommissionReport = () => {
  const { t } = useTranslation();
  const API_URL = process.env.REACT_APP_API_URL;
  const [commissionReport, setCommissionReport] = useState([])

  const getStaffId = async () => {
    try {
    const dataCommission = await axios.get(`${API_URL}/api/v1/commission`)
    const dataTransaction = await axios.get(`${API_URL}/api/v1/transaction`)
    const resultStaffIdCommission = []
    const resultStaffIdTransaction = []
    const resultAllStaffId = []
    const bismillah = []

    dataCommission.data.data.map(value => {
      const result = JSON.parse(value.staff_id)
      result.map(value2 => {
        resultStaffIdCommission.push(value2)
      })
    })

    dataTransaction.data.data.map((value) => {
      dataCommission.data.data.map((value2) => {
        const staffId = JSON.parse(value2.staff_id)
        staffId.map(value3 => {
          console.log("value3", value3)
          if (value.user_id === value3) {
            value.totalCommission = value2.total
            value.groupCommissionName = value2.name
            value.commisisonDateTime = value2.createdAt
            value.dateCommission = value.createdAt.split("T")[0]
            value.timeCommission = value.createdAt.split("T")[1]
            bismillah.push(value)
          }
        })
      })
    })
    setCommissionReport(bismillah)
    console.log("bismillah", bismillah)
    } catch (error) {
      console.error(error)
    }
  }

  const getDataStaff = async () => {
  }

  useEffect(() => {
    getStaffId()
  }, [])

  const columns = [
    {
      name: `${t("employeesName")}`,
      selector: "employees_name",
      sortable: true
    },
    {
      name: `${t("outlet")}`,
      selector: "outlet",
      sortable: true
    },
    {
      name: `${t("commissionTransaction")}`,
      selector: "commission_transaction",
      sortable: true
    },
    {
      name: `${t("totalCommission")}`,
      selector: "total_commission",
      sortable: true
    }
  ];
  // const commissionReport = [
  //   {
  //     employees_name: "Hanif",
  //     outlet: "AVE 2",
  //     commission_transaction: 3,
  //     total_commission: 15000
  //   },
  //   {
  //     employees_name: "Anthony",
  //     outlet: "Green Lake",
  //     commission_transaction: 4,
  //     total_commission: 16000
  //   }
  // ]
  const data = commissionReport.map(value => {
    return {
      employees_name: value.User?.User_Profile.name,
      outlet: value.Outlet?.name,
      commission_transaction: 3,
      total_commission: value.totalCommission
    }
  })

  const ExpandableComponent = ({ data }) => {
    console.log("data apa", data)
    return (
      <>
        <ListGroup style={{ padding: "1rem", marginLeft: "1rem" }}>
          <ListGroup.Item>
            <Row>
              <Col style={{ fontWeight: "700" }}>{t("groupCommission")}</Col>
              <Col style={{ fontWeight: "700" }}>{t("dateCommission")}</Col>
              <Col style={{ fontWeight: "700" }}>{t("timeCommission")}</Col>
              <Col style={{ fontWeight: "700" }}>{t("totalCommission")}</Col>
            </Row>
          </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Cleaner</Col>
                <Col>10/05/2021</Col>
                <Col>14:01</Col>
                <Col>5000</Col>
              </Row>
            </ListGroup.Item>
        </ListGroup>
      </>
    );
  };

  return (
    <div>
      <div style={{ display: "none" }}>
        <table id="table-commission-report">
          <tr>
            <th>{t("exportCommissionReport")}</th>
          </tr>
          <tr>
            <th scope="col" style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("groupCommission")}</th>
            <th scope="col" style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("dateCommission")}</th>
            <th scope="col" style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("timeCommission")}</th>
            <th scope="col" style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("totalCommission")}</th>
          </tr>
          {commissionReport ? (
            commissionReport.map(item => 
              <tr>
                <td>{item.User?.User_Profile.name}</td>
                <td>{item.Outlet?.name}</td>
                <td>3</td>
                <td>{item.totalCommission}</td>
            </tr>
            )
          ) : null }
        </table>
      </div>
      <DataTable
          noHeader
          pagination
          columns={columns}
          expandableRows
          expandableRowsComponent={<ExpandableComponent />}
          data={data}
          style={{ minHeight: "100%" }}
        />
    </div>
  );
}

export default CommissionReport;
