"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Building } from "@/lib/buildings";
import { Card, CardContent } from "@/components/ui/card";

interface GlobeProps {
  buildings: Building[];
  width?: number;
  height?: number;
  darkMode?: boolean;
  selectedBuilding?: Building | null;
}

export default function Globe({
  buildings,
  width = 800,
  height = 600,
  darkMode = false,
  selectedBuilding = null,
}: GlobeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const rotationRef = useRef<[number, number]>([0, 0]);
  const worldDataRef = useRef<any>(null);
  const gRef = useRef<d3.Selection<
    SVGGElement,
    unknown,
    null,
    undefined
  > | null>(null);
  const projectionRef = useRef<d3.GeoProjection | null>(null);
  const [hoveredBuilding, setHoveredBuilding] = useState<Building | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(
    null
  );

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    const initGlobe = (geoData: any) => {
      if (!geoData) return;
      const features =
        geoData.features || (Array.isArray(geoData) ? geoData : []);
      if (!Array.isArray(features) || features.length === 0) return;

      worldDataRef.current = { features };
      svg.selectAll("*").remove();

      const oceanColor = darkMode ? "#2a2a2a" : "#ffffff";
      const landColor = darkMode ? "#404040" : "#e0e0e0";
      const strokeColor = darkMode ? "#666" : "#999";

      svg
        .append("circle")
        .attr("class", "ocean")
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .attr("r", 250)
        .attr("fill", oceanColor);

      const g = svg.append("g");
      gRef.current = g;
      const projection = d3
        .geoOrthographic()
        .scale(250)
        .translate([width / 2, height / 2])
        .rotate(rotationRef.current);
      projectionRef.current = projection;
      const path = d3.geoPath().projection(projection);

      g.selectAll("path")
        .data(features)
        .enter()
        .append("path")
        .attr("d", path as any)
        .attr("fill", landColor)
        .attr("stroke", strokeColor)
        .attr("stroke-width", 0.5);

      const updateBuildings = () => {
        if (!gRef.current || !projectionRef.current) return;
        const circles = gRef.current
          .selectAll("circle.building")
          .data(buildings, (d: any) => d.name);
        circles.exit().remove();
        const circlesEnter = circles
          .enter()
          .append("circle")
          .attr("class", "building")
          .attr("r", 4)
          .attr("fill", "#ef4444")
          .attr("stroke", darkMode ? "#fff" : "#fff")
          .attr("stroke-width", 1)
          .style("cursor", "pointer");

        circlesEnter
          .on("mouseover", function (event, d: any) {
            const [x, y] = projectionRef.current!([d.lon, d.lat]) || [0, 0];
            setHoveredBuilding(d);
            setTooltipPos({ x: x + 10, y: y - 10 });
            d3.select(this).attr("r", 6);
          })
          .on("mouseout", function () {
            setHoveredBuilding(null);
            setTooltipPos(null);
            d3.select(this).attr("r", 4);
          });

        circlesEnter.merge(circles as any).each(function (d: any) {
          const [x, y] = projectionRef.current!([d.lon, d.lat]) || [0, 0];
          d3.select(this).attr("cx", x).attr("cy", y);
        });
      };

      updateBuildings();

      const drag = d3.drag<SVGSVGElement, unknown>().on("drag", (event) => {
        if (!projectionRef.current || !gRef.current) return;
        rotationRef.current[0] += event.dx * 0.5;
        rotationRef.current[1] -= event.dy * 0.5;
        projectionRef.current.rotate(rotationRef.current);
        const path = d3.geoPath().projection(projectionRef.current);
        gRef.current.selectAll("path").attr("d", path as any);
        gRef.current.selectAll("circle.building").each(function (d: any) {
          const [x, y] = projectionRef.current!([d.lon, d.lat]) || [0, 0];
          d3.select(this).attr("cx", x).attr("cy", y);
        });
        if (hoveredBuilding) {
          const [x, y] = projectionRef.current!([
            hoveredBuilding.lon,
            hoveredBuilding.lat,
          ]) || [0, 0];
          setTooltipPos({ x: x + 10, y: y - 10 });
        }
      });

      svg.call(drag);
    };

    if (!worldDataRef.current) {
      const loadWorldData = async () => {
        try {
          const response = await fetch(
            "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
          );
          const data = await response.json();
          if (
            data &&
            data.features &&
            Array.isArray(data.features) &&
            data.features.length > 0
          ) {
            initGlobe(data);
            return;
          }
        } catch (e) {
          console.error("First source failed:", e);
        }
        try {
          const response = await fetch(
            "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json"
          );
          const data = await response.json();
          if (
            data &&
            data.features &&
            Array.isArray(data.features) &&
            data.features.length > 0
          ) {
            initGlobe(data);
            return;
          }
        } catch (e) {
          console.error("Second source failed:", e);
        }
        const sphere = { type: "Feature", geometry: { type: "Sphere" } };
        const graticule = d3.geoGraticule();
        const graticuleFeature = { type: "Feature", geometry: graticule() };
        initGlobe({ features: [sphere, graticuleFeature] });
      };
      loadWorldData();
    } else {
      initGlobe(worldDataRef.current);
    }

    if (svgRef.current && worldDataRef.current) {
      const svg = d3.select(svgRef.current);
      const oceanColor = darkMode ? "#2a2a2a" : "#ffffff";
      const landColor = darkMode ? "#404040" : "#e0e0e0";
      const strokeColor = darkMode ? "#666" : "#999";
      svg.selectAll("circle.ocean").attr("fill", oceanColor);
      if (gRef.current) {
        gRef.current
          .selectAll("path")
          .attr("fill", landColor)
          .attr("stroke", strokeColor);
      }
    }

    if (gRef.current && projectionRef.current && worldDataRef.current) {
      const circles = gRef.current
        .selectAll("circle.building")
        .data(buildings, (d: any) => d.name);
      circles.exit().remove();
      const circlesEnter = circles
        .enter()
        .append("circle")
        .attr("class", "building")
        .attr("r", 4)
        .attr("fill", "#ef4444")
        .attr("stroke", darkMode ? "#fff" : "#fff")
        .attr("stroke-width", 1)
        .style("cursor", "pointer");

      circlesEnter
        .on("mouseover", function (event, d: any) {
          const [x, y] = projectionRef.current!([d.lon, d.lat]) || [0, 0];
          setHoveredBuilding(d);
          setTooltipPos({ x: x + 10, y: y - 10 });
          d3.select(this).attr("r", 6);
        })
        .on("mouseout", function () {
          setHoveredBuilding(null);
          setTooltipPos(null);
          d3.select(this).attr("r", 4);
        });

      circlesEnter.merge(circles as any).each(function (d: any) {
        const [x, y] = projectionRef.current!([d.lon, d.lat]) || [0, 0];
        d3.select(this).attr("cx", x).attr("cy", y);
      });
    }
  }, [buildings, width, height, darkMode]);

  useEffect(() => {
    if (selectedBuilding && projectionRef.current && gRef.current) {
      rotationRef.current = [-selectedBuilding.lon, -selectedBuilding.lat];
      projectionRef.current.rotate(rotationRef.current);
      const path = d3.geoPath().projection(projectionRef.current);
      gRef.current.selectAll("path").attr("d", path as any);
      gRef.current.selectAll("circle.building").each(function (d: any) {
        const [x, y] = projectionRef.current!([d.lon, d.lat]) || [0, 0];
        d3.select(this).attr("cx", x).attr("cy", y);
      });
      setHoveredBuilding(selectedBuilding);
      const [x, y] = projectionRef.current([
        selectedBuilding.lon,
        selectedBuilding.lat,
      ]) || [0, 0];
      setTooltipPos({ x: x + 10, y: y - 10 });
    }
  }, [selectedBuilding]);

  return (
    <div className="relative" style={{ width, height }}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ cursor: "grab" }}
      />
      {hoveredBuilding && tooltipPos && (
        <div
          className="absolute pointer-events-none z-50"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y,
            transform: "translate(0, -100%)",
          }}
        >
          <Card className="w-64 shadow-lg">
            <CardContent className="p-4">
              <div className="font-medium text-base">
                {hoveredBuilding.name}
              </div>
              <div className="text-muted-foreground text-sm mt-1">
                {hoveredBuilding.city}, {hoveredBuilding.country}
              </div>
              <div className="text-xs text-muted-foreground mt-2 space-y-1">
                <div>Height: {hoveredBuilding.height}m</div>
                <div>Floors: {hoveredBuilding.floors}</div>
                <div>Year: {hoveredBuilding.year}</div>
                <div>
                  Cost: ${(hoveredBuilding.cost / 1000000000).toFixed(1)}B
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
