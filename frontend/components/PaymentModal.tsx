import { motion } from "framer-motion";
import { X, Crown } from "lucide-react";

export default function PaymentModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      {/* Modal Container with Animation */}
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-8 w-[400px] relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Crown Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-yellow-100 p-3 rounded-full">
            <Crown className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-900">
          Upgrade Required
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-center mb-6 text-sm">
          🎉 You’ve used your free daily limit. Unlock **unlimited analysis** by upgrading your plan!
        </p>

        {/* Upgrade Button */}
        <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 shadow-lg transition">
          🚀 Upgrade Now
        </button>

        {/* Features List */}
        <ul className="mt-5 text-gray-700 text-sm space-y-2">
          <li>✅ Unlimited Video Analysis</li>
          <li>✅ Priority Support</li>
          <li>✅ Access to Premium Features</li>
        </ul>

        {/* Footer */}
        <div className="mt-5 text-center text-xs text-gray-400">
          Cancel anytime. Secure payment powered by Razorpay.
        </div>
      </motion.div>
    </div>
  );
}
