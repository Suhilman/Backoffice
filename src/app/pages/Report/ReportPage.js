import React from "react";
import axios from "axios";

import { Tabs, Tab } from "react-bootstrap";

import { SalesSummaryTab } from "./SalesSummaryTab";
import { PaymentMethodTab } from "./PaymentMethodTab";
import { SalesTypeTab } from "./SalesTypeTab";
import { CategorySalesTab } from "./CategorySalesTab";
import { ModifierSalesTab } from "./ModifierSalesTab";

export const ReportPage = () => {
  const [tabs, setTabs] = React.useState("sales-summary");
  const [allOutlets, setAllOutlets] = React.useState([]);

  const getOutlets = async () => {
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      const { data } = await axios.get(`${API_URL}/api/v1/outlet`);
      setAllOutlets(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    getOutlets();
  }, []);

  return (
    <Tabs activeKey={tabs} onSelect={(v) => setTabs(v)}>
      <Tab eventKey="sales-summary" title="Sales Summary">
        <SalesSummaryTab allOutlets={allOutlets} />
      </Tab>

      <Tab eventKey="payment-method" title="Payment Method">
        <PaymentMethodTab allOutlets={allOutlets} />
      </Tab>

      <Tab eventKey="sales-type" title="Sales Type">
        <SalesTypeTab allOutlets={allOutlets} />
      </Tab>

      <Tab eventKey="category-sales" title="Category Sales">
        <CategorySalesTab allOutlets={allOutlets} />
      </Tab>

      <Tab eventKey="modifier-sales" title="Modifier Sales">
        <ModifierSalesTab allOutlets={allOutlets} />
      </Tab>
    </Tabs>
  );
};
