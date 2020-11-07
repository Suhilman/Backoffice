import React from "react";

import { Tabs, Tab } from "react-bootstrap";

import { AccountInformation } from "./AccountInformationTab";
import { BusinessInformation } from "./BusinessInformationTab";
import { EmailNotifications } from "./EmailNotificationsTab";

export const AccountPage = () => {
  const [tabs, setTabs] = React.useState("account");
  const [user, setUser] = React.useState("");

  const handleUser = () => {
    const curr = JSON.parse(localStorage.getItem("user_info")).privileges
      ? "staff"
      : "owner";
    setUser(curr);
  };

  React.useEffect(() => {
    handleUser();
  }, []);

  return (
    <Tabs activeKey={tabs} onSelect={(v) => setTabs(v)}>
      <Tab eventKey="account" title="Account Information">
        <AccountInformation />
      </Tab>

      <Tab
        eventKey="business"
        title="Business Information"
        disabled={user === "owner" ? false : true}
      >
        <BusinessInformation />
      </Tab>

      <Tab
        eventKey="email"
        title="Email Notifications"
        disabled={user === "owner" ? false : true}
      >
        <EmailNotifications />
      </Tab>
    </Tabs>
  );
};
