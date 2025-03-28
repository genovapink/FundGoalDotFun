import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shadcn/tabs";

export function BuySellTabs() {
  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="account">Buy</TabsTrigger>
        <TabsTrigger value="password">Sell</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Make changes to your account here.</TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  );
}
