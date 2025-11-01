import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import ConfigSection from "./components/ConfigSection";
import GoldCalculator from "./components/GoldCalculator";
import SilverCalculator from "./components/SilverCalculator";
import Modal from "./components/Modal";
import { ItemVariant } from "./types";
import { backendInstance } from "./utils/constant";
import { IPriceData, metalType } from "./utils/types";

type Tab = "config" | "gold_calc" | "silver_calc";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("config");
  const [goldPrice, setGoldPrice] = useState<IPriceData>({
    type: "GOLD",
    price: 0,
  });
  const [silverPrice, setSilverPrice] = useState<IPriceData>({
    type: "SILVER",
    price: 0,
  });
  const [goldVariants, setGoldVariants] = useState<ItemVariant[]>([]);
  const [silverVariants, setSilverVariants] = useState<ItemVariant[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ItemVariant | null>(
    null
  );
  const [editingMetalType, setEditingMetalType] = useState<metalType>("GOLD");

  const handleAddVariant = (type: metalType) => {
    setEditingVariant(null);
    setEditingMetalType(type);
    setIsModalOpen(true);
  };

  const handleEditVariant = (type: metalType, variant: ItemVariant) => {
    setEditingVariant(variant);
    setEditingMetalType(type);
    setIsModalOpen(true);
  };

  const handleDeleteVariant = (type: metalType, id: string) => {
    if (window.confirm("Are you sure you want to delete this variant?")) {
      backendInstance
        .delete(`/item-configs`, { data: { _id: id } })
        .then(() => {
          if (type === "GOLD") {
            setGoldVariants((prev) => prev.filter((v) => v._id !== id));
          } else {
            setSilverVariants((prev) => prev.filter((v) => v._id !== id));
          }
        })
        .catch((err) => {
          alert("Failed to delete variant.");
        });
    }
  };

  const handleSaveVariant = (variantData: ItemVariant) => {
    if (editingVariant && editingVariant._id) {
      // Update existing variant
      backendInstance
        .put(`/item-configs`, {
          ...variantData,
          _id: editingVariant._id,
          variant: editingMetalType,
        })
        .then((response) => {
          if (editingMetalType === "GOLD") {
            setGoldVariants((prev) =>
              prev.map((v) =>
                v._id === editingVariant._id
                  ? {
                      ...v,
                      ...variantData,
                      _id: editingVariant._id,
                      variant: editingMetalType,
                    }
                  : v
              )
            );
          } else {
            setSilverVariants((prev) =>
              prev.map((v) =>
                v._id === editingVariant._id
                  ? {
                      ...v,
                      ...variantData,
                      _id: editingVariant._id,
                      variant: editingMetalType,
                    }
                  : v
              )
            );
          }
        })
        .catch(() => {
          alert("Failed to update variant.");
        });
    } else {
      // Add new variant
      backendInstance
        .post(`/item-configs`, { ...variantData, variant: editingMetalType })
        .then((response) => {
          const newVariant = response.data;
          if (editingMetalType === "GOLD") {
            setGoldVariants((prev) => [...prev, newVariant]);
          } else {
            setSilverVariants((prev) => [...prev, newVariant]);
          }
        })
        .catch(() => {
          alert("Failed to add variant.");
        });
    }
  };

  const TabButton: React.FC<{
    tabId: Tab;
    currentTab: Tab;
    onClick: (tabId: Tab) => void;
    children: React.ReactNode;
  }> = ({ tabId, currentTab, onClick, children }) => (
    <button
      onClick={() => onClick(tabId)}
      className={`px-4 py-2 text-sm md:text-base font-medium rounded-t-lg transition-colors duration-300 ${
        currentTab === tabId
          ? "bg-slate-800/50 text-green-400 border-b-2 border-amber-400"
          : "text-slate-400 hover:text-white"
      }`}
    >
      {children}
    </button>
  );

  useEffect(() => {
    backendInstance.get("/price").then((response) => {
      if (response.data) {
        setGoldPrice(
          response.data.find((item: IPriceData) => item.type === "GOLD")
        );
        setSilverPrice(
          response.data.find((item: IPriceData) => item.type === "SILVER")
        );
      }
    });
  }, []);

  useEffect(() => {
    backendInstance.get("/item-configs").then((response) => {
      if (response.data) {
        const goldItems: ItemVariant[] = [];
        const silverItems: ItemVariant[] = [];
        response.data.forEach((item: ItemVariant) => {
          if (item.variant === "GOLD") {
            goldItems.push(item);
          } else if (item.variant === "SILVER") {
            silverItems.push(item);
          }
        });
        setGoldVariants(goldItems);
        setSilverVariants(silverItems);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <main className="container mx-auto px-4 pb-10">
        <div className="border-b border-slate-700 mb-6">
          <nav
            className="-mb-px flex space-x-2 md:space-x-4 justify-center md:justify-start"
            aria-label="Tabs"
          >
            <TabButton
              tabId="config"
              currentTab={activeTab}
              onClick={setActiveTab}
            >
              Configuration
            </TabButton>
            <TabButton
              tabId="gold_calc"
              currentTab={activeTab}
              onClick={setActiveTab}
            >
              Gold Calculator
            </TabButton>
            <TabButton
              tabId="silver_calc"
              currentTab={activeTab}
              onClick={setActiveTab}
            >
              Silver Calculator
            </TabButton>
          </nav>
        </div>

        <div>
          {activeTab === "config" && (
            <ConfigSection
              goldPrice={goldPrice?.price}
              setGoldPrice={(price: number) => {
                setGoldPrice({ type: "GOLD", price });
              }}
              silverPrice={silverPrice?.price}
              setSilverPrice={(price: number) => {
                setSilverPrice({ type: "SILVER", price });
              }}
              goldVariants={goldVariants}
              setGoldVariants={setGoldVariants}
              silverVariants={silverVariants}
              setSilverVariants={setSilverVariants}
              onAddVariant={handleAddVariant}
              onEditVariant={handleEditVariant}
              onDeleteVariant={handleDeleteVariant}
            />
          )}
          {activeTab === "gold_calc" && (
            <GoldCalculator
              purePrice={goldPrice.price}
              variants={goldVariants}
            />
          )}
          {activeTab === "silver_calc" && (
            <SilverCalculator
              purePrice={silverPrice.price}
              variants={silverVariants}
            />
          )}
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveVariant}
        variantToEdit={editingVariant}
        metalType={editingMetalType}
      />
    </div>
  );
};

export default App;
