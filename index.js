import express from "express"
import dotenv from "dotenv";
dotenv.config();
import cors from "cors"
const app = express();
const PORT=process.env.PORT;
app.use(cors());
app.use(express.json())
const Books=[{
    name :"7 HABITS OF HIGHLY EFFECTIVE PEOPLE",
    price : 500,
    imglink :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJyjYTO_x4inpOOIjqoZtIGSImSgd41D7UjA&s",
    description :"Inner Engineering is a fascinating read, rich with Sadhguru’s insights and his teachings. If you are ready, it is a tool to help awaken your own inner intelligence, the ultimate and supreme genius that mirrors the wisdom of the cosmos—Deepak ChopraIn his revolutionary new book, visionary, mystic and yogi Sadhguru distils his own experiences with spirituality and yoga and introduces the transformational concept of Inner Engineering. Developed by him over several years, this powerful practice serves to align the mind and the body with energies around and within, creating a world of limitless power and possibilities. Inner Engineering is your own software for joy and well-being."
},
{
name :"INNER ENGINEERING",
price:300,
imglink:"https://m.media-amazon.com/images/I/71cCPf-r5ML.jpg",
description:"The 7 Habits of Highly Effective People is a business and self-help book written by Stephen R. Covey.[1] First published in 1989, the book goes over Covey's ideas on how to spur and nurture personal change. He also explores the concept of effectiveness in achieving results, as well as the need for focus on character ethic rather than the personality ethic in selecting value systems. As named, his book is laid out through seven habits he has identified as conducive to personal growth."
}]
app.get("/books",(req,res)=>{
    res.status(200).send(Books)
})
app.post("/books",(req,res)=>{
    const {name ,price,imglink,description} =req.body;
    const newbook ={
        name:name,
        price:price,
        imglink:imglink,
        description:description
    }
    Books.push(newbook);
    res.status(201).send({
        success:"true",
        msg :"book added successfully",
        data:{Books}
    })
})
app.get("/books/:name",(req,res)=>{const { name } = req.params; 

for (let i = 0; i < Books.length; i++) {
    if (name === Books[i].name) { 
        res.status(200).send({
            success: true,
            msg: "Book fetched successfully",
            data:  Books[i],
        });
        break; 
    }
}

});
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

    res.status(200).send({
        success: true,
        msg: "Book deleted successfully",
        data: { Books },
    });
});
app.put("/books/:name", (req, res) => {
    const bookName = decodeURIComponent(req.params.name); 
    const { price } = req.body;
    
    const bookIndex = Books.findIndex(book => book.name === bookName);
    if (bookIndex !== -1) {
        Books[bookIndex].price = price;
        return res.status(200).json({
            success: true,
            msg: "Book info updated",
            data: Books[bookIndex]
        });
    } else {
        return res.status(404).json({
            success: false,
            msg: "Book name not found",
            data: null
        });
    }
});


app.patch("/bookprice/:name",(req,res)=>{
   const {name} = req.params
   const {price}=req.body
   for(let i=0;i<Books.length;i++){
    if(name==Books[i].name){
        Books[i].price=price;
        return res.status(200).send({
            success:true,
            msg :"book price updated",
            data:Books[i]
        })
    }
    else{
        return res.status(404).send({
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
