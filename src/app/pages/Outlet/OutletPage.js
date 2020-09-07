import React from "react";
import axios from "axios";

import { Tabs, Tab } from "react-bootstrap";

import { OutletTab } from "./OutletTab/OutletTab";
import { TaxTab } from "./TaxTab/TaxTab";

export const OutletPage = () => {
  const [tabs, setTabs] = React.useState("outlet");
  const [allOutlets, setAllOutlets] = React.useState([]);
  const [allProvinces, setAllProvinces] = React.useState([]);
  const [allTaxes, setAllTaxes] = React.useState([]);
  const [refresh, setRefresh] = React.useState(0);

  const handleRefresh = () => setRefresh((state) => state + 1);

  const getOutlets = async () => {
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      const { data } = await axios.get(`${API_URL}/api/v1/outlet`);
      setAllOutlets(data.data);
    } catch (err) {
      setAllOutlets([]);
    }
  };

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
    getOutlets();
    getProvinces();
    getTaxes();
    console.log(refresh);
  }, [refresh]);

  return (
    <Tabs activeKey={tabs} onSelect={(v) => setTabs(v)}>
      <Tab eventKey="outlet" title="Outlet">
        <OutletTab
          allOutlets={allOutlets}
          allProvinces={allProvinces}
          allTaxes={allTaxes}
          handleRefresh={handleRefresh}
        />
      </Tab>

      <Tab eventKey="tax" title="Tax & Charges">
        <TaxTab
          allOutlets={allOutlets}
          allProvinces={allProvinces}
          allTaxes={allTaxes}
          handleRefresh={handleRefresh}
        />
      </Tab>
    </Tabs>
  );
};
