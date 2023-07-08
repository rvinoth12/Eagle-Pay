/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}","./component/screens/Homescreen.{js,jsx,ts,tsx}",
  "./component/screens/paymentScreens/BankTransfer.{js,jsx,ts,tsx}",
  "./component/screens/paymentScreens/BankTransferPay.{js,jsx,ts,tsx}",
  "./component/Onboard/Register.{js,jsx,ts,tsx}",
  "./component/screens/paymentScreens/ShowHistoryScreen.{js,jsx,ts,tsx}",
  "./component/screens/paymentScreens/IndividualPaymentHistory.{js,jsx,ts,tsx}",
  "./component/screens/paymentScreens/PhoneNumberPaychatScreen.{js,jsx,ts,tsx}",
],
  theme: {
    extend: {},
  },
  plugins: [],
}

