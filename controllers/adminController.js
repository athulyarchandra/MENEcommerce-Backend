import Orders from "../models/orderModel.js";
import users from "../models/userModel.js";
import bcrypt from 'bcrypt'

//adminLogin
export const adminLogin = async (req, res) => {
    console.log("Inside admin controller..");
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json("All fields are required..")
        }
        const user = await users.findOne({ email })
        if (!user) {
            return res.status(401).json("Cannot find user..please register")
        }
        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            return res.status(401).json("Invalid username or password..")
        }
        req.session.userId = user._id
        req.session.save(err => {
            if (err) return res.status(500).json({ error: "Failed to save session" });
            res.status(200).json({ message: "Admin logged in successfully..", id: user._id,
          username: user.username,
          email: user.email });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message })

    }

}
//getAllUsers
export const getAllUsers = async (req,res)=>{
    console.log("Inside getUserController..");
    try{
        if(req.session.user){
            const allUsers = await users.find({})
            res.status(200).json({allUsers})
        }else{
            res.status(400).json({error:"You have to login first.."})
        }
    }catch(err){
        console.log(err);
        res.status(500).json({error:err.message})
    }
    
}
//viewAllOrders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Orders.find()
      .populate("userId", "username email address")
      .populate("items.productId", "name brand category productImages")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

