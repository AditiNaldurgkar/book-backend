import express from "express"
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT;
const app = express();
app.use(express.json());
const Books=[{
    name :"7 HABITS OF HIGHLY EFFECTIVE PEOPLE",
    price : 500
},
{
name :"INNER ENGINEERING",
price:300
}]
app.get("/books",(req,res)=>{
    res.send(Books)
})
app.post("/books",(req,res)=>{
    const {name ,price} =req.body;
    const newbook ={
        name:name,
        price:price
    }
    Books.push(newbook);
    res.send({
        success:"true",
        msg :"book added successfully",
        data:{Books}
    })
})
app.delete("/books/:name", (req, res) => {
    const { name } = req.params; 
    let bookFound = false;
    for (let i = 0; i < Books.length; i++) {
        if (name === Books[i].name) { 
            Books.splice(i, 1); 
            bookFound = true;
            break; 
        }
    }
    if (!bookFound) {
        return res.status(404).send({
            success: false,
            msg: "Book not found",
        });
    }

    res.send({
        success: true,
        msg: "Book deleted successfully",
        data: { Books },
    });
});
app.put("/book",(req,res)=>{
    const {name,price}=req.body;
    for(let i=0;i<Books.length;i++){
        if(name==Books[i].name){
            Books[i].name=name;
            Books[i].price=price;
            return res.send({
                success:true,
                msg :"book info updated",
                data:Books[i]
            })
        }
        else{
            return res.send({
                success:false,
                msg : "book name not found",
                data : null
            })
        }

    }

});
app.patch("/bookprice/:name",(req,res)=>{
   const {name} = req.params
   const {price}=req.body
   for(let i=0;i<Books.length;i++){
    if(name==Books[i].name){
        Books[i].price=price;
        return res.send({
            success:true,
            msg :"book price updated",
            data:Books[i]
        })
    }
    else{
        return res.send({
            success:false,
            msg : "book name not found",
            data : null
        })
    }
}});
app.get("/health",(req,res)=>{
    return res.send("server is up and running")
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
