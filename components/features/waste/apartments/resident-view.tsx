import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Info, CheckCircle2, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ResidentView() {
  const collectionSchedule = [
    { day: "Monday", type: "General Waste", time: "8:00 AM" },
    { day: "Wednesday", type: "Recyclables", time: "10:00 AM" },
    { day: "Friday", type: "General Waste", time: "8:00 AM" },
  ];

  return (
    <div className="space-y-8">
      {/* Pickup Status */}
      <Card className="border-emerald-100 bg-emerald-50/30 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4">
          <Badge className="bg-emerald-500 hover:bg-emerald-600 border-none">On Schedule</Badge>
        </div>
        <CardHeader className="flex flex-row items-center space-x-4">
          <div className="bg-card p-3 rounded-2xl shadow-sm">
            <Clock className="h-8 w-8 text-emerald-600" />
          </div>
          <div>
            <CardTitle className="text-xl">Next Collection</CardTitle>
            <p className="text-emerald-700 font-bold text-2xl">Tomorrow, 8:00 AM</p>
          </div>
        </CardHeader>
        <CardContent className="pt-0 pb-6">
          <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
            <MapPin className="h-4 w-4" />
            <span>Central Garbage Collection Point (Block B)</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Weekly Schedule */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              Weekly Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {collectionSchedule.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-50 bg-muted/50/50">
                  <div>
                    <p className="font-semibold text-foreground">{item.day}</p>
                    <p className="text-xs text-muted-foreground">{item.type}</p>
                  </div>
                  <Badge variant="outline" className="font-mono text-slate-600 bg-background">
                    {item.time}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resident Guidelines */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              Resident Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[
                "Use biodegradable bags for organic waste",
                "Rinse containers before recycling",
                "Flatten cardboard boxes to save space",
                "Electronic waste requires special booking"
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
