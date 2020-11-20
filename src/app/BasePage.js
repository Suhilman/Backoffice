import React, { Suspense } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";

import { DashboardPage } from "./pages/DashboardPage";
import { ReportPage } from "./pages/Report/ReportPage";

import { StaffPage } from "./pages/Staff/StaffPage";
import { AddStaffPage } from "./pages/Staff/AddStaffPage";
import { DetailStaffPage } from "./pages/Staff/DetailStaffPage";
import { AccountPage } from "./pages/Account/AccountPage";
import { ProductPage } from "./pages/Product/ProductPage";
import { AddProductPage } from "./pages/Product/ProductTab/AddProductPage";
import { EditProductPage } from "./pages/Product/ProductTab/EditProductPage";
import { OutletPage } from "./pages/Outlet/OutletPage";
import { RolePage } from "./pages/Role/RolePage";
import { CustomerPage } from "./pages/Customer/CustomerPage";
import { DetailCustomerPage } from "./pages/Customer/DetailCustomerPage";
import { PromoPage } from "./pages/Promo/PromoPage";
import { SpecialPromoPage } from "./pages/Promo/SpecialPromo/SpecialPromoPage";
import { VoucherPromoPage } from "./pages/Promo/VoucherPromo/VoucherPromoPage";
import { AutomaticPromoPage } from "./pages/Promo/AutomaticPromo/AutomaticPromoPage";
import { AddAutomaticPromoPage } from "./pages/Promo/AutomaticPromo/AddAutomaticPromoPage";
import { EditAutomaticPromoPage } from "./pages/Promo/AutomaticPromo/EditAutomaticPromoPage";

export default function BasePage() {
  const [currPrivileges, setCurrPrivileges] = React.useState({
    view_dashboard: false,
    view_report: false,
    product_management: false,
    outlet_management: false,
    staff_management: false,
    role_management: false,
    promo_management: false,
    customer_management: false
  });

  const { privileges } = JSON.parse(localStorage.getItem("user_info"));
  const user = privileges ? "staff" : "owner";

  React.useEffect(() => {
    const priv = { ...currPrivileges };

    if (user === "staff") {
      const curr = privileges.filter((item) => item.access === "Backend");
      curr.forEach((section) => {
        priv[section.name] = section.allow;
      });
    } else {
      const curr = Object.keys(priv);
      curr.forEach((section) => {
        priv[section] = true;
      });
    }

    setCurrPrivileges(priv);
  }, []);

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {user === "staff" ? (
          <Redirect exact from="/" to="/account" />
        ) : (
          <Redirect exact from="/" to="/dashboard" />
        )}

        <ProtectedRoute
          isAllowed={currPrivileges.view_dashboard}
          isRoute={false}
          exact={false}
          path="/dashboard"
          component={DashboardPage}
        />
        <ProtectedRoute
          isAllowed={currPrivileges.view_report}
          isRoute={false}
          exact={false}
          path="/report"
          component={ReportPage}
        />

        <ProtectedRoute
          isAllowed={currPrivileges.product_management}
          isRoute={false}
          exact={true}
          path="/product"
          component={ProductPage}
        />
        <ProtectedRoute
          isAllowed={currPrivileges.product_management}
          isRoute={true}
          exact={false}
          path="/product/add-product"
          component={AddProductPage}
        />
        <ProtectedRoute
          isAllowed={currPrivileges.product_management}
          isRoute={true}
          exact={false}
          path="/product/:productId"
          component={EditProductPage}
        />

        <ProtectedRoute
          isAllowed={currPrivileges.outlet_management}
          isRoute={false}
          exact={false}
          path="/outlet"
          component={OutletPage}
        />

        <ProtectedRoute
          isAllowed={currPrivileges.staff_management}
          isRoute={false}
          exact={true}
          path="/staff"
          component={StaffPage}
        />
        <ProtectedRoute
          isAllowed={currPrivileges.staff_management}
          isRoute={true}
          exact={false}
          path="/staff/add-staff"
          component={AddStaffPage}
        />
        <ProtectedRoute
          isAllowed={currPrivileges.staff_management}
          isRoute={true}
          exact={false}
          path="/staff/:staffId"
          component={DetailStaffPage}
        />

        <ProtectedRoute
          isAllowed={currPrivileges.role_management}
          isRoute={false}
          exact={false}
          path="/role"
          component={RolePage}
        />

        <ProtectedRoute
          isAllowed={currPrivileges.promo_management}
          isRoute={false}
          exact={true}
          path="/promo"
          component={PromoPage}
        />
        <ProtectedRoute
          isAllowed={currPrivileges.promo_management}
          isRoute={true}
          exact={false}
          path="/promo/special-promo"
          component={SpecialPromoPage}
        />
        <ProtectedRoute
          isAllowed={currPrivileges.promo_management}
          isRoute={true}
          exact={false}
          path="/promo/voucher-promo"
          component={VoucherPromoPage}
        />
        <ProtectedRoute
          isAllowed={currPrivileges.promo_management}
          isRoute={false}
          exact={true}
          path="/promo/automatic-promo"
          component={AutomaticPromoPage}
        />
        <ProtectedRoute
          isAllowed={currPrivileges.promo_management}
          isRoute={true}
          exact={false}
          path="/promo/automatic-promo/add-automatic-promo"
          component={AddAutomaticPromoPage}
        />
        <ProtectedRoute
          isAllowed={currPrivileges.promo_management}
          isRoute={true}
          exact={false}
          path="/promo/automatic-promo/:promoId"
          component={EditAutomaticPromoPage}
        />

        <ProtectedRoute
          isAllowed={currPrivileges.customer_management}
          isRoute={false}
          exact={true}
          path="/customer"
          component={CustomerPage}
        />

        <ProtectedRoute
          isAllowed={currPrivileges.customer_management}
          isRoute={true}
          exact={false}
          path="/customer/:customerId"
          component={DetailCustomerPage}
        />

        <ContentRoute path="/account" component={AccountPage} />
        <Redirect to="error/error-v1" />
      </Switch>
    </Suspense>
  );
}

export const ProtectedRoute = ({
  isRoute,
  isAllowed,
  component: Component,
  path,
  ...rest
}) => {
  return (
    <>
      {isRoute ? (
        <Route
          {...rest}
          render={(props) =>
            isAllowed ? (
              <Component {...props} />
            ) : (
              <Redirect exact from={path} to="/account" />
            )
          }
        />
      ) : (
        <ContentRoute
          {...rest}
          render={(props) =>
            isAllowed ? (
              <Component {...props} />
            ) : (
              <Redirect exact from={path} to="/account" />
            )
          }
        />
      )}
    </>
  );
};
