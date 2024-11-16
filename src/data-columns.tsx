import { ColumnDef } from "@tanstack/react-table";
import { Client } from "./client";
import { Button } from "./components/ui/button";
import { RibbonIcon } from "lucide-react";

export const clientColumns: ColumnDef<Client>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "panel_name",
    header: "Painel",
  },
  {
    accessorKey: "effective_start_at",
    header: "Data de Início de Vigência",
    cell: ({ row: { original: client } }) =>
      new Date(client.effective_start_at).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
  },
  {
    accessorKey: "effective_end_at",
    header: "Data de Fim de Vigência",
    cell: ({ row: { original: client } }) =>
      new Date(client.effective_end_at).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
  },
  {
    header: "Ações",
    cell: () => (
      <Button variant={"ghost"} size={"icon"}>
        <RibbonIcon />
      </Button>
    ),
  },
];
