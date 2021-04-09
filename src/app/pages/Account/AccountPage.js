import React from "react";
import { useTranslation } from "react-i18next";
import { Tabs, Tab } from "react-bootstrap";
import NotificationExpired from "../../components/NotificationExpired"

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
  const { t } = useTranslation();
  React.useEffect(() => {
    handleUser();
  }, []);

  return (
    <>
      <NotificationExpired />
      <Tabs activeKey={tabs} onSelect={(v) => setTabs(v)}>
        <Tab eventKey="account" title={t("accountInformation")}>
          <AccountInformation/>
        </Tab>

        <Tab
          eventKey="business"
          title={t("businessInformation")}
          disabled={user === "owner" ? false : true}
        >
          <BusinessInformation/>
        </Tab>

        <Tab
          eventKey="email"
          title={t("emailNotification")}
          disabled={user === "owner" ? false : true}
        >
          <EmailNotifications/>
        </Tab>
      </Tabs>
    </>
  );
};
