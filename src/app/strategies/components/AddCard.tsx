import { Card } from "@/components/ui/card";
import { PlusIcon } from "@radix-ui/react-icons";

export default function AddCard() {
  return (
    <Card className="w-[248px] h-[146px] flex flex-col items-center justify-center p-8 gap-2 transition-color duration-200 ease-in-out hover:bg-gray-100 rounded-lg dark:hover:bg-gray-800">
      <PlusIcon className="text-4xl w-28 h-28" />
      <div className="text-lg font-medium">Add item</div>
    </Card>
  );
}
