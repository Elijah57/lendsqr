import {app} from "./app"
import configs from "./configs"
import db from "./db"

const startServer = ()=>{

    db.raw("SELECT 1")
    .then(() => console.log("✅ Database Connected"))
    .catch((err) => {
        console.error("❌ Database Connection Failed:", err);
        process.exit(1);
    });
    app.listen(configs.appPort, ()=>{
        console.log()
    })
}

startServer()