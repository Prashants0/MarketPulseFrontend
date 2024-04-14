import { useUser } from "@/app/state/user-state";
import { Card } from "@/components/ui/card";
import { supabase, uuidv4 } from "@/lib/utils";
import { PlusIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AddCard() {
  const { user } = useUser();
  const { push } = useRouter();
  const handleAddStrategy = async () => {
    const user = await supabase.auth.getUser();
    const strategyId = uuidv4();
    push(`/strategies/${strategyId}`);
  };
  return (
    <Card
      onClick={() => {
        handleAddStrategy();
      }}
      className="hover:cursor-pointer w-[248px] h-[146px] flex flex-col items-center justify-center p-8 gap-2 transition-color duration-200 ease-in-out hover:bg-gray-100 rounded-lg dark:hover:bg-gray-800"
    >
      <PlusIcon className="text-4xl w-28 h-28" />
      <div className="text-lg font-medium">Add item</div>
    </Card>
  );
}
