import React from "react";

import { Tabs, Tab } from "react-bootstrap";

import { AccountInformation } from "./AccountInformationTab";
import { BusinessInformation } from "./BusinessInformationTab";
import { EmailNotifications } from "./EmailNotificationsTab";

export const AccountPage = () => {
  const [tabs, setTabs] = React.useState("account");

  return (
    <Tabs activeKey={tabs} onSelect={(v) => setTabs(v)}>
      <Tab eventKey="account" title="Account Information">
        <AccountInformation />
      </Tab>

      <Tab eventKey="business" title="Business Information">
        <BusinessInformation />
      </Tab>

      <Tab eventKey="email" title="Email Notifications">
        <EmailNotifications />
      </Tab>
    </Tabs>
  );
};
