import React, { useState } from "react";
import { ItemVariant } from "../types";
import { numberToHindiWords } from "../utils/hindiTranslator";

interface SilverCalculatorProps {
  purePrice: number;
  variants: ItemVariant[];
}

interface CalculationResult {
  finalPrice: number;
  hindiPrice: string;
  weight: number;
  variant: ItemVariant;
  purePrice: number;
  pricePe10Gram: number;
  totalMetalPrice: number;
  purchasePrice: number;
}

const SilverCalculator: React.FC<SilverCalculatorProps> = ({
  purePrice,
  variants,
}) => {
  const [weight, setWeight] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    setResult(null);

    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      setError("Please enter a valid weight.");
      return;
    }

    if (!selectedVariantId) {
      setError("Please select a variant.");
      return;
    }

    const variant = variants.find((v) => v._id === selectedVariantId);
    if (!variant) {
      setError("Selected variant not found.");
      return;
    }

    const purchasePricePerGram = (purePrice * variant.tunch) / 100 / 10;
    const totalPurchasePrice = purchasePricePerGram * weightNum;
    const rawPrice10g = (purePrice * variant.tunch) / 100 + variant.addOnPrice;
    const roundedPrice10g = Math.ceil(rawPrice10g / 100) * 100;
    const pricePerGram = roundedPrice10g / 10;
    const totalMetalPrice = pricePerGram * weightNum;
    const finalPrice = totalMetalPrice + variant.makingCharge;
    const hindiPriceText =
      numberToHindiWords(Math.round(finalPrice)) + " रुपये";

    setResult({
      finalPrice,
      hindiPrice: hindiPriceText,
      weight: weightNum,
      variant,
      purePrice: purePrice / 10,
      pricePe10Gram: pricePerGram * 10,
      totalMetalPrice,
      purchasePrice: totalPurchasePrice,
    });
  };

  return (
    <div
      className={`bg-slate-800/50 p-6 rounded-lg border border-slate-700 shadow-lg border-t-4 border-slate-500`}
    >
      <h2 className={`text-2xl font-bold mb-6 text-slate-400`}>
        Silver Price Calculator
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="md:col-span-1">
          <label
            htmlFor={`Silver-weight`}
            className="block text-sm font-medium text-slate-300"
          >
            Weight (in grams)
          </label>
          <input
            type="number"
            id={`Silver-weight`}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="e.g., 10.5"
            className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-slate-500 focus:border-slate-500"
          />
        </div>
        <div className="md:col-span-1">
          <label
            htmlFor={`Silver-variant`}
            className="block text-sm font-medium text-slate-300"
          >
            Variant
          </label>
          <select
            id={`Silver-variant`}
            value={selectedVariantId}
            onChange={(e) => setSelectedVariantId(e.target.value)}
            className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-slate-500 focus:border-slate-500"
          >
            <option value="">Select a variant</option>
            {variants.map((v) => (
              <option key={v._id} value={v._id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-1">
          <button
            onClick={handleCalculate}
            className={`w-full px-4 py-2 font-bold text-white rounded-md transition bg-slate-600 hover:bg-slate-500`}
          >
            Calculate Price
          </button>
        </div>
      </div>

      {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}

      {result && (
        <div className="mt-8 pt-6 border-t border-slate-700">
          <h3 className="text-xl font-semibold mb-4 text-white">
            Calculation Result
          </h3>
          <div className="bg-slate-900/50 p-4 rounded-lg space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-slate-400">Variant:</span>
              <span className="text-white font-medium text-right">
                {result.variant.name} ({result.variant.tunch}%)
              </span>
              <span className="text-slate-400">Weight:</span>
              <span className="text-white font-medium text-right">
                {result.weight} g
              </span>
              <span className="text-slate-400">Price /10g:</span>
              <span className="text-white font-medium text-right">
                ₹
                {result.pricePe10Gram.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className="text-slate-400">खरीदारी Price:</span>
              <span className="text-white font-medium text-right">
                ₹
                {result.purchasePrice.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className="text-slate-400">Total Metal Price:</span>
              <span className="text-white font-medium text-right">
                ₹
                {result.totalMetalPrice.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className="text-slate-400">Making Charge:</span>
              <span className="text-white font-medium text-right">
                ₹{result.variant.makingCharge.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-600 text-center">
              <p className="text-slate-300">Final Price</p>
              <p className="text-3xl font-bold text-green-400 mt-1">
                ₹
                {result.finalPrice.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-lg font-semibold text-amber-300 mt-2">
                {result.hindiPrice}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SilverCalculator;
