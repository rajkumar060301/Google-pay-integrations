<?php
/*
Payment Data:  
apiVersion: 2
apiVersionMinor: 0
paymentMethodData:
description: "Visa •••• 8144"
info:
cardDetails: "8144"
cardNetwork: "VISA"
tokenizationData: {…}
​​​token: "examplePaymentMethodToken"
​​​type: "PAYMENT_GATEWAY"
<prototype>: Object { … }
​​type: "CARD"
​​<prototype>: Object { … }
​<prototype>: Object { … }
google_pay.js:226:5
Token:  examplePaymentMethodToken
*/

$rawHTTPDaata = file_get_contents('php://input');
$data = json_decode($rawHTTPDaata, true);
if(!empty($data)){   

    $existingData = file_get_contents('data.txt');
    $existingData .= (!empty($existingData) ? "\n" : "").date('YmdHis').' :- '.$rawHTTPDaata;
    file_put_contents('data.txt', $existingData);

    echo 'OK';
}
die;