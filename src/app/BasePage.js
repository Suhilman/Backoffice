import React, { Suspense, lazy } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";
import { BuilderPage } from "./pages/BuilderPage";
import { MyPage } from "./pages/MyPage";
import { DashboardPage } from "./pages/DashboardPage";
import { StaffPage } from "./pages/Staff/StaffPage";
import { AddStaffPage } from "./pages/Staff/AddStaffPage";
import { DetailStaffPage } from "./pages/Staff/DetailStaffPage";
import { AccountPage } from "./pages/Account/AccountPage";
import { ProductPage } from "./pages/Product/ProductPage";
import { AddProductPage } from "./pages/Product/ProductTab/AddProductPage";
import { EditProductPage } from "./pages/Product/ProductTab/EditProductPage";
import { AddProductModifierPage } from "./pages/Product/ProductModifierTab/AddProductModifierPage";
import { EditProductModifierPage } from "./pages/Product/ProductModifierTab/EditProductModifierPage";

export default function BasePage() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          <Redirect exact from="/" to="/dashboard" />
        }
        <ContentRoute path="/dashboard" component={DashboardPage} />

        <Route exact path="/staff" component={StaffPage} />
        <Route path="/staff/add-staff" component={AddStaffPage} />
        <Route path="/staff/:staffId" component={DetailStaffPage} />

        <Route exact path="/account" component={AccountPage} />

        <Route exact path="/product" component={ProductPage} />
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

        <Redirect to="error/error-v1" />
      </Switch>
    </Suspense>
  );
}
