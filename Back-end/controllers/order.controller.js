const mongoose = require('mongoose');
const Order = require('../models/order.model');
const OrderItem = require('../models/orderItem.model');
const Product = require('../models/product.model');
const { getNextSequence, formatCode } = require('../services/sequence.service');
const {
  sendNewOrderNotification,
} = require('../utils/mailer');

const DEPOSIT_RATE = Number(process.env.ORDER_DEPOSIT_RATE || 0.3);

function mapOrderPayload(body) {
  const buyerInfo = body.buyer_info || {};
  const recipientInfo = body.recipient_info || {};
  const deliveryInfo = body.delivery_info || {};

  return {
    buyer_name: buyerInfo.name || body.buyer_name,
    buyer_phone: buyerInfo.phone || body.buyer_phone,
    recipient_name: recipientInfo.name || body.recipient_name,
    recipient_phone: recipientInfo.phone || body.recipient_phone,
    recipient_address: recipientInfo.address || body.recipient_address,
    delivery_date: deliveryInfo.date || body.delivery_date,
    delivery_time_slot: deliveryInfo.time_slot || body.delivery_time_slot,
    card_message: body.card_message || '',
  };
}

function buildOrderResponse(order, orderItems = []) {
  return {
    id: order._id,
    order_code: order.order_code,
    user: order.user_id,
    buyer_name: order.buyer_name,
    buyer_phone: order.buyer_phone,
    recipient_name: order.recipient_name,
    recipient_phone: order.recipient_phone,
    recipient_address: order.recipient_address,
    delivery_date: order.delivery_date,
    delivery_time_slot: order.delivery_time_slot,
    card_message: order.card_message,
    subtotal_price: order.subtotal_price,
    deposit_amount: order.deposit_amount,
    paid_amount: order.paid_amount,
    remaining_amount: order.remaining_amount,
    total_price: order.total_price,
    payment_status: order.payment_status,
    status: order.status,
    created_at: order.created_at,

    items: orderItems.map((item) => ({
      id: item._id,
      quantity: item.quantity,
      price: item.price,

      product_id: item.product_id?._id,
      product_name: item.product_id?.name || '',

      image_url:
        item.product_id?.image_url ||
        item.product_id?.images?.[0] ||
        '',
    })),
  };
}

function calcDeposit(totalPrice) {
  return Math.round(totalPrice * DEPOSIT_RATE);
}

async function createOrder(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user?._id || null;
    const { items = [] } = req.body;
    const mapped = mapOrderPayload(req.body);

    if (!mapped.buyer_name || !mapped.buyer_phone || !mapped.recipient_name || !mapped.recipient_phone || !mapped.recipient_address || !mapped.delivery_date || !mapped.delivery_time_slot) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Thiếu thông tin đơn hàng bắt buộc.' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Order phải có ít nhất 1 item.' });
    }

    const orderItems = [];
    let subtotal_price = 0;

    for (const item of items) {
      const productId =
        item.product_id ||
        item.id ||
        item.productId;

      const product = await Product.findById(productId);

      if (!product || !item.quantity) {
        return res.status(400).json({
          message: 'Item thiếu thông tin sản phẩm hoặc số lượng.',
        });
      }

      const price =
        product.sale_price ||
        product.price;

      subtotal_price += price * item.quantity;

      orderItems.push({
        product_id: product._id,
        quantity: item.quantity,
        price,
      });
    }

    const total_price = subtotal_price;
    const deposit_amount = calcDeposit(total_price);
    const paid_amount = deposit_amount;
    const remaining_amount = Math.max(total_price - paid_amount, 0);
    const payment_status = paid_amount >= total_price ? 'paid' : 'partial_paid';

    const sequence = await getNextSequence('order_code');
    const order_code = formatCode('ORD', sequence);

    const order = await Order.create({
      user_id: userId,
      order_code,
      buyer_name: mapped.buyer_name,
      buyer_phone: mapped.buyer_phone,
      recipient_name: mapped.recipient_name,
      recipient_phone: mapped.recipient_phone,
      recipient_address: mapped.recipient_address,
      delivery_date: mapped.delivery_date,
      delivery_time_slot: mapped.delivery_time_slot,
      card_message: mapped.card_message,
      subtotal_price,
      deposit_amount,
      paid_amount,
      remaining_amount,
      total_price,
      payment_status,
      status: 'pending',
    });

    const itemsWithOrder = orderItems.map((item) => ({
      ...item,
      order_id: order._id,
    }));

    await OrderItem.insertMany(itemsWithOrder);

    const populatedItems = await OrderItem.find({
      order_id: order._id,
    })
    .populate({
      path: 'product_id',
      select: 'name image_url images',
    });

   
      sendNewOrderNotification(order, populatedItems)
  .catch((err) => {
    console.error(
      'Lỗi gửi email:',
      err.message
    );
  });

    return res.status(201).json({
      message: 'Tạo đơn hàng thành công.',
      order: buildOrderResponse(order, populatedItems),
    });


  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: 'Lỗi tạo đơn hàng.',
      error: error.message,
    });
  }

}
async function getOrders(req, res) {
  try {
    const query = {};

    if (req.user.role === 'customer') {
      query.user_id = req.user._id;
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 3;

    const skip = (page - 1) * limit;

    const total = await Order.countDocuments(query);

    const orders = await Order.find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    const orderIds = orders.map(
      (order) => order._id
    );

    const items = await OrderItem.find({
      order_id: { $in: orderIds },
    }).populate({
      path: 'product_id',
      select: 'name image_url images',
    });

    const itemsByOrder = items.reduce(
      (acc, item) => {
        const key = String(item.order_id);

        if (!acc[key]) acc[key] = [];

        acc[key].push(item);

        return acc;
      },
      {}
    );

    return res.json({
      orders: orders.map((order) =>
        buildOrderResponse(
          order,
          itemsByOrder[String(order._id)] || []
        )
      ),

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(
          total / limit
        ),
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Lỗi lấy danh sách đơn.',
      error: error.message,
    });
  }
}

async function getOrderByCode(req, res) {
  try {
    const order = await Order.findOne({ order_code: req.params.code });
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });

    const items = await OrderItem.find({ order_id: order._id }).populate({
      path: 'product_id',
      select: 'name image_url images',
    })
    return res.json({ order: buildOrderResponse(order, items) });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi lấy đơn hàng.', error: error.message });
  }
}

async function updateOrderStatus(req, res) {
  try {
    const { status, payment_status } = req.body;
    if (!status && !payment_status) return res.status(400).json({ message: 'Thiếu status hoặc payment_status.' });

    const order = await Order.findOne({ order_code: req.params.code });
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });

    if (status) order.status = status;
    if (payment_status) order.payment_status = payment_status;
    if (payment_status === 'paid') order.paid_amount = order.total_price;
    if (payment_status === 'partial_paid') order.paid_amount = order.deposit_amount;

    order.remaining_amount = Math.max(order.total_price - order.paid_amount, 0);
    const savedOrder = await order.save();

    return res.json({ message: 'Cập nhật đơn hàng thành công.', order: buildOrderResponse(savedOrder, []) });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi cập nhật trạng thái.', error: error.message });
  }
}

async function deleteOrder(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findOneAndDelete({ order_code: req.params.code })
    if (!order) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
    }

    await OrderItem.deleteMany({ order_id: order._id });
    await session.commitTransaction();

    return res.json({ message: 'Xóa đơn hàng thành công.' });
  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({ message: 'Lỗi xóa đơn hàng.', error: error.message });
  } finally {
    session.endSession();
  }
}

module.exports = {
  createOrder,
  getOrders,
  getOrderByCode,
  updateOrderStatus,
  deleteOrder,
};
