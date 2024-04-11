"use client";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";

const BrokerSelection = () => {
  const { push } = useRouter();

  const connectFyersHandler = async (): Promise<void> => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    axios
      .get(`http://localhost:3010/api/fyers/connect?userId=${user?.id}`)
      .then(
        (response): void => {
          push(response.data);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  return (
    <>
      <Button
        variant="outline"
        type="button"
        onClick={() => connectFyersHandler()}
      >
        Connect to Fyers
      </Button>
    </>
  );
};

export default BrokerSelection;
