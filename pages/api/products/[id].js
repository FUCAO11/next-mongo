import dbConnect from '../../../lib/db';
import Product from '../../../models/Product';

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;
  const { id } = req.query; // 从请求的 URL 中获取 id 参数

  switch (method) {
    // 获取指定 id 的产品信息
    case 'GET':
      try {
        const product = await Product.findById(id);
        if (!product) {
          return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, data: product });
      } catch (error) {
        res.status(400).json({ success: false, message: 'Error fetching product' });
      }
      break;

    // 更新指定 id 的产品信息
    case 'PUT':
      try {
        const product = await Product.findByIdAndUpdate(id, req.body, {
          new: true, // 返回更新后的文档
          runValidators: true // 确保更新的数据符合 Schema 中的约束条件
        });
        if (!product) {
          return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, data: product });
      } catch (error) {
        res.status(400).json({ success: false, message: 'Error updating product' });
      }
      break;

    // 删除指定 id 的产品信息
    case 'DELETE':
      try {
        const deletedProduct = await Product.deleteOne({ _id: id });
        if (!deletedProduct) {
          return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, message: 'Error deleting product' });
      }
      break;

    // 如果请求的方法不是 GET, PUT, DELETE，返回 400 错误
    default:
      res.status(400).json({ success: false, message: 'Invalid request method' });
      break;
  }
}
