import users from "../models/userModel.js";
import bcrypt from 'bcrypt'


// userRegister 
export const userRegister = async (req, res) => {
  console.log("Inside userRegister controller..");
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required.." });
    }

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists.. Please login" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new users({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(201).json({
      message: "User registered successfully",
      user: userResponse
    });


  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};
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
        email: user.email,
        status:user.status,
        role:user.role
      }
    });



  } catch (err) {
    res.status(500).json({ Error: err.message })
  }
}
// getUserProfile
export const getUserProfile = async (req, res) => {
  console.log("Inside getUserProfile controller..");

  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "No active session. Please login!" });
    }

    const userId = req.session.user;

    const existingUser = await users.findById(userId).select("-password");

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      message: "User details fetched successfully",
      user: existingUser,
    });

  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).json({ error: err.message });
  }
};

// updateUser 
export const updateUser = async (req, res) => {
  console.log("Inside updateUser controller..");

  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "No active session found" });
    }

    const userId = req.session.user._id || req.session.user;

    const { username, email, bio, age, gender, address, profilePic } = req.body;

    const updatedProfilePic = req.file ? req.file.filename : profilePic;

    const updatedUser = await users.findByIdAndUpdate(
      userId,
      {
        username,
        email,
        bio,
        age,
        gender,
        address,
        profilePic: updatedProfilePic,
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    req.session.user = {
      _id: updatedUser._id,
      email: updatedUser.email,
      username: updatedUser.username,
    };

    req.session.save(() => {
      return res.status(200).json({
        message: "User updated successfully",
        user: updatedUser,
      });
    });

  } catch (err) {
    console.log("Update user error:", err);
    res.status(500).json({ error: err.message });
  }
};
// controllers/adminController.js
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const user = await users.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = status;
    await user.save();

    res.status(200).json({
      message: `User status updated to ${status}`,
      user,
    });
  } catch (error) {
    console.error("Error in updateUserStatus:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};



