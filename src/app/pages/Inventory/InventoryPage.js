import React from "react";
import { Tabs, Tab } from "react-bootstrap";

import InventoryTab from "./InventoryTab/InventoryTab";
import SupplierTab from "./SupplierTab/SupplierTab";
import PurchaseTab from "./PurchaseOrderTab/PurchaseOrderPage";

export const InventoryPage = () => {
  const [tabs, setTabs] = React.useState("inventory");
  const [refresh, setRefresh] = React.useState(0);

  const handleRefresh = () => setRefresh((state) => state + 1);

  return (
    <Tabs activeKey={tabs} onSelect={(v) => setTabs(v)}>
      <Tab eventKey="inventory" title="Inventory">
        <InventoryTab />
      </Tab>

      <Tab eventKey="supplier" title="Supplier">
        <SupplierTab refresh={refresh} handleRefresh={handleRefresh} />
      </Tab>

      <Tab eventKey="purchase" title="Purchase Order">
        <PurchaseTab refresh={refresh} handleRefresh={handleRefresh} />
      </Tab>
    </Tabs>
  );
};
