import express from 'express'
import Analytics from './routes/analytics.js'
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use('/',Analytics);
app.get('/',(req,res)=>{
    res.send("Server is working");
})
app.listen(8080,()=>{
    console.log("Server is Listening");
})