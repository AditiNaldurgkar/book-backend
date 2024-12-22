import express from "express"
const app = express();
const PORT =5000;
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

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
