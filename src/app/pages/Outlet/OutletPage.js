import React from "react";
import axios from "axios";

import { Tabs, Tab } from "react-bootstrap";

import { OutletTab } from "./OutletTab/OutletTab";
import { TaxTab } from "./TaxTab/TaxTab";
import { PaymentTab } from "./PaymentTab/PaymentTab";
import { TableManagementTab } from "./TableManagementTab/TableManagementTab";
import { SalesTypeTab } from "./SalesTypeTab/SalesTypeTab";

export const OutletPage = () => {
  const [tabs, setTabs] = React.useState("outlet");
  const [allProvinces, setAllProvinces] = React.useState([]);
  const [allTaxes, setAllTaxes] = React.useState([]);
  const [refresh, setRefresh] = React.useState(0);

  const handleRefresh = () => setRefresh((state) => state + 1);

  const getProvinces = async () => {
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      const { data } = await axios.get(`${API_URL}/api/v1/province`);
      setAllProvinces(data.data);
    } catch (err) {
      setAllProvinces([]);
    }
  };

  const getTaxes = async () => {
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      const { data } = await axios.get(`${API_URL}/api/v1/tax`);
      setAllTaxes(data.data);
    } catch (err) {
      setAllTaxes([]);
    }
  };

  React.useEffect(() => {
    getProvinces();
    getTaxes();
  }, [refresh]);

  return (
    <Tabs activeKey={tabs} onSelect={(v) => setTabs(v)}>
      <Tab eventKey="outlet" title="Outlet">
        <OutletTab
          allProvinces={allProvinces}
          allTaxes={allTaxes}
          handleRefresh={handleRefresh}
          refresh={refresh}
        />
      </Tab>

      <Tab eventKey="tax" title="Tax & Charges">
        <TaxTab handleRefresh={handleRefresh} refresh={refresh} />
      </Tab>

      <Tab eventKey="payment" title="Payment">
        <PaymentTab handleRefresh={handleRefresh} refresh={refresh} />
      </Tab>

      <Tab eventKey="sales-type" title="Sales Type">
        <SalesTypeTab handleRefresh={handleRefresh} refresh={refresh} />
      </Tab>

      <Tab eventKey="table-management" title="Table Management">
        <TableManagementTab handleRefresh={handleRefresh} refresh={refresh} />
      </Tab>
    </Tabs>
  );
};
