from flask import Flask, request, jsonify
import requests
from requests.auth import HTTPBasicAuth
from flask_cors import CORS
from dotenv import load_dotenv
import os
app = Flask(__name__)
CORS(app)
load_dotenv()

# PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID")
# PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET")
PAYPAL_CLIENT_ID="AVYzf04TRxo6ZzBCDYzq9J36DVh934-1WxZBXRfI4Ma0JTNTHMUeq0CP_MaHt1__yl_QkhkKzuCo5S0s"
PAYPAL_CLIENT_SECRET="EN-wtjARFO64igKqq85Yd_Tnz6fwyN2e-y4E6Yx1yzu1CM2kH-HLwyBqVNgGrdNbF9eA7--3mzrfn6ZU"



# PAYPAL_API_URL ="https://api-m.paypal.com"
PAYPAL_API_URL = "https://api-m.sandbox.paypal.com"

# Get OAuth2 Access Token
def fetch_access_token():
    url = f"{PAYPAL_API_URL}/v1/oauth2/token"
    headers = {
        "Accept": "application/json",
        "Accept-Language": "en_US"
    }
    data = {"grant_type": "client_credentials"}

    response = requests.post(
        url, headers=headers, data=data,
        auth=HTTPBasicAuth(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET)
    )

    response.raise_for_status()
    return response.json()['access_token']


# Route to get access token (optional use)
@app.route('/api/get-token')
def get_access_token():
    try:
        token = fetch_access_token()
        return jsonify({"access_token": token})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Function to create a PayPal order
def create_order(amount="1.99", currency="USD"):
    try:
        access_token = fetch_access_token()
        url = f"{PAYPAL_API_URL}/v2/checkout/orders"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}"
        }

        order_payload = {
            "intent": "CAPTURE",
            "purchase_units": [
                {
                    "amount": {
                        "currency_code": currency,
                        "value": amount
                    }
                }
            ]
        }

        response = requests.post(url, json=order_payload, headers=headers)
        print("PayPal raw response:", response.text)  # This is important
        response.raise_for_status()

        order_data = response.json()
        print("PayPal order data:", order_data)

        approval_url = next(
            (link["href"] for link in order_data["links"] if link["rel"] == "approve"),
            None
        )

        return {
            "order_id": order_data["id"],
            "approval_url": approval_url
        }

    except requests.exceptions.RequestException as e:
        print("Request to PayPal failed:", e)
        raise



if __name__ == '__main__':
    app.run(port=5000, debug=True)
