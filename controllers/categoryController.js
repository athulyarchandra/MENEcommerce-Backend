import Categories from "../models/categoryModel.js";
import Category from "../models/categoryModel.js";

//Add new category
export const addCategory = async (req, res) => {
  console.log("Inside addCategory controller...");
  console.log("req.body =", req.body);

  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const newCategory = new Category({ name, description });
    await newCategory.save();

    res.status(201).json({
      message: "Category added successfully",
      category: newCategory
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
};
//Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//getSingleCategory
export const getSingleCategory = async (req, res) => {
  console.log("Inside getSingleCategory controller..")
  try {
    const categoryId = req.params.id
    const existing = await Categories.findById(categoryId)
    if (!existing) {
      res.status(400).json({ error: "No category found" })
    }
    res.status(200).json({ existing });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })

  }

}
//updateCategories
export const updateCategory = async (req, res) => {
  console.log("Inside updateCategories controller..")
  try {
    const categoryId = req.params.id
    const { name, description } = req.body
    if (!name || !description) {
      res.status(400).json({ error: "All fields are required.." })
    }

    const existing = await Categories.findById(categoryId)
    if (!existing) {
      res.status(400).json({ error: "No category found" })
    }
    const updatedData = {
      name: name || existingCategory.name,
      description: description || existingCategory.description
    }
    const editedCategory = await Categories.findByIdAndUpdate(categoryId, { $set: updatedData }, { new: true })
    res.status(200).json({ message: "Category updated successfully..", editedCategory })

  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  }

}
//deleteCategory
export const deleteCategory = async(req,res)=>{
  console.log("Inside deleteCategory constroller..")
  try{
    const categoryId = req.params.id
    const existing = await Categories.findById(categoryId)
    if(!existing){
      return res.status(400).json({error:"Category not found.."})
    }
    await Categories.findByIdAndDelete(categoryId)
    res.status(200).json({message:"Category deleted successfully.."})
  }catch(err){
    console.log(err);
    res.status(500).json({error:err.message})
    
  }
  
}
