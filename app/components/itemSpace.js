"use client";
import React from 'react';
import { motion } from "framer-motion";
import PropTypes from "prop-types";

export default function ItemCard({ image, title, price, onPurchase, xpBoost }) {
  return (
    <motion.div
      className="w-56 bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-xl overflow-hidden p-3 cursor-pointer hover:shadow-indigo-600/40 transition-all duration-300"
      whileHover={{ rotateY: 5, rotateX: -5, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <div className="relative rounded-lg overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-36 w-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
      </div>

      <div className="mt-3 text-white z-20">
        <h3 className="text-base font-semibold leading-tight mb-1 truncate">
          {title}
        </h3>
        <p className="text-sm text-blue-300">
          Price: <span className="text-white font-bold">{price} 🪙</span>
        </p>

        {xpBoost && (
          <div className="w-full h-2 bg-white/10 rounded-full mt-2">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${xpBoost}%` }}
            ></div>
          </div>
        )}

        <button 
          onClick={onPurchase}
          className="mt-3 w-full bg-gradient-to-br from-blue-600 to-indigo-800 text-sm font-medium py-1.5 rounded-md text-white hover:from-indigo-700 hover:to-blue-700 transition-colors duration-200"
        >
          Buy Now
        </button>
      </div>
    </motion.div>
  );
}

ItemCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  onPurchase: PropTypes.func.isRequired,
  xpBoost: PropTypes.number,
};
