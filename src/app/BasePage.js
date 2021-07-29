import React, { Suspense } from "react";
import axios from 'axios'
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
import { LoyaltyPromoPage } from "./pages/Promo/LoyaltyPromo/LoyaltyPromoPage";
import { InventoryPage } from "./pages/Inventory/InventoryPage";
import { IncomingStockPage } from "./pages/Inventory/InventoryTab/IncomingStock/IncomingStockPage";
import { AddIncomingStockPage } from "./pages/Inventory/InventoryTab/IncomingStock/AddPage";
import { DetailIncomingStockPage } from "./pages/Inventory/InventoryTab/IncomingStock/DetailPage";
import { OutcomingStockPage } from "./pages/Inventory/InventoryTab/OutcomingStock/OutcomingStockPage";
import { AddOutcomingStockPage } from "./pages/Inventory/InventoryTab/OutcomingStock/AddPage";
import { DetailOutcomingStockPage } from "./pages/Inventory/InventoryTab/OutcomingStock/DetailPage";
import { TransferStockPage } from "./pages/Inventory/InventoryTab/TransferStock/TransferStockPage";
import { AddTransferStockPage } from "./pages/Inventory/InventoryTab/TransferStock/AddPage";
import { DetailTransferStockPage } from "./pages/Inventory/InventoryTab/TransferStock/DetailPage";
import { StockOpnamePage } from "./pages/Inventory/InventoryTab/StockOpname/StockOpnamePage";
import { AddStockOpnamePage } from "./pages/Inventory/InventoryTab/StockOpname/AddPage";
import { DetailStockOpnamePage } from "./pages/Inventory/InventoryTab/StockOpname/DetailPage";
import { AddPurchaseOrderPage } from "./pages/Inventory/PurchaseOrderTab/AddPage";
import { DetailPurchaseOrderPage } from "./pages/Inventory/PurchaseOrderTab/DetailPage";
import { IngredientPage } from "./pages/Ingredient/IngredientPage";
import { EditRecipePage } from "./pages/Ingredient/RecipeTab/EditPage";
import { IncomingMaterialPage } from "./pages/Ingredient/InventoryTab/IncomingStock/IncomingMaterialPage";
import { AddIncomingMaterialPage } from "./pages/Ingredient/InventoryTab/IncomingStock/AddPage";
import { DetailIncomingMaterialPage } from "./pages/Ingredient/InventoryTab/IncomingStock/DetailPage";
import { OutcomingMaterialPage } from "./pages/Ingredient/InventoryTab/OutcomingStock/OutcomingMaterialPage";
import { AddOutcomingMaterialPage } from "./pages/Ingredient/InventoryTab/OutcomingStock/AddPage";
import { DetailOutcomingMaterialPage } from "./pages/Ingredient/InventoryTab/OutcomingStock/DetailPage";
import { TransferMaterialPage } from "./pages/Ingredient/InventoryTab/TransferStock/TransferMaterialPage";
import { AddTransferMaterialPage } from "./pages/Ingredient/InventoryTab/TransferStock/AddPage";
import { DetailTransferMaterialPage } from "./pages/Ingredient/InventoryTab/TransferStock/DetailPage";
import { OpnameMaterialPage } from "./pages/Ingredient/InventoryTab/StockOpname/OpnameMaterialPage";
import { AddOpnameMaterialPage } from "./pages/Ingredient/InventoryTab/StockOpname/AddPage";
import { DetailOpnameMaterialPage } from "./pages/Ingredient/InventoryTab/StockOpname/DetailPage";
import { AddBundlePage } from "./pages/Product/ProductTab/AddBundle";
import { EditBundlePage } from "./pages/Product/ProductTab/EditBundle";
import Commission from "./pages/Commission/CommissionPage"
import AddGroupCommission from "./pages/Commission/AddGroupCommission"
import EditGroupCommission from "./pages/Commission/EditGroupCommission"
import NotificationExpired from "./components/NotificationExpired"

export default function BasePage() {
  const [currPrivileges, setCurrPrivileges] = React.useState({
    view_dashboard: false,
    view_report: false,
    product_management: false,
    outlet_management: false,
    staff_management: false,
    role_management: false,
    promo_management: false,
    customer_management: false,
    inventory_management: false,
    kitchen_management: false,
    commission_management: false
  });

  const localData = JSON.parse(localStorage.getItem("user_info"));
  const privileges = localData?.privileges ? localData.privileges : "";
  const user = privileges ? "staff" : "owner";
  
  const handleCurrPrivileges = async () => {
    try {
      const priv = { ...currPrivileges };
      if (user === "staff") {
        const {data} = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/staff/${localData.user_id}`)
        const rolePrivileges = data.data.User.Role.Role_Privileges
        const resultPrivileges = rolePrivileges.map(value => {
          return {
            name: value.Privilege.name.toLowerCase().split(' ').join('_'),
            access: value.Privilege.Access.name,
            allow: value.allow
          }
        })
        const curr = resultPrivileges.filter((item) => item.access === "Backend");
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
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    handleCurrPrivileges()
  }, []);

  console.log("currPrivileges", currPrivileges)

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
          isAllowed={currPrivileges.product_management}
          isRoute={true}
          exact={false}
          path="/product-bundle/add"
          component={AddBundlePage}
        />
        <ProtectedRoute
          isAllowed={currPrivileges.product_management}
          isRoute={false}
          exact={true}
          path="/product-bundle/:productId"
          component={EditBundlePage}
        />

        <ProtectedRoute
          isAllowed={currPrivileges.inventory_management}
          isRoute={false}
          exact={true}
          path="/inventory"
          component={InventoryPage}
        />
        <ProtectedRoute
          isAllowed={currPrivileges.inventory_management}
          isRoute={false}
          exact={true}
          path="/inventory/incoming-stock"
          component={IncomingStockPage}
        />
        <ProtectedRoute
          isAllowed={currPrivileges.inventory_management}
          isRoute={false}
          exact={true}
          path="/inventory/incoming-stock/add"
          component={AddIncomingStockPage}
        />
        <ProtectedRoute
          isAllowed={currPrivileges.inventory_management}
          isRoute={false}
          exact={true}
          path="/inventory/incoming-stock/:stockId"
          component={DetailIncomingStockPage}
        />

        <ProtectedRoute
          isAllowed={currPrivileges.inventory_management}
          isRoute={false}
          exact={true}
          path="/inventory/outcoming-stock"
          component={OutcomingStockPage}
        />
        <ProtectedRoute
          isAllowed={currPrivileges.inventory_management}
          isRoute={false}
          exact={true}
          path="/inventory/outcoming-stock/add"
          component={AddOutcomingStockPage}
        />
        <ProtectedRoute
          isAllowed={currPrivileges.inventory_management}
          isRoute={false}
          exact={true}
          path="/inventory/outcoming-stock/:stockId"
          component={DetailOutcomingStockPage}
        />

        <ProtectedRoute
          isAllowed={currPrivileges.inventory_management}
          isRoute={false}
          exact={true}
          path="/inventory/transfer-stock"
          component={TransferStockPage}
        />
        <ProtectedRoute
          isAllowed={currPrivileges.inventory_management}
          isRoute={false}
          exact={true}
          path="/inventory/transfer-stock/add"
          component={AddTransferStockPage}
        />
        <ProtectedRoute
          isAllowed={currPrivileges.inventory_management}
          isRoute={false}
          exact={true}
          path="/inventory/transfer-stock/:stockId"
          component={DetailTransferStockPage}
        />

        <ProtectedRoute
          isAllowed={currPrivileges.inventory_management}
          isRoute={false}
          exact={true}
          path="/inventory/stock-opname"
          component={StockOpnamePage}
        />
        <ProtectedRoute
          isAllowed={currPrivileges.inventory_management}
          isRoute={false}
          exact={true}
          path="/inventory/stock-opname/add"
          component={AddStockOpnamePage}
        />
        <ProtectedRoute
          isAllowed={currPrivileges.inventory_management}
          isRoute={false}
          exact={true}
          path="/inventory/stock-opname/:stockId"
          component={DetailStockOpnamePage}
        />

        <ProtectedRoute
          isAllowed={currPrivileges.inventory_management}
          isRoute={false}
          exact={true}
          path="/inventory/purchase-order/add"
          component={AddPurchaseOrderPage}
        />
        <ProtectedRoute
          isAllowed={currPrivileges.inventory_management}
          isRoute={false}
          exact={true}
          path="/inventory/purchase-order/:orderId"
          component={DetailPurchaseOrderPage}
        />

        <ProtectedRoute
          isAllowed={currPrivileges.kitchen_management}
          isRoute={false}
          exact={true}
          path="/ingredient-inventory"
          component={IngredientPage}
        />
        <ProtectedRoute
          isAllowed={currPrivileges.kitchen_management}
          isRoute={false}
          exact={true}
          path="/ingredient-inventory/recipe/:recipeId"
          component={EditRecipePage}
        />
        <ProtectedRoute
          isAllowed={currPrivileges.kitchen_management}
          isRoute={false}
          exact={true}
          path="/ingredient-inventory/incoming-stock"
          component={IncomingMaterialPage}
        />
        <ProtectedRoute
          isAllowed={currPrivileges.kitchen_management}
          isRoute={false}
          exact={true}
          path="/ingredient-inventory/incoming-stock/add"
          component={AddIncomingMaterialPage}
        />
        <ProtectedRoute
          isAllowed={currPrivileges.kitchen_management}
          isRoute={false}
          exact={true}
          path="/ingredient-inventory/incoming-stock/:materialId"
          component={DetailIncomingMaterialPage}
        />
        <ProtectedRoute
          isAllowed={currPrivileges.kitchen_management}
          isRoute={false}
          exact={true}
          path="/ingredient-inventory/outcoming-stock"
          component={OutcomingMaterialPage}
        />
        <ProtectedRoute
          isAllowed={currPrivileges.kitchen_management}
          isRoute={false}
          exact={true}
          path="/ingredient-inventory/outcoming-stock/add"
          component={AddOutcomingMaterialPage}
        />
        <ProtectedRoute
          isAllowed={currPrivileges.kitchen_management}
          isRoute={false}
          exact={true}
          path="/ingredient-inventory/outcoming-stock/:materialId"
          component={DetailOutcomingMaterialPage}
        />
        <ProtectedRoute
          isAllowed={currPrivileges.kitchen_management}
          isRoute={false}
          exact={true}
          path="/ingredient-inventory/transfer-stock"
          component={TransferMaterialPage}
        />
        <ProtectedRoute
          isAllowed={currPrivileges.kitchen_management}
          isRoute={false}
          exact={true}
          path="/ingredient-inventory/transfer-stock/add"
          component={AddTransferMaterialPage}
        />
        <ProtectedRoute
          isAllowed={currPrivileges.kitchen_management}
          isRoute={false}
          exact={true}
          path="/ingredient-inventory/transfer-stock/:materialId"
          component={DetailTransferMaterialPage}
        />
        <ProtectedRoute
          isAllowed={currPrivileges.kitchen_management}
          isRoute={false}
          exact={true}
          path="/ingredient-inventory/stock-opname"
          component={OpnameMaterialPage}
        />
        <ProtectedRoute
          isAllowed={currPrivileges.kitchen_management}
          isRoute={false}
          exact={true}
          path="/ingredient-inventory/stock-opname/add"
          component={AddOpnameMaterialPage}
        />
        <ProtectedRoute
          isAllowed={currPrivileges.kitchen_management}
          isRoute={false}
          exact={true}
          path="/ingredient-inventory/stock-opname/:materialId"
          component={DetailOpnameMaterialPage}
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
          isAllowed={currPrivileges.promo_management}
          isRoute={false}
          exact={true}
          path="/promo/point-loyalty-system"
          component={LoyaltyPromoPage}
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

        <ProtectedRoute
          isAllowed={currPrivileges.commission_management}
          isRoute={false}
          exact={true}
          path="/commission" 
          component={Commission}
        />

        <ProtectedRoute
          isAllowed={currPrivileges.commission_management}
          isRoute={true}
          exact={false}
          path="/commission/add-group-commission"
          component={AddGroupCommission}
        />

        <ProtectedRoute
          isAllowed={currPrivileges.commission_management}
          isRoute={true}
          exact={false}
          path="/commission/group-commission/:commissionId"
          component={EditGroupCommission}
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
      <NotificationExpired />
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
