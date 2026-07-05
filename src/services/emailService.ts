import emailjs from '@emailjs/browser';

// EmailJS Configuration from Environment Variables
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

interface EmailOrderData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  totalAmount: string;
  shippingAddress: string;
  items: string; // Formatting items as a string for the email template
}

/**
 * Sends a professional order confirmation email to the customer using EmailJS.
 */
export const sendOrderConfirmationEmail = async (orderData: EmailOrderData) => {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.error("EmailJS credentials missing in .env file");
    return { success: false, error: "Configuration Error" };
  }

  try {
    const templateParams = {
      order_id: orderData.orderId,
      to_name: orderData.customerName,
      to_email: orderData.customerEmail,
      total_amount: `৳${orderData.totalAmount}`,
      shipping_address: orderData.shippingAddress,
      order_items: orderData.items,
      reply_to: "support@themathatch.com",
    };

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );

    console.log('Email Deployment Successful:', response.status, response.text);
    return { success: true };
  } catch (error) {
    console.error('Email Deployment Failed:', error);
    return { success: false, error };
  }
};