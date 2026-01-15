"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Building } from "@/lib/buildings";

interface SidebarProps {
  allBuildings: Building[];
  filteredBuildings: Building[];
  onFilter: (filtered: Building[]) => void;
  onBuildingSelect?: (building: Building) => void;
}

export default function Sidebar({
  allBuildings,
  filteredBuildings,
  onFilter,
  onBuildingSelect,
}: SidebarProps) {
  const yearMin = Math.min(...allBuildings.map((b) => b.year));
  const yearMax = Math.max(...allBuildings.map((b) => b.year));
  const floorMin = Math.min(...allBuildings.map((b) => b.floors));
  const floorMax = Math.max(...allBuildings.map((b) => b.floors));
  const costMin = Math.min(...allBuildings.map((b) => b.cost));
  const costMax = Math.max(...allBuildings.map((b) => b.cost));

  const [yearRange, setYearRange] = useState([yearMin, yearMax]);
  const [floorRange, setFloorRange] = useState([floorMin, floorMax]);
  const [costRange, setCostRange] = useState([costMin, costMax]);

  const applyFilters = (
    yRange: number[],
    fRange: number[],
    cRange: number[]
  ) => {
    const filtered = allBuildings.filter(
      (b) =>
        b.year >= yRange[0] &&
        b.year <= yRange[1] &&
        b.floors >= fRange[0] &&
        b.floors <= fRange[1] &&
        b.cost >= cRange[0] &&
        b.cost <= cRange[1]
    );
    onFilter(filtered);
  };

  return (
    <div className="w-80 space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Year Built: {yearRange[0]} - {yearRange[1]}
            </label>
            <Slider
              value={yearRange}
              min={yearMin}
              max={yearMax}
              step={1}
              onValueChange={(val) => {
                setYearRange(val);
                applyFilters(val, floorRange, costRange);
              }}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Floors: {floorRange[0]} - {floorRange[1]}
            </label>
            <Slider
              value={floorRange}
              min={floorMin}
              max={floorMax}
              step={1}
              onValueChange={(val) => {
                setFloorRange(val);
                applyFilters(yearRange, val, costRange);
              }}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Cost: ${(costRange[0] / 1000000000).toFixed(1)}B - $
              {(costRange[1] / 1000000000).toFixed(1)}B
            </label>
            <Slider
              value={costRange}
              min={costMin}
              max={costMax}
              step={100000000}
              onValueChange={(val) => {
                setCostRange(val);
                applyFilters(yearRange, floorRange, val);
              }}
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Buildings ({filteredBuildings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredBuildings.map((b, i) => (
              <div
                key={i}
                className="text-sm p-2 border rounded cursor-pointer hover:bg-accent transition-colors"
                onClick={() => onBuildingSelect?.(b)}
              >
                <div className="font-medium">{b.name}</div>
                <div className="text-muted-foreground">
                  {b.city}, {b.country}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {b.height}m • {b.floors} floors • {b.year} • $
                  {(b.cost / 1000000000).toFixed(1)}B
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
