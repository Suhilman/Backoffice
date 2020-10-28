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
import { AddProductModifierPage } from "./pages/Product/ProductModifierTab/AddProductModifierPage";
import { EditProductModifierPage } from "./pages/Product/ProductModifierTab/EditProductModifierPage";
import { OutletPage } from "./pages/Outlet/OutletPage";
import { RolePage } from "./pages/Role/RolePage";
import { PromoPage } from "./pages/Promo/PromoPage";
import { SpecialPromoPage } from "./pages/Promo/SpecialPromoPage";

export default function BasePage() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          <Redirect exact from="/" to="/dashboard" />
        }
        <ContentRoute path="/dashboard" component={DashboardPage} />
        <ContentRoute path="/report" component={ReportPage} />
        <ContentRoute exact path="/staff" component={StaffPage} />
        <ContentRoute path="/outlet" component={OutletPage} />
        <ContentRoute path="/account" component={AccountPage} />
        <ContentRoute exact path="/product" component={ProductPage} />

        <Route path="/staff/add-staff" component={AddStaffPage} />
        <Route path="/staff/:staffId" component={DetailStaffPage} />

        <Route path="/product/add-product" component={AddProductPage} />
        <Route
          path="/product/add-product-modifier"
          component={AddProductModifierPage}
        />

        <Route
          path="/product/edit-product-modifier/:groupId"
          component={EditProductModifierPage}
        />
        <Route path="/product/:productId" component={EditProductPage} />

        <Route path="/role" component={RolePage} />
        <Route exact path="/promo" component={PromoPage} />
        <Route path="/promo/special-promo" component={SpecialPromoPage} />

        <Redirect to="error/error-v1" />
      </Switch>
    </Suspense>
  );
}
