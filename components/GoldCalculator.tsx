import React, { useState, useMemo } from "react";
import { ItemVariant } from "../types";
import { numberToHindiWords } from "../utils/hindiTranslator";

interface GoldCalculatorProps {
  purePrice: number;
  variants: ItemVariant[];
}

interface CalculationResult {
  finalPrice: number;
  hindiPrice: string;
  weight: number;
  variant: ItemVariant;
  purePrice: number;
  pricePer10Gram: number;
  totalMetalPrice: number;
  purchasePrice: number;
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

    let price750 = 0;
    let hindiPrice750 = "अनुपलब्ध";
    if (variant750) {
      const rawPrice750 =
        (purePrice * variant750.tunch) / 100 + variant750.addOnCharges;
      price750 = Math.ceil(rawPrice750 / 100) * 100;
      hindiPrice750 = numberToHindiWords(price750) + " रुपये";
    }

    let price916 = 0;
    let hindiPrice916 = "अनुपलब्ध";
    if (variant916) {
      const rawPrice916 =
        (purePrice * variant916.tunch) / 100 + variant916.addOnCharges;
      price916 = Math.ceil(rawPrice916 / 100) * 100;
      hindiPrice916 = numberToHindiWords(price916) + " रुपये";
    }

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

    const variant = variants.find((v) => v.id === selectedVariantId);
    if (!variant) {
      setError("Selected variant not found.");
      return;
    }

    const purchasePricePerGram = (purePrice * variant.tunch) / 100 / 10;
    const totalPurchasePrice = purchasePricePerGram * weightNum;

    const rawPrice10g =
      (purePrice * variant.tunch) / 100 + variant.addOnCharges;
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
      pricePer10Gram: pricePerGram * 10,
      totalMetalPrice,
      purchasePrice: totalPurchasePrice,
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
                <option key={v.id} value={v.id}>
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
                <span className="text-slate-400">Variant:</span>
                <span className="text-white font-medium text-right">
                  {result.variant.name} ({result.variant.tunch}%)
                </span>
                <span className="text-slate-400">Weight:</span>
                <span className="text-white font-medium text-right">
                  {result.weight} g
                </span>
                <span className="text-slate-400">Price 10/g:</span>
                <span className="text-white font-medium text-right">
                  ₹
                  {result.pricePer10Gram.toLocaleString("en-IN", {
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
    </div>
  );
};

export default GoldCalculator;
