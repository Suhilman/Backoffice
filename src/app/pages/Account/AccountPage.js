import React from "react";

import { Tabs, Tab } from "react-bootstrap";
import { CssBaseline } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { AccountInformation } from "./AccountInformationTab";
import { BusinessInformation } from "./BusinessInformationTab";
import { EmailNotifications } from "./EmailNotificationsTab";

export const useStyles = makeStyles({
  header: {
    padding: "1rem",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "space-between",
    position: "relative",
    borderBottom: "1px solid #ebedf2",
    width: "100%"
  },
  headerStart: {
    alignContent: "flex-start",
    alignSelf: "center"
  },
  headerEnd: {
    alignContent: "flex-end"
  },
  padding: {
    padding: "1rem"
  },
  box: {
    border: "1px solid #ebedf2",
    padding: "1rem"
  }
});

export const AccountPage = () => {
  const [tabs, setTabs] = React.useState("account");

  return (
    <>
      <CssBaseline />

      <Tabs activeKey={tabs} onSelect={v => setTabs(v)}>
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
    </>
  );
};
