import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import ConfigSection from "./components/ConfigSection";
import GoldCalculator from "./components/GoldCalculator";
import SilverCalculator from "./components/SilverCalculator";
import Modal from "./components/Modal";
import { ItemVariant, MetalType } from "./types";
import { backendInstance } from "./utils/constant";
import { IPriceData, metalType } from "./utils/types";

type Tab = "config" | "gold_calc" | "silver_calc";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("config");
  const [goldPrice, setGoldPrice] = useState<IPriceData>({
    type: "GOLD",
    price: "Fetching Data...",
  });
  const [silverPrice, setSilverPrice] = useState<IPriceData>({
    type: "SILVER",
    price: "Fetching Data...",
  });
  const [goldVariants, setGoldVariants] = useState<ItemVariant[]>([
    {
      id: "default-750-kdm",
      name: "750 KDM",
      tunch: 75,
      addOnCharges: 4500,
      makingCharge: 500,
    },
    {
      id: "default-916-kdm",
      name: "916 KDM",
      tunch: 91.6,
      addOnCharges: 4000,
      makingCharge: 400,
    },
  ]);
  const [silverVariants, setSilverVariants] = useState<ItemVariant[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ItemVariant | null>(
    null
  );
  const [editingMetalType, setEditingMetalType] = useState<MetalType>("Gold");

  const handleAddVariant = (type: MetalType) => {
    setEditingVariant(null);
    setEditingMetalType(type);
    setIsModalOpen(true);
  };

  const handleEditVariant = (type: MetalType, variant: ItemVariant) => {
    setEditingVariant(variant);
    setEditingMetalType(type);
    setIsModalOpen(true);
  };

  const handleDeleteVariant = (type: MetalType, id: string) => {
    if (window.confirm("Are you sure you want to delete this variant?")) {
      if (type === "Gold") {
        setGoldVariants((prev) => prev.filter((v) => v.id !== id));
      } else {
        setSilverVariants((prev) => prev.filter((v) => v.id !== id));
      }
    }
  };

  const handleSaveVariant = (variantData: Omit<ItemVariant, "id">) => {
    if (editingMetalType === "Gold") {
      setGoldVariants((prev) => {
        if (editingVariant) {
          return prev.map((v) =>
            v.id === editingVariant.id ? { ...v, ...variantData } : v
          );
        }
        return [...prev, { ...variantData, id: Date.now().toString() }];
      });
    } else {
      setSilverVariants((prev) => {
        if (editingVariant) {
          return prev.map((v) =>
            v.id === editingVariant.id ? { ...v, ...variantData } : v
          );
        }
        return [...prev, { ...variantData, id: Date.now().toString() }];
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
          ? "bg-slate-800/50 text-amber-400 border-b-2 border-amber-400"
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
            <GoldCalculator purePrice={goldPrice} variants={goldVariants} />
          )}
          {activeTab === "silver_calc" && (
            <SilverCalculator
              purePrice={silverPrice}
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
