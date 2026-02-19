"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Reveal from "@/components/common/Reveal";
import Spinner from "@/components/common/Spinner";
import { useAppStore } from "@/store";
import { ordersService } from "@/services/orders.service";
import { paymentService } from "@/services/payment.service";
 
 export default function CartPage() {
  const router = useRouter();
   const { cart, setQuantity, removeFromCart, clearCart } = useAppStore((s) => ({
     cart: s.cart,
     setQuantity: s.setQuantity,
     removeFromCart: s.removeFromCart,
     clearCart: s.clearCart,
   }));
  const [loading, setLoading] = useState(false);

   const subtotal = cart.reduce((sum, it) => sum + it.price * it.quantity, 0);
   const currency = cart[0]?.currency ?? "₹";

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const orderData = {
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        shippingAddress: "123 Main St",
      };

      const order = await ordersService.createOrder(orderData);

      const payment = await paymentService.createPaymentIntent(order.id, order.total);

      const confirmation = await paymentService.confirmPayment(payment.paymentIntentId, order.id);

      if (confirmation.success) {
        clearCart();
        router.push(`/order-confirmation/${order.id}`);
      } else {
        alert("Payment failed. Please try again.");
      }
    } catch (error: any) {
      alert(error?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

   return (
     <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
       <Reveal
         className="w-full max-w-4xl mx-auto rounded-2xl border border-white/20 dark:border-white/10 bg-white/85 dark:bg-black/50 backdrop-blur-xl shadow-2xl p-6"
         variant="fade"
       >
         <Reveal as="h1" className="text-2xl font-extrabold text-dark dark:text-white text-center mb-4">
           Your Cart
         </Reveal>

         {cart.length === 0 ? (
           <Reveal className="text-center text-sm text-gray-700 dark:text-gray-300">
             Your cart is empty. Browse the{" "}
             <Link href="/shop" className="text-primary font-semibold underline">
               Shop
             </Link>
             .
           </Reveal>
         ) : (
           <>
             <div className="space-y-3">
               {cart.map((it) => (
                 <div
                   key={it.id}
                   className="flex items-start justify-between gap-3 rounded-xl border bg-white/80 dark:bg-white/10 p-4"
                 >
                   <div className="min-w-0">
                     <div className="font-bold text-dark dark:text-white">{it.name}</div>
                     <div className="text-xs text-gray-700 dark:text-gray-300">
                       {it.detail} {it.type ? `• ${it.type}` : ""} {it.shade ? `• ${it.shade}` : ""}{" "}
                       {it.skinType ? `• ${it.skinType}` : ""}
                     </div>
                     <div className="mt-1 text-sm font-semibold text-dark dark:text-white">
                       {currency}
                       {it.price}
                     </div>
                   </div>

                   <div className="flex items-center gap-2">
                     <label className="text-xs text-gray-600 dark:text-gray-300">Qty</label>
                     <input
                       type="number"
                       min={1}
                       value={it.quantity}
                       onChange={(e) => setQuantity(it.id, Number(e.target.value))}
                       className="w-16 rounded-md border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-white/10 px-2 py-1 text-sm text-gray-900 dark:text-gray-100"
                     />
                     <button
                       type="button"
                       onClick={() => removeFromCart(it.id)}
                       className="px-3 py-1.5 rounded-md bg-white/70 dark:bg-white/10 text-dark dark:text-white text-xs font-semibold hover:bg-white/80 dark:hover:bg-white/20"
                     >
                       Remove
                     </button>
                   </div>
                 </div>
               ))}
             </div>

             <div className="mt-6 rounded-xl border bg-white/85 dark:bg-white/10 p-4">
               <div className="flex items-center justify-between">
                 <div className="text-sm text-gray-700 dark:text-gray-300">Subtotal</div>
                 <div className="text-sm font-bold text-dark dark:text-white">
                   {currency}
                   {subtotal.toFixed(2)}
                 </div>
               </div>
               <div className="flex items-center justify-between mt-1">
                 <div className="text-xs text-gray-600 dark:text-gray-400">Estimated Tax</div>
                 <div className="text-xs text-dark dark:text-gray-200">
                   {currency}
                   {(subtotal * 0.05).toFixed(2)}
                 </div>
               </div>
               <div className="flex items-center justify-between mt-2">
                 <div className="text-sm font-semibold text-dark dark:text-white">Total</div>
                 <div className="text-sm font-extrabold text-dark dark:text-white">
                   {currency}
                   {(subtotal * 1.05).toFixed(2)}
                 </div>
               </div>
             </div>

             <div className="mt-4 flex items-center justify-between">
               <button
                 type="button"
                 onClick={clearCart}
                 className="px-4 py-2 rounded-md bg-white/70 dark:bg-white/10 text-dark dark:text-white text-sm font-semibold hover:bg-white/80 dark:hover:bg-white/20"
               >
                 Clear Cart
               </button>
               <button
                 type="button"
                onClick={handleCheckout}
                disabled={loading || cart.length === 0}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-secondary to-primary text-white font-semibold shine-sweep disabled:opacity-60"
               >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner size={16} />
                    Processing...
                  </span>
                ) : (
                  "Checkout"
                )}
               </button>
             </div>
           </>
         )}
       </Reveal>
     </div>
   );
 }
