const ProducManager = require("../ProductManager")
const manager = new ProducManager("products.json")


const express = require ("express")
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))

const userRouterProd = require("./routes/producs")
app.use("/api/products", userRouterProd)

const userRouterCart = require("./routes/carts.js")
app.use("/api/carts", userRouterCart)

const realTime = require("./routes/realTimeProducts")
app.use("/", realTime)


//Rutas de MONGODB
const mongoose = require ("mongoose");
const userRouterDB =require ("./routes/productosDB");
app.use("/productosDB", userRouterDB)

try{ 
    mongoose.connect("mongodb+srv://crucciluciano:123456luciano@crucciluciano.6lrtemq.mongodb.net/productos?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
    }) 
    console.log("conexion a mongo exitosa") 
}
catch(error){console.log(error)}


//{Handlebars
const exphbs = require("express-handlebars")   
app.engine("hbs", exphbs.engine({
    extname:'.hbs',
    partialsDir: __dirname + '/views/partials',
    layoutsDir: __dirname + '/views/layouts',
    defaultLayout: 'layouts.hbs' 
}))
app.set('views', './src/views/partials');
app.set('view engine', 'hbs');

const viewsRouter = require("./routes/views");
app.use("/",viewsRouter)

//Handlebars}

const PORT = process.env.PORT || 8080
const Server = httpServer.listen(PORT, ()=> console.log(`Server running on PORT ${Server.address().port}`))
Server.on("error", error => console.log(error))

let objProd = {}

io.on('connection', async socket => {
    let arr = await manager.getProducts();
    let json = JSON.stringify(arr)
    console.log('Nuevo cliente conectado')   
    io.sockets.emit('messages', json)

    socket.on('idEliminar', async data => {
        let arr =  await manager.deleteProduct(data);
        let json = JSON.stringify(arr)
        io.sockets.emit("messages",json)
    })
    
    socket.on('title', title => {
        objProd.title = title
    })

    socket.on('descripction', descripction => {
        objProd.descripction = descripction
    })

    socket.on('price', price => {
        objProd.price = price
    })

    socket.on('code', code => {
        objProd.code = code
        
    })

    socket.on('stock', async stock => {
        objProd.stock = stock
        let arr =  await manager.addProduct(objProd);
        let json = JSON.stringify(arr)
        io.sockets.emit("messages",json)
    })
})

