import React from 'react';
import SHA1 from 'sha1';

const RedirectDoku = () => {
  
  const getWords = () => {
    const msg = document.MerchatPaymentPage.AMOUNT.value + "I8w6Qvm0ZTo6" + document.MerchatPaymentPage.TRANSIDMERCHANT.value + document.MerchatPaymentPage.STATUSCODE.value;
  
    document.MerchatPaymentPage.WORDS.value = SHA1(msg);
  }

  return (
    <div>
      <form action="https://staging.doku.com/CheckStatus" id="MerchatPaymentPage" name="MerchatPaymentPage" method="post" >
        <table table width="600" border="0" cellspacing="1" cellpadding="5">
          <tr>
            <td width="100" class="field_label">AMOUNT</td>
            <td width="500" class="field_input"><input name="AMOUNT" type="text" id="AMOUNT" size="12" /></td>
          </tr>
          <tr>
            <td width="100" class="field_label">TRANSIDMERCHANT</td>
            <td width="500" class="field_input"><input  value="BACKOFFICE001" name="TRANSIDMERCHANT" type="text" id="TRANSIDMERCHANT" value="9487" size="12" /></td>
          </tr>
          <tr>
            <td class="field_label">WORDS</td>
            <td class="field_input">
              <input type="text" id="WORDS" name="WORDS"  size="60" />
              &nbsp;&nbsp;<input type="button" value="Generate WORDS" onClick={getWords} />&nbsp;</td>
          </tr>
          <tr>
            <td width="100" class="field_label">STATUSCODE</td>
            <td width="500" class="field_input"><input name="STATUSCODE" type="text" id="STATUSCODE" value="0000" size="12" /></td>
          </tr>
          <tr>
            <td class="field_label">PAYMENTCHANNEL</td>
            <td class="field_input"><input name="PAYMENTCHANNEL" type="text" id="PAYMENTCHANNEL" value="360" size="3" maxlength="3" /></td>
          </tr>
          <tr>
            <td class="field_label">SESSIONID</td>
            <td class="field_input"><input name="SESSIONID" value="BACKOFFICE001" type="text" id="SESSIONID" value="360" size="3" maxlength="3" /></td>
          </tr>
          <tr>
            <td class="field_label">PAYMENTCODE</td>
            <td class="field_input"><input name="PAYMENTCODE" type="text" id="PAYMENTCODE" size="16" /></td>
          </tr>
          <tr>
            <td class="field_label">CURRENCY</td>
            <td class="field_input"><input type="text" id="CURRENCY" value="360" name="CURRENCY" /></td>
          </tr>
          <tr>
            <td class="field_label">PURCHASECURRENCY</td>
            <td class="field_input"><input type="text" value="360" id="PURCHASECURRENCY" name="PURCHASECURRENCY" /></td>
          </tr>
          <tr>
            <td class="field_input" colspan="2">&nbsp;</td>
          </tr>
          </table><br /><br />
          <input name="submit" type="submit" class="bt_submit" id="submit" value="SUBMIT" />
        </form>
    </div>
  );
}

export default RedirectDoku;
