import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
    },
    cover_image: {
      type: {
        path: String,
        public_id: String,
      },
      required: [true, "Cover-Image is required"],
    },
    images: [{
        type: {
          path: String,
          public_id: String,
        },
      }],
    description: {
      type: String,
    },
    is_featured: {
      type: Boolean,
      default:false
    },
    new_arrival:{
        type:Boolean,
        default:true
    },
    //category
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'category', 
          required: [true, "Category is required"]
    },
    //brand
    brand:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'brand', 
          required: [true, "Brand is required"]
    }
  },
  { timestamps: true }
);

const Product = mongoose.model("product", productSchema);
export default Product;
