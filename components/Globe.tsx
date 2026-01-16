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
  const [viewMode, setViewMode] = useState<"globe" | "map">("globe");
  const [mapProjection, setMapProjection] = useState<
    "mercator" | "naturalEarth" | "equalEarth" | "azimuthal" | "conic"
  >("mercator");

  useEffect(() => {
    if (viewMode !== "globe" || !svgRef.current) return;
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
        .attr("fill", oceanColor)
        .attr("stroke", darkMode ? "#666" : "#ccc")
        .attr("stroke-width", 1);

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
        const centerX = width / 2;
        const centerY = height / 2;

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
          .style("cursor", "pointer")
          .style("opacity", 0)
          .style("pointer-events", "none");

        circlesEnter
          .on("mouseover", function (event, d: any) {
            const projected = projectionRef.current!([d.lon, d.lat]);
            if (projected) {
              const [x, y] = projected;
              const center = [centerX, centerY];
              const coordinate = [d.lon, d.lat];
              const inverted = projectionRef.current?.invert?.(center as [number, number]);
              if (!inverted) return;
              const gdistance = d3.geoDistance(
                coordinate as [number, number],
                inverted as [number, number]
              );
              if (gdistance <= 1.5) {
                setHoveredBuilding(d);
                setTooltipPos({ x: x + 10, y: y - 10 });
                d3.select(this).attr("r", 6);
              }
            }
          })
          .on("mouseout", function () {
            setHoveredBuilding(null);
            setTooltipPos(null);
            d3.select(this).attr("r", 4);
          });

        circlesEnter.merge(circles as any).each(function (d: any) {
          const projected = projectionRef.current!([d.lon, d.lat]);
          if (projected) {
            const [x, y] = projected;
            const center = [centerX, centerY];
            const coordinate = [d.lon, d.lat];
            const inverted = projectionRef.current?.invert?.(center as [number, number]);
            if (!inverted) return;
            const gdistance = d3.geoDistance(
              coordinate as [number, number],
              inverted as [number, number]
            );
            const visible = gdistance <= 1.5;
            d3.select(this)
              .attr("cx", x)
              .attr("cy", y)
              .style("opacity", visible ? 1 : 0)
              .style("pointer-events", visible ? "auto" : "none");
          } else {
            d3.select(this).style("opacity", 0).style("pointer-events", "none");
          }
        });
      };

      updateBuildings();

      const drag = d3.drag<SVGSVGElement, unknown>().on("drag", (event) => {
        if (!projectionRef.current || !gRef.current) return;
        const centerX = width / 2;
        const centerY = height / 2;

        rotationRef.current[0] += event.dx * 0.5;
        rotationRef.current[1] -= event.dy * 0.5;
        projectionRef.current.rotate(rotationRef.current);
        const path = d3.geoPath().projection(projectionRef.current);
        gRef.current.selectAll("path").attr("d", path as any);
        gRef.current.selectAll("circle.building").each(function (d: any) {
          const projected = projectionRef.current!([d.lon, d.lat]);
          if (projected) {
            const [x, y] = projected;
            const center = [centerX, centerY];
            const coordinate = [d.lon, d.lat];
            const inverted = projectionRef.current?.invert?.(center as [number, number]);
            if (!inverted) return;
            const gdistance = d3.geoDistance(
              coordinate as [number, number],
              inverted as [number, number]
            );
            const visible = gdistance <= 1.5;
            d3.select(this)
              .attr("cx", x)
              .attr("cy", y)
              .style("opacity", visible ? 1 : 0)
              .style("pointer-events", visible ? "auto" : "none");
          } else {
            d3.select(this).style("opacity", 0).style("pointer-events", "none");
          }
        });
        if (hoveredBuilding) {
          const projected = projectionRef.current!([
            hoveredBuilding.lon,
            hoveredBuilding.lat,
          ]);
          if (projected) {
            const [x, y] = projected;
            const center = [centerX, centerY];
            const coordinate = [hoveredBuilding.lon, hoveredBuilding.lat];
            const inverted = projectionRef.current?.invert?.(center as [number, number]);
            if (!inverted) return;
            const gdistance = d3.geoDistance(
              coordinate as [number, number],
              inverted as [number, number]
            );
            if (gdistance <= 1.5) {
              setTooltipPos({ x: x + 10, y: y - 10 });
            } else {
              setHoveredBuilding(null);
              setTooltipPos(null);
            }
          } else {
            setHoveredBuilding(null);
            setTooltipPos(null);
          }
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
  }, [viewMode, buildings, width, height, darkMode]);

  if (svgRef.current && worldDataRef.current) {
    const svg = d3.select(svgRef.current);
    const oceanColor = darkMode ? "#2a2a2a" : "#ffffff";
    const landColor = darkMode ? "#404040" : "#e0e0e0";
    const strokeColor = darkMode ? "#666" : "#999";
    svg
      .selectAll("circle.ocean")
      .attr("fill", oceanColor)
      .attr("stroke", darkMode ? "#666" : "#ccc")
      .attr("stroke-width", 1);
    if (gRef.current) {
      gRef.current
        .selectAll("path")
        .attr("fill", landColor)
        .attr("stroke", strokeColor);
    }
  }

  if (gRef.current && projectionRef.current && worldDataRef.current) {
    const centerX = width / 2;
    const centerY = height / 2;

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
      .style("cursor", "pointer")
      .style("opacity", 0)
      .style("pointer-events", "none");

    circlesEnter
      .on("mouseover", function (event, d: any) {
        const projected = projectionRef.current!([d.lon, d.lat]);
        if (projected) {
          const [x, y] = projected;
          const center = [centerX, centerY];
          const coordinate = [d.lon, d.lat];
          const inverted = projectionRef.current?.invert?.(center as [number, number]);
          if (!inverted) return;
          const gdistance = d3.geoDistance(
            coordinate as [number, number],
            inverted as [number, number]
          );
          if (gdistance <= 1.5) {
            setHoveredBuilding(d);
            setTooltipPos({ x: x + 10, y: y - 10 });
            d3.select(this).attr("r", 6);
          }
        }
      })
      .on("mouseout", function () {
        setHoveredBuilding(null);
        setTooltipPos(null);
        d3.select(this).attr("r", 4);
      });

    circlesEnter.merge(circles as any).each(function (d: any) {
      const projected = projectionRef.current!([d.lon, d.lat]);
      if (projected) {
        const [x, y] = projected;
        const center = [centerX, centerY];
        const coordinate = [d.lon, d.lat];
        const inverted = projectionRef.current?.invert?.(center as [number, number]);
        if (!inverted) return;
        const gdistance = d3.geoDistance(
          coordinate as [number, number],
          inverted as [number, number]
        );
        const visible = gdistance <= 1.5;
        d3.select(this)
          .attr("cx", x)
          .attr("cy", y)
          .style("opacity", visible ? 1 : 0)
          .style("pointer-events", visible ? "auto" : "none");
      } else {
        d3.select(this).style("opacity", 0).style("pointer-events", "none");
      }
    });
  }

  useEffect(() => {
    if (!selectedBuilding) return;

    if (viewMode === "globe" && projectionRef.current && gRef.current) {
      rotationRef.current = [-selectedBuilding.lon, -selectedBuilding.lat];
      projectionRef.current.rotate(rotationRef.current);
      const path = d3.geoPath().projection(projectionRef.current);
      gRef.current.selectAll("path").attr("d", path as any);
      const centerX = width / 2;
      const centerY = height / 2;
      gRef.current.selectAll("circle.building").each(function (d: any) {
        const projected = projectionRef.current!([d.lon, d.lat]);
        if (projected) {
          const [x, y] = projected;
          const center = [centerX, centerY];
          const coordinate = [d.lon, d.lat];
          const inverted = projectionRef.current?.invert?.(center as [number, number]);
          if (!inverted) return;
          const gdistance = d3.geoDistance(
            coordinate as [number, number],
            inverted as [number, number]
          );
          const visible = gdistance <= 1.5;
          d3.select(this)
            .attr("cx", x)
            .attr("cy", y)
            .style("opacity", visible ? 1 : 0)
            .style("pointer-events", visible ? "auto" : "none");
        } else {
          d3.select(this).style("opacity", 0).style("pointer-events", "none");
        }
      });
      setHoveredBuilding(selectedBuilding);
      const projected = projectionRef.current([
        selectedBuilding.lon,
        selectedBuilding.lat,
      ]);
      if (projected) {
        const [x, y] = projected;
        setTooltipPos({ x: x + 10, y: y - 10 });
      }
    } else if (viewMode === "map" && mapProjectionRef.current) {
      setHoveredBuilding(selectedBuilding);
      const [x, y] = mapProjectionRef.current([
        selectedBuilding.lon,
        selectedBuilding.lat,
      ]) || [0, 0];
      setTooltipPos({ x: x + 10, y: y - 10 });
    }
  }, [selectedBuilding, viewMode, width, height]);

  const mapSvgRef = useRef<SVGSVGElement>(null);
  const mapGRef = useRef<d3.Selection<
    SVGGElement,
    unknown,
    null,
    undefined
  > | null>(null);
  const mapProjectionRef = useRef<d3.GeoProjection | null>(null);

  useEffect(() => {
    if (viewMode === "map" && mapSvgRef.current) {
      const svg = d3.select(mapSvgRef.current);
      svg.selectAll("*").remove();

      const oceanColor = darkMode ? "#2a2a2a" : "#ffffff";
      const landColor = darkMode ? "#404040" : "#e0e0e0";
      const strokeColor = darkMode ? "#666" : "#999";

      svg
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", oceanColor);

      const g = svg.append("g");
      mapGRef.current = g;

      const getProjection = () => {
        let projection: d3.GeoProjection;
        switch (mapProjection) {
          case "mercator":
            projection = d3.geoMercator();
            break;
          case "naturalEarth":
            projection = d3.geoNaturalEarth1();
            break;
          case "equalEarth":
            projection = d3.geoEqualEarth();
            break;
          case "azimuthal":
            projection = d3.geoAzimuthalEqualArea();
            break;
          case "conic":
            projection = d3.geoConicEqualArea();
            break;
          default:
            projection = d3.geoMercator();
        }
        if (worldDataRef.current && worldDataRef.current.features) {
          const sphere = { type: "Feature", geometry: { type: "Sphere" } };
          projection.fitSize([width, height], sphere as any);
        } else {
          projection
            .scale(width / (2 * Math.PI))
            .translate([width / 2, height / 2]);
        }
        return projection;
      };

      const projection = getProjection();
      mapProjectionRef.current = projection;
      const path = d3.geoPath().projection(projection);

      const initMap = () => {
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
                worldDataRef.current = data;
                renderMap();
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
                worldDataRef.current = data;
                renderMap();
                return;
              }
            } catch (e) {
              console.error("Second source failed:", e);
            }
            const sphere = { type: "Feature", geometry: { type: "Sphere" } };
            const graticule = d3.geoGraticule();
            const graticuleFeature = { type: "Feature", geometry: graticule() };
            worldDataRef.current = { features: [sphere, graticuleFeature] };
            renderMap();
          };
          loadWorldData();
        } else {
          renderMap();
        }
      };

      const renderMap = () => {
        if (!mapGRef.current || !worldDataRef.current) return;
        const projection = getProjection();
        mapProjectionRef.current = projection;
        const path = d3.geoPath().projection(projection);

        const paths = mapGRef.current
          .selectAll("path")
          .data(worldDataRef.current.features);
        paths.exit().remove();
        paths
          .enter()
          .append("path")
          .merge(paths as any)
          .attr("d", path as any)
          .attr("fill", landColor)
          .attr("stroke", strokeColor)
          .attr("stroke-width", 0.5);

        const circles = mapGRef.current
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
          .style("cursor", "pointer")
          .on("mouseover", function (event, d: any) {
            const [x, y] = projection([d.lon, d.lat]) || [0, 0];
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
          const [x, y] = projection([d.lon, d.lat]) || [0, 0];
          d3.select(this).attr("cx", x).attr("cy", y);
        });
      };

      initMap();
    }
  }, [viewMode, buildings, width, height, darkMode, mapProjection]);

  const projections = [
    { id: "mercator" as const, name: "Mercator" },
    { id: "naturalEarth" as const, name: "Natural Earth" },
    { id: "equalEarth" as const, name: "Equal Earth" },
    { id: "azimuthal" as const, name: "Azimuthal" },
    { id: "conic" as const, name: "Conic" },
  ];

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex items-center gap-4">
        <div className="relative" style={{ width, height }}>
          {viewMode === "globe" ? (
            <svg
              ref={svgRef}
              width={width}
              height={height}
              style={{ cursor: "grab" }}
            />
          ) : (
            <svg
              ref={mapSvgRef}
              width={width}
              height={height}
              style={{ cursor: "default" }}
            />
          )}
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
        {viewMode === "map" && (
          <div className="flex flex-col gap-2">
            {projections.map((proj) => (
              <button
                key={proj.id}
                onClick={() => setMapProjection(proj.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  mapProjection === proj.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {proj.name}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode("globe")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            viewMode === "globe"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          Globe
        </button>
        <button
          onClick={() => setViewMode("map")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            viewMode === "map"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          Map
        </button>
      </div>
    </div>
  );
}
