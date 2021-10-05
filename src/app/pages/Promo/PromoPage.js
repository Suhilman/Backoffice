import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { Row, Col, Button } from "react-bootstrap";
import { Paper } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import "../style.css";

export const PromoPage = () => {
  const [promoCategories, setPromoCategories] = React.useState([]);
  const { t } = useTranslation();
  const getPromoCategories = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/promo-category`);
      data.data.map(value => {
        console.log("value.name", value.name)
        console.log("value.description", value.description)
        console.log("t('specialPromo')", t("specialPromo"))
        if (value.name === "Special Promo") {
          value.name = t("specialPromo")
          value.description = t("aPromoThatCanBeAppliedToACertainGroup/Individual")
        }
        if (value.name === "Automatic Promo") {
          value.name = t("automaticPromo")
          value.description = t("aPromoThatCanBeAutomaticallyAppliedIfATransactionMetACertainCriteriaThatHasBeenSet")
        }
        if (value.name === "Voucher Promo") {
          value.name = t("voucherPromo")
          value.description = t("voucherCanBeCreatedAndSharedToTheCustomerForADiscount")
        }
        if (value.name === "Point/Loyalty System") {
          value.name = t("point/LoyaltySystem")
          value.description = t("point/LoyalitySystemCanBeActivedToGiveCustomerLoyalityPointsThatCanBeExchangedForRewardsAndDiscount")
        }
      })
      console.log("data.data", data.data)
      setPromoCategories(data.data);
    } catch (err) {
      setPromoCategories([]);
    }
  };

  React.useEffect(() => {
    getPromoCategories();
  }, []);
  const dataKategoriPromo = [
    {
      id: 1,
      name: "Special Promo",
      description: "A promo that can be applied to a certain group / individual. Can be applied by the cashier.",
    },
    {
      id: 2,
      name: "Automatic Promo",
      description: "A promo that can be automatically applied if a transaction met a certain criteria that has been set.",
    },
    {
      id: 3,
      name: "Voucher Promo",
      description: "Voucher can be created and shared to the customer for a discount.",
    },
    {
      id: 4,
      name: "Point/Loyalty System",
      description: "Point / Loyalty System can be activated to give customer loyalty points that can be exchanged for rewards and discounts.",
    }
  ]
  console.log("promoCategories", promoCategories)
  return (
    <>
      {promoCategories.map((item, index) => {
        if (item.name === "Sistem Poin / Kesetiaan") {
          item.name = "Special Promo"
        }
        if (item.name === "Promo Voucher") {
          item.name = "Voucher Promo"
        }
        if (item.name === "Promo Otomatis") {
          item.name = "Automatic Promo"
        }
        if (item.name === "Promo Khusus") {
          item.name = "Special Promo"
        }
        // console.log("ini item apa", item)
        const link = item.name
          .split(" ")
          .map((val) => val.replace(/[^A-Za-z0-9]/, "-"))
          .join("-")
          .toLowerCase();

        let activePromos = [];
        if (item.name === t("specialPromo")) {
          activePromos = item.Promos.filter(
            (val) => val.Special_Promo?.status === "active"
          );
        }
        if (item.name === t("automaticPromo")) {
          activePromos = item.Promos.filter(
            (val) => val.Automatic_Promo?.status === "active"
          );
        }
        if (item.name === t("voucherPromo")) {
          activePromos = item.Promos.filter(
            (val) => val.Voucher_Promo?.status === "active"
          );
        }
        if (item.name === t("point/LoyaltySystem")) {
          activePromos = item.Promos.filter(
            (val) => val.Loyalty_Promo?.status === "active"
          );
        }

        return (
          <Row key={index} style={{ marginBottom: "2rem" }}>
            <Col>
              <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
                <div className="headerPage">
                  <div className="headerStart">
                    <h5>{item.name}</h5>
                  </div>
                  <div className="headerEnd" style={{ display: "inline-flex" }}>
                    <p style={{ margin: 0, alignSelf: "center" }}>
                      {activePromos.length ? activePromos.length : "No"} {t("activePromo")}
                    </p>

                    <Link to={`promo/${link}`}>
                      <Button
                        variant="primary"
                        style={{ marginLeft: "1rem", borderRadius: "2rem" }}
                      >
                        {t("viewPromo")}
                      </Button>
                    </Link>
                  </div>
                </div>

                <div style={{ padding: "1rem" }}>{item.description}</div>
              </Paper>
            </Col>
          </Row>
        );
      })}
    </>
  );
};
