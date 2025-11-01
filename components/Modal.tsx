import React, { useState, useEffect } from "react";
import { ItemVariant } from "../types";
import { metalType, makingChargeType } from "@/utils/types";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (variant: Omit<ItemVariant, "_id">) => void;
  variantToEdit: Omit<ItemVariant, "_id"> | null;
  metalType: metalType;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSave,
  variantToEdit,
  metalType,
}) => {
  const [variant, setVariant] = useState<Omit<ItemVariant, "_id">>({
    name: "",
    purchaseTunch: 0,
    saleTunch: 0,
    addOnPrice: 0,
    makingCharge: 0,
    makingChargeType: "PER_GRAM",
    variant: metalType,
  });

  useEffect(() => {
    if (variantToEdit) {
      setVariant(variantToEdit);
    } else {
      setVariant({
        name: "",
        purchaseTunch: 0,
        saleTunch: 0,
        addOnPrice: 0,
        makingCharge: 0,
        makingChargeType: "PER_GRAM",
        variant: metalType,
      });
    }
  }, [variantToEdit, isOpen, metalType]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setVariant((prev) => {
      if (name === "name") {
        return { ...prev, name: value };
      }
      if (name === "makingChargeType") {
        return { ...prev, makingChargeType: value as makingChargeType };
      }
      if (name === "variant") {
        return { ...prev, variant: value as metalType };
      }
      // Numeric fields
      return { ...prev, [name]: value.trim() === "" ? 0 : parseFloat(value) };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!variant.name.trim()) {
      alert("Variant Name is required.");
      return;
    }
    if (variant.purchaseTunch <= 0) {
      alert("Purchase Tunch must be greater than 0.");
      return;
    }
    if (variant.saleTunch <= 0) {
      alert("Sale Tunch must be greater than 0.");
      return;
    }
    if (variant.addOnPrice < 0) {
      alert("Add-On Price cannot be negative.");
      return;
    }
    if (variant.makingCharge < 0) {
      alert("Making Charge cannot be negative.");
      return;
    }
    // Ensure blank fields are set to zero before saving
    const safeVariant: Omit<ItemVariant, "_id"> = {
      ...variant,
      addOnPrice: variant.addOnPrice || 0,
      makingCharge: variant.makingCharge || 0,
      variant: metalType,
    };
    onSave(safeVariant);
    onClose();
  };

  const metalColor =
    metalType === "GOLD" ? "border-amber-500" : "border-slate-400";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div
        className={`bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md border-t-4 ${metalColor}`}
      >
        <h2 className="text-2xl font-bold mb-4 text-white">
          {variantToEdit ? "Edit" : "Add"} {metalType} Variant
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-300"
            >
              Variant Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={variant.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          <div>
            <label
              htmlFor="purchaseTunch"
              className="block text-sm font-medium text-slate-300"
            >
              Purchase Tunch (%)
            </label>
            <input
              type="number"
              name="purchaseTunch"
              id="purchaseTunch"
              value={variant.purchaseTunch === 0 ? "" : variant.purchaseTunch}
              onChange={handleChange}
              required
              min="0.01"
              step="any"
              className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          <div>
            <label
              htmlFor="saleTunch"
              className="block text-sm font-medium text-slate-300"
            >
              Sale Tunch (%)
            </label>
            <input
              type="number"
              name="saleTunch"
              id="saleTunch"
              value={variant.saleTunch === 0 ? "" : variant.saleTunch}
              onChange={handleChange}
              required
              min="0.01"
              step="any"
              className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          <div>
            <label
              htmlFor="addOnPrice"
              className="block text-sm font-medium text-slate-300"
            >
              Add-On Price (per 10g)
            </label>
            <input
              type="number"
              name="addOnPrice"
              id="addOnPrice"
              onChange={handleChange}
              min="0"
              step="any"
              className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              value={variant.addOnPrice === 0 ? "" : variant.addOnPrice}
            />
          </div>
          <div>
            <label
              htmlFor="makingCharge"
              className="block text-sm font-medium text-slate-300"
            >
              Making Charge
            </label>
            <input
              type="number"
              name="makingCharge"
              id="makingCharge"
              onChange={handleChange}
              min="0"
              step="any"
              className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              value={variant.makingCharge === 0 ? "" : variant.makingCharge}
            />
          </div>
          <div>
            <label
              htmlFor="makingChargeType"
              className="block text-sm font-medium text-slate-300"
            >
              Making Charge Type
            </label>
            {/* <input
              type="number"
              name="makingChargeType"
              id="makingCharge"
              onChange={handleChange}
              min="0"
              step="any"
              className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              value={variant.makingCharge === 0 ? "" : variant.makingCharge}
            /> */}
            <select
              name="makingChargeType"
              id="makingChargeType"
              onChange={handleChange}
              value={variant.makingChargeType || "PER_GRAM"}
              className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="PER_GRAM">Per Gram</option>
              <option value="FIXED">Fixed</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-500 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-500 transition"
            >
              Save Variant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
