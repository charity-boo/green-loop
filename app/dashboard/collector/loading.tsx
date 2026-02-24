import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function CollectorLoading() {
    return (
        <div className="space-y-8 p-4 animate-pulse">
            <div className="space-y-2">
                <div className="h-10 w-64 bg-gray-200 rounded" />
                <div className="h-6 w-48 bg-gray-100 rounded" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <Card key={i}>
                        <CardHeader>
                            <div className="h-4 w-32 bg-gray-200 rounded" />
                        </CardHeader>
                        <CardContent>
                            <div className="h-10 w-16 bg-blue-100 rounded" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <div className="h-6 w-48 bg-gray-200 rounded" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-12 w-full bg-gray-50 rounded" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
