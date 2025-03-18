const configs = {
    appPort: 6000,
    paystackUrl: "https://api.paystack.co",
    adjutorUrl: "https://adjutor.lendsqr.com/v2/",
    paystackCallbackUrl: "",
    corsOptions:  {
        origin: "*", // subject to change
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
      }
}

export default configs