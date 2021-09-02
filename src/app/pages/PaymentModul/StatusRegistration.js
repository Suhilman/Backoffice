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

const StatusRegistration = ({
	t,
	business,
	businessFormData
}) => {
  return (
    <div>
      <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
        <div className="headerPage mb-5">
          <div className="headerStart">
            <h3>{t("statusRegistration")}</h3>
          </div>
        </div>
        <div className="container">
					{businessFormData.map(value => 
						<div className="row">
						<div className="col-12 col-md-10 hh-grayBox pt45 pb20">
							<div className="row justify-content-between">
								<div className={`order-tracking ${value.tracking_process > 0 && value.tracking_process < 5 ? 'completed' : ''}`}>
									<span className="is-complete"></span>
									<p>Sudah diajukan di Beetpos<br /><span>{value.date_tracking_1 ? value.date_tracking_1 : ""}</span>
									<br />
									{/* <span>{value.time_tracking_1 ? value.time_tracking_1 : ""}</span> */}
									</p>
								</div>
								<div className={`order-tracking ${value.tracking_process > 1 && value.tracking_process < 5 ? 'completed' : ''}`}>
									<span className="is-complete"></span>
									<p>Sedang diproses Payment Gateway<br /><span>{value.date_tracking_2 ? value.date_tracking_2 : ""}</span>
									<br />
									{/* <span>{value.time_tracking_2 ? value.time_tracking_2 : ""}</span> */}
									</p>
								</div>
								<div className={`order-tracking ${value.tracking_process > 2 && value.tracking_process < 5 ? 'completed' : ''}`}>
									<span className="is-complete"></span>
									<p>Masa Penerbitan Cashlez<br /><span>{value.date_tracking_3 ? value.date_tracking_3 : ""}</span>
									<br />
									{/* <span>{value.time_tracking_3 ? value.time_tracking_3 : ""}</span> */}
									</p>
								</div>
								<div className={`order-tracking ${value.tracking_process > 3 && value.tracking_process < 5 ? 'completed' : ''}`}>
									<span className="is-complete"></span>
									<p>Status Selesai<br /><span>{value.date_tracking_4 ? value.date_tracking_4 : ""}</span>
									<br />
									{/* <span>{value.time_tracking_4 ? value.time_tracking_4 : ""}</span> */}
									</p>
								</div>
							</div>
						</div>
					</div>
					)}
        </div>
      </Paper>
    </div>
  );
}

export default StatusRegistration;
