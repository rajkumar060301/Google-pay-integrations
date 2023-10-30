/*
 * Define the version of the Google Pay API referenced when creating your
 */
const baseRequest = {
    apiVersion: 2,
    apiVersionMinor: 0
};

/**
 * Card networks supported by your site and your gateway
 */
const allowedCardNetworks = ["AMEX", "DISCOVER", "JCB", "MASTERCARD", "VISA"];

/**
 * Card authentication methods supported by your site and your gateway
 */
const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];

/**
 * Identify your gateway and your site's gateway merchant identifier
 */
const tokenizationSpecification = {
    type: 'PAYMENT_GATEWAY',
    parameters: {
        'gateway': 'example',
        'gatewayMerchantId': 'exampleGatewayMerchantId'
    }
};

/**
 * Describe your site's support for the CARD payment method and its required
 */
const baseCardPaymentMethod = {
    type: 'CARD',
    parameters: {
        allowedAuthMethods: allowedCardAuthMethods,
        allowedCardNetworks: allowedCardNetworks
    }
};

/**
 * Describe your site's support for the CARD payment method including optional
 * fields
 */
const cardPaymentMethod = Object.assign(
    {},
    baseCardPaymentMethod,
    {
        tokenizationSpecification: tokenizationSpecification
    }
);

/**
 * An initialized google.payments.api.PaymentsClient object or null if not yet set

 */
let paymentsClient = null;

/**
 * Configure your site's support for payment methods supported by the Google Pay
 * API.
 */
function getGoogleIsReadyToPayRequest() {
return Object.assign(
    {},
    baseRequest,
    {
        allowedPaymentMethods: [baseCardPaymentMethod]
    }
);
}

/**
 * Configure support for the Google Pay API

 */
function getGooglePaymentDataRequest() {
    const paymentDataRequest = Object.assign({}, baseRequest);
    paymentDataRequest.allowedPaymentMethods = [cardPaymentMethod];
    paymentDataRequest.transactionInfo = getGoogleTransactionInfo();
    paymentDataRequest.merchantInfo = {
        
        merchantId: '01234567890123456789',
        merchantName: 'Example Merchant'
    };
    return paymentDataRequest;
}

/**
 * Return an active PaymentsClient or initialize
 */
function getGooglePaymentsClient() {
    if ( paymentsClient === null ) {
        paymentsClient = new google.payments.api.PaymentsClient({
            environment: 'TEST'
            
        });
    }
    return paymentsClient;
}

/**
 * Initialize Google PaymentsClient after Google-hosted JavaScript has loaded

 */
function onGooglePayLoaded() {
const paymentsClient = getGooglePaymentsClient();
paymentsClient.isReadyToPay(getGoogleIsReadyToPayRequest())
    .then(function(response) {
        if (response.result) {
        addGooglePayButton();

        }
    })
    .catch(function(err) {
        // show error in developer console for debugging
        console.error(err);
    });
}

/**
 * Add a Google Pay purchase button alongside an existing checkout button
 */
function addGooglePayButton() {
    document.getElementById('container').innerHTML = '';
    const paymentsClient = getGooglePaymentsClient();
    const button =
        paymentsClient.createButton({
            buttonType: 'short',
            onClick: onGooglePaymentButtonClicked
        });
    document.getElementById('container').appendChild(button);
}

/**
 * Provide Google Pay API with a payment amount, currency, and amount status
 */
function getGoogleTransactionInfo() {
    return {
        currencyCode: 'USD',
        totalPriceStatus: 'FINAL',
        // set to cart total
        totalPrice: '1.00'
    };
}

/**
 * Prefetch payment data to improve performance
 */
function prefetchGooglePaymentData() {
const paymentDataRequest = getGooglePaymentDataRequest();
    // transactionInfo must be set but does not affect cache
    paymentDataRequest.transactionInfo = {
        totalPriceStatus: 'NOT_CURRENTLY_KNOWN',
        currencyCode: 'USD'
    };
    const paymentsClient = getGooglePaymentsClient();
    paymentsClient.prefetchPaymentData(paymentDataRequest);
}

/**
 * Show Google Pay payment sheet when Google Pay payment button is clicked
 */
function onGooglePaymentButtonClicked() {
    const paymentDataRequest = getGooglePaymentDataRequest();
    paymentDataRequest.transactionInfo = getGoogleTransactionInfo();

    const paymentsClient = getGooglePaymentsClient();
    paymentsClient.loadPaymentData(paymentDataRequest)
        .then(function(paymentData) {
            // handle the response
            processPayment(paymentData);
        })
        .catch(function(err) {
            // show error in developer console for debugging
            console.error(err);
        });
}

/**
 * Process payment data returned by the Google Pay API
 */
function processPayment(paymentData) {
    // show returned data in developer console for debugging
    console.log("Payment Data: ", paymentData);

}
