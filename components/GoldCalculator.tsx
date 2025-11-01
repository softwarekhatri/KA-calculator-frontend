import React, { useState, useMemo } from "react";
import { ItemVariant } from "../types";
import { numberToHindiWords } from "../utils/hindiTranslator";

interface GoldCalculatorProps {
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

const GoldCalculator: React.FC<GoldCalculatorProps> = ({
  purePrice,
  variants,
}) => {
  const [weight, setWeight] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState("");

  const kdmPrices = useMemo(() => {
    const variant750 = variants.find((v) => v.name === "750 KDM");
    const variant916 = variants.find((v) => v.name === "916 KDM");

    // let price750 = 0;
    let hindiPrice750 = "अनुपलब्ध";
    let price750 = purePrice * 0.85;
    hindiPrice750 = numberToHindiWords(price750) + " रुपये";

    // let price916 = 0;
    let hindiPrice916 = "अनुपलब्ध";
    let price916 = purePrice * 0.95;
    hindiPrice916 = numberToHindiWords(price916) + " रुपये";

    return {
      price750,
      price916,
      hindiPrice750,
      hindiPrice916,
      variant750Found: !!variant750,
      variant916Found: !!variant916,
    };
  }, [purePrice, variants]);

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
      ((purePrice * variant.purchaseTunch) / 1000) * weightNum + 200;
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
    <div className="space-y-8">
      <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-amber-400">
          Current KDM Rates (per 10g)
        </h3>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center bg-slate-900/50 p-3 rounded-md">
            <span className="font-semibold text-white">916 KDM (22 Karat)</span>
            {kdmPrices.variant916Found ? (
              <div className="flex flex-col items-start text-right w-full sm:w-auto">
                <p className="text-lg sm:text-xl font-bold text-green-400 leading-tight sm:leading-normal">
                  ₹
                  {kdmPrices.price916.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-lg sm:text-sm text-amber-300">
                  {kdmPrices.hindiPrice916}
                </p>
              </div>
            ) : (
              <div className="text-left text-slate-400 text-sm w-full sm:w-auto">
                Variant not found
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center bg-slate-900/50 p-3 rounded-md">
            <span className="font-semibold text-white">750 KDM (18 Karat)</span>
            {kdmPrices.variant750Found ? (
              <div className="flex flex-col items-start text-right w-full sm:w-auto">
                <p className="text-lg sm:text-xl font-bold text-green-400 leading-tight sm:leading-normal">
                  ₹
                  {kdmPrices.price750.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-lg sm:text-sm text-amber-300">
                  {kdmPrices.hindiPrice750}
                </p>
              </div>
            ) : (
              <div className="text-right text-slate-400 text-sm w-full sm:w-auto">
                Variant not found
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={`bg-slate-800/50 p-6 rounded-lg border border-slate-700 shadow-lg border-t-4 border-amber-500`}
      >
        <h2 className={`text-2xl font-bold mb-6 text-amber-400`}>
          Gold Price Calculator
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-1">
            <label
              htmlFor={`Gold-weight`}
              className="block text-sm font-medium text-slate-300"
            >
              Weight (in grams)
            </label>
            <input
              type="number"
              id={`Gold-weight`}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g., 10.5"
              className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          <div className="md:col-span-1">
            <label
              htmlFor={`Gold-variant`}
              className="block text-sm font-medium text-slate-300"
            >
              Variant
            </label>
            <select
              id={`Gold-variant`}
              value={selectedVariantId}
              onChange={(e) => setSelectedVariantId(e.target.value)}
              className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
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
              className={`w-full px-4 py-2 font-bold text-white rounded-md transition bg-amber-600 hover:bg-amber-500`}
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
                <span className="text-slate-400">Item:</span>
                <span className="text-white font-medium text-right">
                  {result.variant.name} ({result.variant.purchaseTunch}%)
                </span>
                <span className="text-slate-400">वजन:</span>
                <span className="text-white font-medium text-right">
                  {result.weight} g - ({numberToHindiWords(result.weight)}{" "}
                  ग्राम)
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
                <p className="text-lg font-semibold text-amber-300 mt-2">
                  {numberToHindiWords(result.sellingPrice)} रुपये /-
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoldCalculator;
