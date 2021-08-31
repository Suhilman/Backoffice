import React, {useEffect, useState} from 'react';

import {
  Row,
  Col,
  Form
} from "react-bootstrap";
import { useTranslation } from "react-i18next";

import {
  Paper
} from "@material-ui/core";

import './style.css'

const StatusRegistration = ({t}) => {
  return (
    <div>
      <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
        <div className="headerPage mb-5">
          <div className="headerStart">
            <h3>{t("statusRegistration")}</h3>
          </div>
        </div>
        <div class="container">
          <div class="row">
						<div class="col-12 col-md-10 hh-grayBox pt45 pb20">
							<div class="row justify-content-between">
								<div class="order-tracking completed">
									<span class="is-complete"></span>
									<p>Sudah diajuhkan di Beetpos<br /><span>Mon, June 24</span></p>
								</div>
								<div class="order-tracking completed">
									<span class="is-complete"></span>
									<p>Sedang diproses Payment Gateway<br /><span>Tue, June 25</span></p>
								</div>
								<div class="order-tracking completed">
									<span class="is-complete"></span>
									<p>Masa Penerbitan Cashlez<br /><span>Fri, June 28</span></p>
								</div>
								<div class="order-tracking">
									<span class="is-complete"></span>
									<p>Status Selesai<br /><span>Fri, June 28</span></p>
								</div>

							</div>
						</div>
					</div>
        </div>
      </Paper>
    </div>
  );
}

export default StatusRegistration;
