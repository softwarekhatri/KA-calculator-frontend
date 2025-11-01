import React, { useState, useRef, useEffect } from "react";
import { ItemVariant } from "../types";
import PencilIcon from "./icons/PencilIcon";
import TrashIcon from "./icons/TrashIcon";
import PlusIcon from "./icons/PlusIcon";
import { IPriceData, metalType } from "@/utils/types";
import { backendInstance } from "@/utils/constant";

interface VariantTableProps {
  metalType: metalType;
  variants: ItemVariant[];
  onEdit: (variant: ItemVariant) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const VariantTable: React.FC<VariantTableProps> = ({
  metalType,
  variants,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const headerColor = metalType === "GOLD" ? "bg-amber-900/50" : "bg-slate-700";
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-slate-200">
          {metalType} Variants
        </h3>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition"
        >
          <PlusIcon className="w-4 h-4" /> Add Variant
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className={headerColor}>
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
              >
                P Tunch
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
              >
                S Tunch
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
              >
                Add-on /10g
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
              >
                Mak. charge
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
              >
                Mak. Type
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-slate-800 divide-y divide-slate-700">
            {variants.length > 0 ? (
              variants.map((variant) => (
                <tr key={variant._id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">
                    {variant.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">
                    {variant.purchaseTunch}%
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">
                    {variant.saleTunch}%
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">
                    ₹{variant.addOnPrice.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">
                    ₹{variant.makingCharge.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">
                    {variant.makingChargeType}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => onEdit(variant)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onDelete(variant._id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4 text-slate-400">
                  No {metalType} variants added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface ConfigSectionProps {
  goldPrice: number;
  setGoldPrice: (price: number) => void;
  silverPrice: number;
  setSilverPrice: (price: number) => void;
  goldVariants: ItemVariant[];
  setGoldVariants: (variants: ItemVariant[]) => void;
  silverVariants: ItemVariant[];
  setSilverVariants: (variants: ItemVariant[]) => void;
  onEditVariant: (type: metalType, variant: ItemVariant) => void;
  onDeleteVariant: (type: metalType, id: string) => void;
  onAddVariant: (type: metalType) => void;
}

const ConfigSection: React.FC<ConfigSectionProps> = (props) => {
  const [isEditingGold, setIsEditingGold] = useState(false);
  const [isEditingSilver, setIsEditingSilver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const config = {
      goldPrice: props.goldPrice,
      silverPrice: props.silverPrice,
      goldVariants: props.goldVariants,
      silverVariants: props.silverVariants,
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "khatri_alankar_config.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== "string") throw new Error("Could not read file.");

        const importedConfig = JSON.parse(text);

        // Validate and set data
        if (
          typeof importedConfig.goldPrice === "number" &&
          typeof importedConfig.silverPrice === "number" &&
          Array.isArray(importedConfig.goldVariants) &&
          Array.isArray(importedConfig.silverVariants)
        ) {
          props.setGoldPrice(importedConfig.goldPrice);
          props.setSilverPrice(importedConfig.silverPrice);
          props.setGoldVariants(importedConfig.goldVariants);
          props.setSilverVariants(importedConfig.silverVariants);
          alert("Configuration imported successfully!");
        } else {
          throw new Error("Invalid or corrupted configuration file.");
        }
      } catch (error) {
        alert(
          `Error importing file: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      } finally {
        // Reset file input value to allow re-importing the same file
        if (event.target) event.target.value = "";
      }
    };
    reader.readAsText(file);
  };

  const handleUpdatePrice = async (type: metalType) => {
    backendInstance
      .patch("/price", {
        type,
        price: type === "GOLD" ? props.goldPrice : props.silverPrice,
      })
      .then((response) => {
        if (response.data) {
          // props.setGoldPrice(response.data.price);
          console.log("Gold price updated successfully.", response.data);
        }
      })
      .catch((error) => {
        console.error("Error updating gold price:", error);
      });
  };

  return (
    <div className="space-y-12">
      <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-amber-400">Configuration</h2>
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={handleImportClick}
              className="px-3 py-2 text-sm bg-slate-600 text-white rounded-md hover:bg-slate-500 transition"
            >
              Import
            </button>
            <button
              onClick={handleExport}
              className="px-3 py-2 text-sm bg-slate-600 text-white rounded-md hover:bg-slate-500 transition"
            >
              Export
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center">
              <label
                htmlFor="goldPrice"
                className="block text-sm font-medium text-slate-300"
              >
                24 Karat Gold Price (per 10 gram)
              </label>
              <button
                // onClick={() => setIsEditingGold(!isEditingGold)}
                className="text-sm text-amber-400 hover:text-amber-300 font-semibold px-2"
                aria-label={
                  isEditingGold ? "Save gold price" : "Edit gold price"
                }
              >
                {isEditingGold ? (
                  <span
                    onClick={async () => {
                      setIsEditingGold(!isEditingGold);
                      await handleUpdatePrice("GOLD");
                    }}
                  >
                    Done
                  </span>
                ) : (
                  <span onClick={() => setIsEditingGold(!isEditingGold)}>
                    Edit
                  </span>
                )}
              </button>
            </div>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-slate-400 sm:text-sm">₹</span>
              </div>
              <input
                type="number"
                name="goldPrice"
                id="goldPrice"
                className="block w-full rounded-md border-slate-600 bg-slate-700 pl-7 pr-4 py-2 text-white focus:border-amber-500 focus:ring-amber-500 disabled:bg-slate-800 disabled:cursor-not-allowed"
                placeholder="Fetching Data..."
                value={props.goldPrice}
                onChange={(e) =>
                  props.setGoldPrice(parseFloat(e.target.value) || 0)
                }
                disabled={!isEditingGold}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center">
              <label
                htmlFor="silverPrice"
                className="block text-sm font-medium text-slate-300"
              >
                Pure Silver Price (per 10 gram)
              </label>
              <button
                // onClick={() => setIsEditingSilver(!isEditingSilver)}
                className="text-sm text-slate-400 hover:text-slate-300 font-semibold px-2"
                aria-label={
                  isEditingSilver ? "Save silver price" : "Edit silver price"
                }
              >
                {isEditingSilver ? (
                  <span
                    onClick={async () => {
                      setIsEditingSilver(!isEditingSilver);
                      await handleUpdatePrice("SILVER");
                    }}
                  >
                    Done
                  </span>
                ) : (
                  <span onClick={() => setIsEditingSilver(!isEditingSilver)}>
                    Edit
                  </span>
                )}
              </button>
            </div>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-slate-400 sm:text-sm">₹</span>
              </div>
              <input
                type="number"
                name="silverPrice"
                id="silverPrice"
                className="block w-full rounded-md border-slate-600 bg-slate-700 pl-7 pr-4 py-2 text-white focus:border-slate-500 focus:ring-slate-500 disabled:bg-slate-800 disabled:cursor-not-allowed"
                placeholder="Fetching Data..."
                value={props.silverPrice}
                onChange={(e) =>
                  props.setSilverPrice(parseFloat(e.target.value) || 0)
                }
                disabled={!isEditingSilver}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <VariantTable
          metalType="GOLD"
          variants={props.goldVariants}
          onEdit={(v) => props.onEditVariant("GOLD", v)}
          onDelete={(id) => props.onDeleteVariant("GOLD", id)}
          onAdd={() => props.onAddVariant("GOLD")}
        />
        <VariantTable
          metalType="SILVER"
          variants={props.silverVariants}
          onEdit={(v) => props.onEditVariant("SILVER", v)}
          onDelete={(id) => props.onDeleteVariant("SILVER", id)}
          onAdd={() => props.onAddVariant("SILVER")}
        />
      </div>
    </div>
  );
};

export default ConfigSection;
