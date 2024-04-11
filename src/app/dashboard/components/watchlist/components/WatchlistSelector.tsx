import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandSeparator,
  CommandItem,
} from "@/components/ui/command";
import axios, { AxiosResponse } from "axios";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CaretDownIcon, Cross2Icon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { useEffect } from "react";
import { Watchlists } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FilePlusIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  useUpdateWatchlist,
  useWatchlist,
} from "@/app/dashboard/contexts/watchlist";
import { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

const create_watchlist = async (name: String) => {
  const response: AxiosResponse = await axios.post(
    "/api/watchlist/createWatchlist",
    {
      name: name,
      user_id: "1",
    }
  );
  if (response.status !== 200) {
    throw new Error("Failed to create watchlist");
  }
  return true;
};

const delete_watchlist = async (watchlist_id: string) => {
  const response: AxiosResponse = await axios.delete(
    `/api/watchlist/deleteWathchlist`,
    {
      data: {
        watchlist_id: watchlist_id,
      },
    }
  );
  if (response.status !== 200) {
    throw new Error("Failed to delete watchlist");
  }
  return response.data;
};

function WatchlistSelector({ className }: { className?: string }) {
  const { toast } = useToast();

  const watchlistId = useWatchlist();
  const updateWatchlistId = useUpdateWatchlist();

  //states
  const [refreshTrigger, setRefreshTrigger] = React.useState(true);
  const [newWatchlistName, setNewWatchlistName] = React.useState<String>("");
  const [hoveringList, setHoveringList] = React.useState<String>("");
  const [open, setOpen] = React.useState<boolean>(false);
  const [showNewWatchlistDialog, setShowNewWatchlistDialog] =
    React.useState(false);
  const [selectedWatchlist, setSelectedWatchlist] =
    React.useState<String>("Select a watchlist");

  const createNewWatchlist = () => {
    create_watchlist(newWatchlistName)
      .then((res) => {
        setRefreshTrigger(!refreshTrigger);
        setShowNewWatchlistDialog(false);
        setNewWatchlistName("");
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: err.message,
          duration: 5000,
        });
      });
  };
  const { data: watchlists } = useQuery({
    queryKey: ["wathclistGet", refreshTrigger],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      const response: AxiosResponse = await axios.get(
        `/api/watchlist/getWatchlist?user_id=${user.data.user?.id}`
      );
      if (response.status !== 200) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to fetch watchlists",
          duration: 5000,
        });
      }
      let watchlists: Watchlists[] = response.data as Watchlists[];
      return watchlists;
    },
  });

  const deleteSelectedWatchlist = () => {
    delete_watchlist(watchlistId.toString())
      .then((res) => {
        setRefreshTrigger(!refreshTrigger);
        setShowNewWatchlistDialog(false);
        setNewWatchlistName("");
        setSelectedWatchlist(watchlists![0].name);
        updateWatchlistId(watchlists![0].watchlist_id);
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: err.message,
          duration: 5000,
        });
      });
  };

  return (
    <>
      <AlertDialog>
        <Dialog
          open={showNewWatchlistDialog}
          onOpenChange={setShowNewWatchlistDialog}
        >
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                aria-controls="watchlist-selector"
                role="combobox"
                aria-label="Select a watchlist"
                aria-expanded={open}
                className={"h-8 max-w-min max-w-50 m-2 rounded-none"}
              >
                <span>{selectedWatchlist}</span>
                <CaretDownIcon className="h-4 w-4 shrink-0 opacity-50 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[200] p-0 ">
              <Command className="rounded-none">
                <CommandInput placeholder="Search watchlist" />
                <CommandList className="rounded-none">
                  <CommandEmpty>
                    <h1>No watchlist to show</h1>
                  </CommandEmpty>
                  <CommandGroup>
                    {watchlists ? (
                      watchlists.map((watchlist) => {
                        return (
                          <CommandItem
                            className=" text-sm rounded-none justify-between hover:bg-gray-100 items-center cursor-pointer"
                            key={watchlist.watchlist_id}
                            onSelect={() => {
                              setSelectedWatchlist(watchlist.name);
                              updateWatchlistId(watchlist.watchlist_id);
                              setOpen(false);
                            }}
                            onMouseOver={() => {
                              setHoveringList(watchlist.watchlist_id);
                            }}
                            onMouseOut={() => {
                              setHoveringList("");
                            }}
                          >
                            <span>{watchlist.name}</span>
                            <span
                              key={watchlist.watchlist_id}
                              className="opacity-50"
                            >
                              {hoveringList === watchlist.watchlist_id ? (
                                <AlertDialogTrigger asChild>
                                  <Cross2Icon
                                    onClick={() => {
                                      setSelectedWatchlist(watchlist.name);
                                      updateWatchlistId(watchlist.watchlist_id);
                                      setOpen(false);
                                    }}
                                    className="h-4 w-4 shrink-0 opacity-50"
                                    m-0
                                  />
                                </AlertDialogTrigger>
                              ) : (
                                watchlist.num_of_symbols
                              )}
                            </span>
                          </CommandItem>
                        );
                      })
                    ) : (
                      <h2>Nothing to show</h2>
                    )}
                  </CommandGroup>
                </CommandList>
                <CommandSeparator alwaysRender={true} />
                <CommandList className="rounded-none">
                  <CommandGroup>
                    <DialogTrigger asChild>
                      <CommandItem
                        className="rounded-none hover:cursor-pointer"
                        onSelect={() => {
                          setOpen(false);
                          setShowNewWatchlistDialog(true);
                        }}
                      >
                        <FilePlusIcon className="mr-2 h-5 w-5" />
                        Create a new watchlist
                      </CommandItem>
                    </DialogTrigger>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new watchlist</DialogTitle>
            </DialogHeader>
            <div>
              <div className="space-y-4 py-2 pb-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Watchlist Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter watchlist name"
                    onChange={(e) => setNewWatchlistName(e.target.value)}
                    value={newWatchlistName.toString()}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowNewWatchlistDialog(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={() => {
                  createNewWatchlist();
                }}
              >
                Continue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete watchlist &quot;
              {selectedWatchlist}&quot;?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteSelectedWatchlist();
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default WatchlistSelector;
