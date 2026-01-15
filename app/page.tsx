"use client";

import { useState, useEffect } from "react";
import Globe from "@/components/Globe";
import Sidebar from "@/components/Sidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { buildings as allBuildings, Building } from "@/lib/buildings";

export default function Home() {
  const [filteredBuildings, setFilteredBuildings] = useState(allBuildings);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <ThemeToggle
        darkMode={darkMode}
        onToggle={() => setDarkMode(!darkMode)}
      />
      <Sidebar
        allBuildings={allBuildings}
        filteredBuildings={filteredBuildings}
        onFilter={setFilteredBuildings}
        onBuildingSelect={setSelectedBuilding}
      />
      <div className="flex-1 flex items-center justify-center bg-background">
        <Globe
          buildings={filteredBuildings}
          darkMode={darkMode}
          selectedBuilding={selectedBuilding}
        />
      </div>
    </div>
  );
}
