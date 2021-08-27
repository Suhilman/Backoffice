import React from "react";
import { useTranslation } from "react-i18next";
import { Tabs, Tab } from "react-bootstrap";

import PaymentModule from "./PaymentModule";
import PaymentModule2 from "./PaymentModule2";

export const PaymentModulPage = () => {
  const [tabs, setTabs] = React.useState("payment");
  const { t } = useTranslation()

  return (
    <>
      <Tabs activeKey={tabs} onSelect={(v) => setTabs(v)}>
        <Tab eventKey="payment" title={t("individualRegistration")}>
          <PaymentModule/>
        </Tab>

        <Tab eventKey="payment2" title={t("PTRegistration")}>
          <PaymentModule2/>
        </Tab>
      </Tabs>
    </>
  );
};
