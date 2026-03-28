import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Truck, FileText, AlertTriangle } from "lucide-react";

export function ManagementView() {
  const serviceActions = [
    { icon: Truck, label: "Schedule Bulk Pickup", description: "Furniture, appliances, large items" },
    { icon: FileText, label: "Monthly Report", description: "Volume metrics and compliance" },
    { icon: Users, label: "Resident Portal", description: "Manage resident access and guides" },
    { icon: AlertTriangle, label: "Report Overspill", description: "Urgent cleanup or bin repair" },
  ];

  return (
    <div className="space-y-8">
      {/* Service Dashboard */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        {serviceActions.map((action, idx) => (
          <Button key={idx} variant="outline" className="h-auto py-6 px-4 flex flex-col gap-3 items-center text-center border-border hover:bg-muted/50 group">
            <div className="bg-emerald-50 p-2.5 rounded-xl group-hover:bg-emerald-100 transition-colors">
              <action.icon className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground leading-none mb-1">{action.label}</p>
              <p className="text-[10px] text-slate-400 font-normal">{action.description}</p>
            </div>
          </Button>
        ))}
      </div>

      {/* Property Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Service Tier: Enterprise</CardTitle>
            <CardDescription>Multi-unit customized solution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                <span className="text-sm text-muted-foreground">Pickup Frequency</span>
                <span className="text-sm font-semibold">3x Weekly</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                <span className="text-sm text-muted-foreground">Bin Capacity</span>
                <span className="text-sm font-semibold">8x 600L Bins</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Last Cleanup</span>
                <span className="text-sm font-semibold text-emerald-600">Today, 8:15 AM</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <CardHeader>
            <CardTitle className="text-lg text-emerald-400">Smart Monitoring</CardTitle>
            <CardDescription className="text-slate-400">Live bin fill-levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Bin A (Block A)</span>
                  <span className="text-emerald-400">42%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[42%]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Bin B (Block B)</span>
                  <span className="text-orange-400">88%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 w-[88%]" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
