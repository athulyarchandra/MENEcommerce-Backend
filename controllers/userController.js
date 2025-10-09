import users from "../models/userModel.js";
import bcrypt from 'bcrypt'


//userRegister 
export const userRegister = async (req, res) => {
    console.log("Inside userRegiste controller..");
    try {
        const { username, email, password } = req.body
        if (!username || !email || !password) {
            return res.status(400).json("All fields are required..")
        }
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            return res.status(401).json("User already exist..Please login")
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new users({
            username, email, password: hashedPassword
        })
        await newUser.save()
                res.status(200).json({
            message: "User registered successfully..", user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });
        res.status(200).json({ message: "", newUser })
    } catch (err) {
        res.status(500).json({ Error: err.message })
    }
}
//loginUser
export const loginUser = async (req, res) => {
    console.log("Inside userLogin controller");
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

        req.session.user = user._id
        res.status(200).json({
            message: "User logged in successfully..", user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });



    } catch (err) {
        res.status(500).json({ Error: err.message })
    }
}
// updateUser 
export const updateUser = async (req, res) => {
  console.log("Inside updateUser controller..");
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "No active session found" });
    }

    const userId = req.session.user; 
    const { username, email, bio, age, gender, address } = req.body;

    const existingUser = await users.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    let profilePicPath = existingUser.profilePic;
    if (req.file) {
      profilePicPath = req.file.path;
    }

    const updatedUser = await users.findByIdAndUpdate(
      userId,
      {
        username,
        email,
        bio,
        age,
        gender,
        address,
        profilePic: profilePicPath,
      },
      { new: true }
    );

    req.session.user = updatedUser._id;

    req.session.save((err) => {
      if (err) {
        console.log("Error saving session:", err);
        return res.status(500).json({ error: "Failed to update session" });
      }
      return res.status(200).json({
        message: "User updated successfully.",
        user: updatedUser,
      });
    });
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
};


