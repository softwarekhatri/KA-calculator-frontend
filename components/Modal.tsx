import React, { useState, useEffect } from "react";
import { ItemVariant } from "../types";
import { metalType } from "@/utils/types";
import { capitalize } from "@/utils/helperFunction";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (variant: Omit<ItemVariant, "id">) => void;
  variantToEdit: Omit<ItemVariant, "id"> | null;
  metalType: metalType;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSave,
  variantToEdit,
  metalType,
}) => {
  const [variant, setVariant] = useState<ItemVariant>({
    name: "",
    tunch: 0,
    addOnPrice: 0,
    makingCharge: 0,
    variant: "GOLD",
  });

  useEffect(() => {
    if (variantToEdit) {
      setVariant(variantToEdit);
    } else {
      setVariant({
        name: "",
        tunch: 0,
        addOnPrice: 0,
        makingCharge: 0,
        variant: "GOLD",
      });
    }
  }, [variantToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVariant((prev) => ({
      ...prev,
      [name]:
        name === "name" ? value : value.trim() === "" ? 0 : parseFloat(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!variant.name.trim()) {
      alert("Variant Name is required.");
      return;
    }
    if (variant.tunch <= 0) {
      alert("Tunch must be greater than 0.");
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
    const safeVariant = {
      ...variant,
      addOnPrice: variant.addOnPrice || 0,
      makingCharge: variant.makingCharge || 0,
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
          {variantToEdit ? "Edit" : "Add"} {capitalize(metalType)} Variant
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
              htmlFor="tunch"
              className="block text-sm font-medium text-slate-300"
            >
              Tunch (%)
            </label>
            <input
              type="number"
              name="tunch"
              id="tunch"
              onChange={handleChange}
              required
              min="0.01"
              step="any"
              value={variant.tunch === 0 ? "" : variant.tunch}
              className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          <div>
            <label
              htmlFor="addOnPrice"
              className="block text-sm font-medium text-slate-300"
            >
              Add-On Charges (per 10g)
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
              Making Charge (fixed)
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
