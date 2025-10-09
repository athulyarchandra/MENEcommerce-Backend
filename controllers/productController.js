import Product from "../models/productModel.js";

//add-product
export const addProduct = async (req, res) => {
  console.log("Inside createProduct controller..");
  try {
    const { productCode, name, price, available_country, tax_rate, color, size, stock, category,
      offer, description, brand, ratings } = req.body
    const productImages = req.files ? req.files.map(file => file.path) : []
    if (!productCode || !name || !price || !available_country || !tax_rate || !color || !size || !stock || !category ||
      !offer || !description || !brand || !ratings || !productImages) {
      res.status(400).json({ error: "All fields are required.." })
    }
    const existingProduct = await Product.findOne({ productCode })
    if (existingProduct) {
      res.status(401).json({ message: "Productcode alredy exist😴, try with another one" })
    }
    const newProduct = new Product({
      productCode, name, price, available_country, tax_rate, color, size, stock, category,
      offer, description, brand, ratings, productImages

    })
    await newProduct.save()
    res.status(200).json({ message: "Product added successfully..", newProduct })
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add product" });

  }

}
//getAll-Products
export const getAllProducts = async (req, res) => {
  console.log("Inside getAllProducts controller");
  try {
    const allProductsList = await Product.find({})
    if (allProductsList) {
      return res.status(200).json({ message: "List of all products", allProductsList })
    } else {
      return res.status(400).json({ message: "No products found" })
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err })
  }

}
//getSingleProduct 
export const getSingleProduct = async (req, res) => {
  console.log("Inside getSingleProduct controller..");
  try {
    const productId = req.params.id
    const singleProduct = await Product.findById(productId)
    if (!singleProduct) {
      return res.status(404).json({ error: "No product found" });
    }
    res.status(200).json({ singleProduct });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  }

}
//editSinglePrdt
export const editSinglePrdt = async (req, res) => {
  console.log("Inside editSinglePrdt");
  try {
    const productId = req.params.id

    const { name, price, available_country, tax_rate, color, size, stock, category,
      offer, description, brand, ratings } = req.body
    const productImages = req.files ? req.files.map(file => file.path) : []
     const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    const updatedData={
      name: name || existingProduct.name,
      price: price || existingProduct.price,
      available_country: available_country || existingProduct.available_country,
      tax_rate: tax_rate || existingProduct.tax_rate,
      color: color || existingProduct.color,
      size: size || existingProduct.size,
      stock: stock || existingProduct.stock,
      category: category || existingProduct.category,
      offer: offer || existingProduct.offer,
      description: description || existingProduct.description,
      brand: brand || existingProduct.brand,
      ratings: ratings || existingProduct.ratings,
    }
    if(productImages.length>0){
      updatedData.productImages = productImages
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId,{$set:updatedData},{new:true})
    res.status(200).json({message:"Product added successfully..!",updatedProduct})
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  }

}
//deletePrdt
export const removeSingleProduct = async(req,res)=>{
  console.log("Inside removeSingleProduct controller..");
  try{
    const productId = req.params.id
    const existingProduct = await Product.findById(productId)
    if(!existingProduct){
      res.status(400).json({error:"Product not found.."})
    }
    await Product.findByIdAndDelete(productId)
    res.status(200).json({message:"Product deleted successfully.."})
  }catch(err){
    console.log(err);
    res.status(500).json({error:err.message})
  }
  
}