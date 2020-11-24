import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { Row, Col, Button } from "react-bootstrap";
import { Paper } from "@material-ui/core";

import "../style.css";

export const PromoPage = () => {
  const [promoCategories, setPromoCategories] = React.useState([]);

  const getPromoCategories = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/promo-category`);
      setPromoCategories(data.data);
    } catch (err) {
      setPromoCategories([]);
    }
  };

  React.useEffect(() => {
    getPromoCategories();
  }, []);

  return (
    <>
      {promoCategories.map((item, index) => {
        const link = item.name
          .split(" ")
          .map((val) => val.replace(/[^A-Za-z0-9]/, "-"))
          .join("-")
          .toLowerCase();

        let activePromos = [];
        if (item.name === "Special Promo") {
          activePromos = item.Promos.filter(
            (val) => val.Special_Promo.status === "active"
          );
        }
        if (item.name === "Automatic Promo") {
          activePromos = item.Promos.filter(
            (val) => val.Automatic_Promo.status === "active"
          );
        }
        if (item.name === "Voucher Promo") {
          activePromos = item.Promos.filter(
            (val) => val.Voucher_Promo.status === "active"
          );
        }
        if (item.name === "Point/Loyalty System") {
          activePromos = item.Promos.filter(
            (val) => val.Loyalty_Promo.Product.status === "active"
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
                      {activePromos.length ? activePromos.length : "No"} Active
                      Promo
                    </p>

                    <Link to={`promo/${link}`}>
                      <Button
                        variant="primary"
                        style={{ marginLeft: "1rem", borderRadius: "2rem" }}
                      >
                        View Promo
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
