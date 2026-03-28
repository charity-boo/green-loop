"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { KENYA_COUNTIES } from "@/lib/constants/regions";
import { MapPin } from "lucide-react";

const GEO_URL = "/kenya-counties.geojson";

const activeAreas = ["MERU", "THARAKA - NITHI"];

export default function ServiceAreas() {
  const [tooltip, setTooltip] = useState<{ name: string; x: number; y: number } | null>(null);
  const [showTharakaNithiModal, setShowTharakaNithiModal] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  return (
    <section className="bg-muted/50 py-16 px-6 md:px-12">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-4">
          Our Service Areas
        </h2>
        <p className="text-muted-foreground mb-10 max-w-2xl mx-auto">
          Green Loop is expanding across all 47 counties of Kenya — bringing smarter, cleaner waste management to every community nationwide. Hover over a county to explore.
        </p>

        <div className="relative bg-card rounded-2xl shadow-md overflow-hidden border border-gray-100">
          {tooltip && (
            <div
              className="absolute z-10 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg pointer-events-none shadow-lg"
              style={{ top: tooltip.y - 40, left: tooltip.x - 20, transform: "translateX(-50%)" }}
            >
              {tooltip.name}
            </div>
          )}

          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ center: [37.9, 0.2], scale: 2400 }}
            width={800}
            height={700}
            style={{ width: "100%", height: "auto" }}
          >
            <ZoomableGroup>
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const countyName = geo.properties.COUNTY_NAM as string;
                    const isActive = activeAreas.includes(countyName);
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onClick={() => {
                          if (countyName === "THARAKA - NITHI") {
                            setShowTharakaNithiModal(true);
                          }
                        }}
                        onMouseEnter={(evt) => {
                          const svgEl = (evt.target as SVGElement).closest("svg");
                          const containerEl = svgEl?.parentElement;
                          if (containerEl) {
                            const cRect = containerEl.getBoundingClientRect();
                            setTooltip({
                              name: countyName
                                .split(" ")
                                .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                                .join(" "),
                              x: evt.clientX - cRect.left,
                              y: evt.clientY - cRect.top,
                            });
                          }
                        }}
                        onMouseLeave={() => setTooltip(null)}
                        style={{
                          default: {
                            fill: isActive ? "#16a34a" : "#d1fae5",
                            stroke: "#ffffff",
                            strokeWidth: 0.8,
                            outline: "none",
                          },
                          hover: {
                            fill: isActive ? "#15803d" : "#6ee7b7",
                            stroke: "#ffffff",
                            strokeWidth: 0.8,
                            outline: "none",
                            cursor: "pointer",
                          },
                          pressed: {
                            fill: "#14532d",
                            outline: "none",
                          },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </div>

        <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 rounded bg-green-600" />
            Current operational area
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 rounded bg-green-100 border border-green-300" />
            Expansion planned
          </span>
        </div>
      </div>

      {/* Tharaka Nithi Modal */}
      <Dialog open={showTharakaNithiModal} onOpenChange={(open) => {
        setShowTharakaNithiModal(open);
        if (!open) setSelectedArea(null);
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-green-700 flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              {selectedArea 
                ? `${selectedArea} - Tharaka Nithi County`
                : "Tharaka Nithi County Service Areas"
              }
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Map Section */}
            <div className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-200 shadow-sm">
              <iframe
                key={selectedArea || "tharaka-nithi"}
                title={selectedArea ? `${selectedArea} Map` : "Tharaka Nithi County Map"}
                src={selectedArea 
                  ? `https://maps.google.com/maps?q=${encodeURIComponent(selectedArea)},Tharaka+Nithi+County,Kenya&t=&z=14&ie=UTF8&iwloc=&output=embed`
                  : "https://maps.google.com/maps?q=Tharaka+Nithi+County,Kenya&t=&z=10&ie=UTF8&iwloc=&output=embed"
                }
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
              />
            </div>

            {/* Service Areas List */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Our Service Areas in Tharaka Nithi County ({KENYA_COUNTIES.find(c => c.value === "tharaka-nithi")?.subRegions.length || 0} areas)
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Click on an area to view its location on the map
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {KENYA_COUNTIES.find(c => c.value === "tharaka-nithi")?.subRegions.map((area) => (
                  <button
                    key={area.value}
                    onClick={() => setSelectedArea(area.label)}
                    className={`flex items-center gap-2 p-3 border rounded-lg transition-all text-left ${
                      selectedArea === area.label
                        ? "bg-green-600 text-white border-green-700 shadow-md"
                        : "bg-green-50 border-green-200 hover:bg-green-100"
                    }`}
                  >
                    <MapPin className={`w-4 h-4 flex-shrink-0 ${
                      selectedArea === area.label ? "text-white" : "text-green-600"
                    }`} />
                    <span className="text-sm font-medium">{area.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Info Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Green Loop</strong> provides comprehensive waste management services across all these areas in Tharaka Nithi County. 
                Schedule a pickup or contact us to learn more about our services in your area.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
