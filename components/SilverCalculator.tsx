import React, { useState } from "react";
import { ItemVariant } from "../types";
import { numberToHindiWords } from "../utils/hindiTranslator";

interface SilverCalculatorProps {
  purePrice: number;
  variants: ItemVariant[];
}

interface CalculationResult {
  variant: ItemVariant;
  weight: number;
  price10Gram: number;
  purchasePrice: number;
  makingCharge: number;
  sellingPrice: number;
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

    const purchasePrice =
      ((purePrice * variant.purchaseTunch) / 1000) * weightNum;
    const roundedPurchasePrice = Math.ceil(purchasePrice / 100) * 100;

    let sellingRatePer10Gram = purePrice * (variant.saleTunch / 100);
    const addOn = variant.addOnPrice ?? 0;
    if (addOn > 0) {
      sellingRatePer10Gram += addOn;
    }

    let sellingPrice = (sellingRatePer10Gram / 10) * weightNum;
    if (variant.makingChargeType === "PER_GRAM") {
      sellingPrice += variant.makingCharge * Math.ceil(weightNum);
    } else if (variant.makingChargeType === "FIXED") {
      sellingPrice += variant.makingCharge;
    }

    setResult({
      variant,
      weight: weightNum,
      price10Gram: sellingRatePer10Gram,
      purchasePrice: roundedPurchasePrice,
      makingCharge:
        variant.makingChargeType === "PER_GRAM"
          ? variant.makingCharge * Math.ceil(weightNum)
          : variant.makingCharge,
      sellingPrice: Math.round(sellingPrice),
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
            वजन (ग्राम में)
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
            वस्तु का विकल्प
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
            पैसा जोड़े
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
              <span className="text-slate-400">Item:</span>
              <span className="text-white font-medium text-right">
                {result.variant.name} ({result.variant.purchaseTunch}%)
              </span>
              <span className="text-slate-400">वजन:</span>
              <span className="text-white font-medium text-right">
                {result.weight} g - ({numberToHindiWords(result.weight)} ग्राम)
              </span>
              <span className="text-slate-400">कीमत/10g:</span>
              <span className="text-white font-medium text-right">
                ₹{result.price10Gram.toLocaleString("en-IN")} (
                {numberToHindiWords(result.price10Gram)} रुपये)
              </span>
              <span className="text-slate-400">खरीदारी कीमत:</span>
              <span className="text-white font-medium text-right">
                ₹{result.purchasePrice.toLocaleString("en-IN")} (
                {numberToHindiWords(result.purchasePrice)} रुपये)
              </span>
              <span className="text-slate-400">मेकिंग चार्ज:</span>
              <span className="text-white font-medium text-right">
                ₹{result.makingCharge.toLocaleString("en-IN")} (
                {numberToHindiWords(result.makingCharge)} रुपये)
              </span>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-600 text-center">
              <p className="text-slate-300">बिक्री कीमत:</p>
              <p className="text-3xl font-bold text-green-400 mt-1">
                ₹
                {result.sellingPrice.toLocaleString("en-IN", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-lg font-semibold text-slate-300 mt-2">
                {numberToHindiWords(result.sellingPrice)} रुपये /-
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SilverCalculator;
