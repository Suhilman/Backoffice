import React from "react";
import axios from "axios";
import { Tabs, Tab } from "react-bootstrap";

import InventoryTab from "./InventoryTab/InventoryTab";

export const InventoryPage = () => {
  const [tabs, setTabs] = React.useState("inventory");

  return (
    <Tabs activeKey={tabs} onSelect={(v) => setTabs(v)}>
      <Tab eventKey="inventory" title="Inventory">
        <InventoryTab />
      </Tab>
    </Tabs>
  );
};
