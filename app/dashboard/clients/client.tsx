"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { users } from "@/lib/db/schema";
import { createClientAction, updateClientAction, archiveClientAction, unarchiveClientAction } from "./actions";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type Client = {
  id: string;
  name: string;
  contactInfo: string;
  billingInfo: string;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

type Props = {
  clients: Client[];
  teamRole: "owner" | "admin" | "member";
};

const clientSchema = z.object({
  name: z.string().min(2, "Client name is required"),
  contactInfo: z.string().optional(),
  billingInfo: z.string().optional(),
  status: z.enum(["active", "inactive", "archived"]),
  notes: z.string().optional(),
});

export default function ClientPage({ clients, teamRole }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);

  const isEditable = teamRole === "admin" || teamRole === "owner";

  // Add/edit form logic
  const defaultValues = editClient
    ? { ...editClient }
    : { name: "", contactInfo: "", billingInfo: "", status: "active", notes: "" };
  const form = useForm<z.infer<typeof clientSchema>>({
    resolver: zodResolver(clientSchema),
    defaultValues,
  });

  function onSubmit(data: z.infer<typeof clientSchema>) {
    if (editClient) {
      updateClientAction({ id: editClient.id, ...data });
    } else {
      createClientAction(data);
    }
    setModalOpen(false);
    setEditClient(null);
  }

  function onArchive(id: string) {
    archiveClientAction({ id });
  }

  function onUnarchive(id: string) {
    unarchiveClientAction({ id });
  }

  return (
    <section className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clients</h1>
        {isEditable && (
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditClient(null)}>Add Client</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editClient ? "Edit Client" : "Add Client"}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Info</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="billingInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Billing Info</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl><Textarea {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">{editClient ? "Update" : "Create"} Client</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {clients.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No clients found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">StartwiseCRM helps you manage all your internal client operations in one place. Click "Add Client" to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Status</Th>
              <Th>Contact</Th>
              <Th>Last Updated</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {clients.map((client) => (
              <Tr key={client.id}>
                <Td>{client.name}</Td>
                <Td>
                  <Badge variant={client.status === "active" ? "default" : client.status === "inactive" ? "secondary" : "outline"}>
                    {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                  </Badge>
                </Td>
                <Td>{client.contactInfo}</Td>
                <Td>{new Date(client.updatedAt).toLocaleString()}</Td>
                <Td>
                  {isEditable && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => { setEditClient(client); setModalOpen(true); }}>
                        Edit
                      </Button>
                      {client.status === "archived" ? (
                        <Button size="sm" variant="outline" onClick={() => onUnarchive(client.id)}>
                          Unarchive
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" onClick={() => onArchive(client.id)}>
                          Archive
                        </Button>
                      )}
                    </div>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </section>
  );
}