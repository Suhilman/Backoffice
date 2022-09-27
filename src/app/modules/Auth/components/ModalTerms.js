import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import img from "../../../../images/reggrads-beetpos.png";
import './style.css' 

function ModalTerms() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

function myFunction() {
  var mainFrameOne = document.getElementById("mainFrameOne"); 
  var mainFrameTwo = document.getElementById("mainFrameTwo");
  var divFrameOne = document.getElementById("divFrameOne"); 
  var divFrameTwo = document.getElementById("divFrameTwo");

  mainFrameOne.style.display = (
      mainFrameOne.style.display == "none" ? "block" : "none");
      
  mainFrameTwo.style.display = (
      mainFrameTwo.style.display == "block" ? "none" : "block"); 
  divFrameOne.style.display = (     
      divFrameOne.style.display == "none" ? "block" : "none"); 
  divFrameTwo.style.display = (
      divFrameTwo.style.display == "block" ? "none" : "block"); 
}

  return (
    <>
      <Button variant="btn btn-link" onClick={handleShow}>
        Terms & Conditions
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
           <div id="mainFrameOne"> Terms & Conditions</div>
           <div id="mainFrameTwo" class="divtwo">Syarat & Ketentuan</div>
          </Modal.Title>
          
        <div class="posisi-slide">
          <label class="switch">
 <input type="checkbox" id="togBtn" />
 <div class="slider round">
  <span class="on" ><a onClick={myFunction} >IDN</a></span>
  <span class="off"><a onClick={myFunction} >ENG</a></span>
 </div>
</label>
</div>
        </Modal.Header>
        <Modal.Body>
<div id="divFrameOne" >
<p><b>Beetpos</b> grants you the right to access and use the Beetpos Services 
through the Beetpos Website with a usage role that has been defined 
for you, according to the type of service you have selected. This right
is non-exclusive, non-transferable and limited by and contingent on
this agreement. You acknowledge and agree to, and subject to 
any written agreement in force between Customer and Invited User, or
other applicable law:<br/>

•That it is the responsibility of the Customer to determine who has access
as an Invited User and the types of roles and rights they have to
access the types of data you have.<br/>

•That the Customer's responsibility for all use of the Service by the Invited
User.<br/>

•That it is the Customer's responsibility to control each Invited User's level
of access to the relevant organization and Services at any time, and
may withdraw or change the Invited User's access or access level at
any time, for any reason in any case.<br/>

•If there is a dispute between the Customer and the Invited User
regarding access to any organization or Service, it is 
the Customer who must make the decision and regulate the access or
level of access to the Data or Services that 
the Invited User will have, if any.<br/><br/>
reggrads,<br/></p>
</div>

<div id="divFrameTwo">
<p><b>Beetpos</b> memberi Anda hak untuk mengakses dan menggunakan Layanan Beetpos
melalui Situs Web Beetpos dengan peran penggunaan yang telah ditentukan
untuk Anda, sesuai dengan jenis layanan yang Anda pilih. Ini benar
tidak eksklusif, tidak dapat dipindahtangankan, dan dibatasi oleh dan bergantung pada
persetujuan ini. Anda mengakui dan menyetujui, dan tunduk pada
setiap perjanjian tertulis yang berlaku antara Pelanggan dan Pengguna yang Diundang, atau
hukum lain yang berlaku:<br/>

• Bahwa Pelanggan bertanggung jawab untuk menentukan siapa yang memiliki akses
sebagai Pengguna yang Diundang dan jenis peran serta hak yang mereka miliki
mengakses jenis data yang Anda miliki.<br/>

• Bahwa Pelanggan bertanggung jawab atas semua penggunaan Layanan oleh Yang Diundang
Pengguna.<br/>

• Bahwa Pelanggan bertanggung jawab untuk mengontrol setiap level Pengguna yang Diundang
akses ke organisasi dan Layanan yang relevan setiap saat, dan
dapat menarik atau mengubah akses atau tingkat akses Pengguna Diundang di
setiap saat, untuk alasan apapun dalam hal apapun.<br/>

•Jika terjadi perselisihan antara Pelanggan dan Pengguna yang Diundang
mengenai akses ke organisasi atau Layanan apa pun, itu adalah
Pelanggan yang harus mengambil keputusan dan mengatur akses atau
tingkat akses ke Data atau Layanan yang
akan dimiliki oleh Pengguna yang Diundang, jika ada.<br/><br/>
reggrads,<br/></p>
</div>

<div><img src={img}  class='regrads'/></div>
</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default ModalTerms;