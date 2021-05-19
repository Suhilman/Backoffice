import React from 'react';

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
  const commissionReport = [
    {
      employees_name: "Hanif",
      outlet: "AVE 2",
      commission_transaction: 3,
      total_commission: 15000
    },
    {
      employees_name: "Anthony",
      outlet: "Green Lake",
      commission_transaction: 4,
      total_commission: 16000
    }
  ]

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
      <DataTable
          noHeader
          pagination
          columns={columns}
          expandableRows
          expandableRowsComponent={<ExpandableComponent />}
          data={commissionReport}
          style={{ minHeight: "100%" }}
        />
    </div>
  );
}

export default CommissionReport;
