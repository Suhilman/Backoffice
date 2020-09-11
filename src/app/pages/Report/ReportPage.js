import React from "react";

import { Tabs, Tab } from "react-bootstrap";

import { SalesSummaryTab } from "./SalesSummaryTab";
import { PaymentMethodTab } from "./PaymentMethodTab";
import { SalesTypeTab } from "./SalesTypeTab";
import { CategorySalesTab } from "./CategorySalesTab";
import { ModifierSalesTab } from "./ModifierSalesTab";

export const ReportPage = () => {
  const [tabs, setTabs] = React.useState("sales-summary");
  const [refresh, setRefresh] = React.useState(0);

  const handleRefresh = () => setRefresh((state) => state + 1);

  React.useEffect(() => {}, [refresh]);

  return (
    <Tabs activeKey={tabs} onSelect={(v) => setTabs(v)}>
      <Tab eventKey="sales-summary" title="Sales Summary">
        <SalesSummaryTab handleRefresh={handleRefresh} />
      </Tab>

      <Tab eventKey="payment-method" title="Payment Method">
        <PaymentMethodTab handleRefresh={handleRefresh} />
      </Tab>

      <Tab eventKey="sales-type" title="Sales Type">
        <SalesTypeTab handleRefresh={handleRefresh} />
      </Tab>

      <Tab eventKey="category-sales" title="Category Sales">
        <CategorySalesTab handleRefresh={handleRefresh} />
      </Tab>

      <Tab eventKey="modifier-sales" title="Modifier Sales">
        <ModifierSalesTab handleRefresh={handleRefresh} />
      </Tab>
    </Tabs>
  );
};
