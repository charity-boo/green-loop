import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AdminLoading() {
    return (
        <div className="p-8 animate-pulse">
            <div className="h-10 w-64 bg-gray-200 rounded mb-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="h-4 w-24 bg-gray-200 rounded" />
                            <div className="h-4 w-4 bg-gray-100 rounded" />
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 w-16 bg-green-100 rounded" />
                            <div className="h-3 w-32 bg-gray-100 rounded mt-2" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                <Card className="col-span-4">
                    <CardHeader>
                        <div className="h-6 w-48 bg-gray-200 rounded" />
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full bg-gray-50 rounded" />
                    </CardContent>
                </Card>
                <Card className="col-span-3">
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
        </div>
    );
}
