# lendsqr WalletService

## Overview
lendsqr Demo WalletService is a robust API for managing user wallets, allowing users to create wallets, perform transactions, and check balances securely.

## Features
- User authentication
- Wallet creation and management
- Deposit, withdrawal, and transfer transactions
- Transaction history tracking
- Secure JWT-based authentication

## Tech Stack
- **Backend:** Node.js, Express, TypeScript
- **Database:** MySQL
- **Authentication:** JWT
- **Test:** Jest

## Installation

```sh
# Clone the repository
git clone https://github.com/Elijah57/lendsqr.git

# Navigate to the project folder
cd lendsqr

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start the server
npm run dev
```

## API Endpoints

### Authentication
#### 1. User Registration
**Endpoint:** `POST /api/v1/auth/signup`
**Description:** This endpoint facilitate users account creation, on signup, user account is created and a wallet is automatically created for each user
**Request Body:**
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "johndoe@example.com",
  "phoneno": "+2345683954895",
  "password": "securepassword"
}
```
**Response:**
```json
{
	"status": true,
  "message": "User registered successfully",
	"userDetails": {
		"user": {
			"id": "426f4ee7-030e-11f0-94a9-0242ac150002",
			"firstname": "Chris",
			"lastname": "Dicki"
		},
		"walletId": {
			"id": "42706d22-030e-11f0-94a9-0242ac150002",
			"account_name": "Chris Dicki",
			"account_number": "2338726228",
			"account_balance": "0.00"
		}
  }
}
```

#### 2. User Login
**Endpoint:** `POST /api/v1/auth/login`
**Request Body:**
```json
{
  "email": "johndoe@example.com",
  "password": "securepassword"
}
```
**Response:**
```json
{
 
	"message": "Login successful"
}
```
## res.cookies("accessToken, httpOnly)

### Wallet Operations

#### 3. Get Wallet Balance
**Endpoint:** `GET /api/v1/wallet`

**Headers:**
```json
{
  "Authorization": "Bearer JWT_ACCESS_TOKEN"
}
```
**Response:**
```json
{
	"status": true,
	"wallet": {
		"id": "fcf38e18-02b2-11f0-81d5-0242ac150004",
		"user_id": "fcf2ad2d-02b2-11f0-81d5-0242ac150004",
		"account_name": "Charles Adams",
		"account_number": "8545331657",
		"account_balance": "6374000.00",
		"currency": "NGN",
		"provider": "lendsqr-demo",
		"type": "default",
		"balance_last_updated": "2025-03-17T12:44:37.000Z",
		"created_at": "2025-03-16T21:07:01.000Z",
		"updated_at": "2025-03-16T21:07:01.000Z"
	}
}
```

#### 4. Deposit Funds
**Endpoint:** `POST /api/v1/wallet/fund`
**Description:** Returns a paystack checkout link to fund the account
**Request Body:**
```json
{
	"amount": 20000
}
```
**Response:**
```json
{
	"message": "Payment Initialized successfully",
	"data": {
		"authorization_url": "https://checkout.paystack.com/uk75qiw8qwbipui",
		"access_code": "uk75qiw8qwbipui",
		"reference": "a0fo93hbu8"
	}
}
```

#### 5. Verify Funds Deposit
**Endpoint:** `POST /api/v1/wallet/verify-payment`
**Description:** After a transaction is made, paystack call this url, returning the status of the transaction. if transaction status is success, it updates the user account and return new balance.

**Request Body:**
```json
{

}
```
**Response:**
```json
{
  "message": "Payment Verified, Account credited",
  "updatedData": {
    "userId": "fcf2ad2d-02b2-11f0-81d5-0242ac150004",
    "firstname": "Charles",
    "lastname": "Adams",
    "email": "elijahechekwu30@gmail.com",
    "walletId": "fcf38e18-02b2-11f0-81d5-0242ac150004",
    "account_balance": "8374000.00",
    "account_number": "8545331657",
    "account_name": "Charles Adams",
    "balance_last_updated": "2025-03-17T13:05:25.000Z"
  }
}
```


#### 6. Withdraw Funds
**Endpoint:** `POST /api/wallet/withdraw`
**Request Body:**
```json
{
	"amount": 500,
	"account_number": "0824592156",
	"bank_name": "Access Bank",
	"description": "Testing withdrawal"
}
```
**Response:**
```json
{
	"status": true,
	"data": {
		"transaction": {
			"sender": {
				"account_name": "Charles Adams",
				"account_number": "8545331657"
			},
			"receiver": {
				"account_name": "CHIBUZOR ELIJAH ECHEKWU",
				"account_number": "0824592156"
			},
			"amount": "500.00",
			"reference": "TXN-25031835806868532120",
			"description": "Testing withdrawal"
		},
		"balance": "8372500.00"
	}
}
```

#### 7. Transfer Funds
**Endpoint:** `POST /api/v1/wallet/transfer-to`
**Request Body:**
```json
{
	"receiver": "8510179997",
	"amount": 2000,
	"description": "Send some money test"
}
```
**Response:**
```json
{
	"status": true,
  "message": "money sent",
	"data": {
		"sender": {
			"account_name": "Charles Adams",
			"account_number": "8545331657"
		},
		"receiver": {
			"account_name": "Aiden Mohr",
			"account_number": "8510179997"
		},
		"amount": "2000.00",
		"reference": "TXN-25031742501925503132",
		"description": "Send some money test"
	}
}
```


#### 8. Bank Resolve
**Endpoint:** `POST /api/v1/wallet/bank-resolve`

**Request Body:**
```json
{
	"account_number": "0824592156",
	"bank_name": "Access Bank"
}
```
**Response:**
```json
{
	"message": "Account number resolved",
	"data": {
		"account_number": "0824592156",
		"account_name": "CHIBUZOR ELIJAH ECHEKWU",
		"bank_id": 1
	}
}
```

### Transactions
#### 8. Get Transaction History
**Endpoint:** `GET /api/v1/wallet/transactions`
**Response:**
```json
{
	"status": true,
	"wallet": [
		{
			"id": "41f6bf58-030a-11f0-94a9-0242ac150002",
			"sender": {
				"account_name": "Charles Adams",
				"account_number": "8545331657"
			},
			"receiver": {
				"account_name": "Aiden Mohr",
				"account_number": "8510179997"
			},
			"amount": "2000.00",
			"type": "transfer",
			"reference": "TXN-TXN-25031732412797280535",
			"description": "Send some money test",
			"created_at": "2025-03-17T07:31:43.000Z"
		},
		{
			"id": "a4b2b7a7-02b4-11f0-81d5-0242ac150004",
			"sender": {
				"account_name": "Charles Adams",
				"account_number": "8545331657"
			},
			"receiver": {
				"account_name": "Aiden Mohr",
				"account_number": "8510179997"
			},
			"amount": "6000.00",
			"type": "transfer",
			"reference": "TXN-25031635534884192259",
			"description": "Send some money test",
			"created_at": "2025-03-16T21:18:52.000Z"
		},
		{
			"id": "ed24e6b4-0309-11f0-94a9-0242ac150002",
			"sender": {
				"account_name": "Charles Adams",
				"account_number": "8545331657"
			},
			"receiver": {
				"account_name": "Aiden Mohr",
				"account_number": "8510179997"
			},
			"amount": "2000.00",
			"type": "transfer",
			"reference": "TXN-25031710840449191333",
			"description": "Send some money test",
			"created_at": "2025-03-17T07:29:21.000Z"
		},

	]
}
```

## Error Handling
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Invalid or missing authentication token
- `403 Forbidden` - Action not allowed
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server-side issue

## Contributing
1. Fork the repo
2. Create a new branch (`feature/your-feature`)
3. Commit your changes
4. Push to your branch
5. Open a pull request

## License
This project is licensed under the MIT License.

