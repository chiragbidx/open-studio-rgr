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
import { createProjectAction, updateProjectAction, archiveProjectAction, unarchiveProjectAction } from "./actions";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type Client = {
  id: string;
  name: string;
};
type Project = {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  status: string;
  budget: string;
  timeline: string;
  assigned: string;
  description: string;
  updatedAt: string;
};

type Props = {
  projects: Project[];
  clients: Client[];
  teamRole: "owner" | "admin" | "member";
};

const projectSchema = z.object({
  title: z.string().min(2, "Project title is required"),
  clientId: z.string().min(1, "Client is required"),
  status: z.enum(["planned", "active", "completed", "on_hold", "archived"]),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  assigned: z.string().optional(),
  description: z.string().optional(),
});

export default function ProjectsClientPage({ projects, clients, teamRole }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);

  const isEditable = teamRole === "admin" || teamRole === "owner";

  // Add/edit form logic
  const defaultValues = editProject
    ? {
      title: editProject.title,
      clientId: editProject.clientId,
      status: editProject.status,
      budget: editProject.budget ?? "",
      timeline: editProject.timeline ?? "",
      assigned: editProject.assigned ?? "",
      description: editProject.description ?? "",
    }
    : { title: "", clientId: clients[0]?.id ?? "", status: "planned", budget: "", timeline: "", assigned: "", description: "" };

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues,
  });

  function onSubmit(data: z.infer<typeof projectSchema>) {
    if (editProject) {
      updateProjectAction({ id: editProject.id, ...data });
    } else {
      createProjectAction(data);
    }
    setModalOpen(false);
    setEditProject(null);
  }

  function onArchive(id: string) {
    archiveProjectAction({ id });
  }

  function onUnarchive(id: string) {
    unarchiveProjectAction({ id });
  }

  return (
    <section className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Projects</h1>
        {isEditable && (
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditProject(null)}>Add Project</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editProject ? "Edit Project" : "Add Project"}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Title</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client</FormLabel>
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
                            {clients.map((cl) => (
                              <SelectItem key={cl.id} value={cl.id}>{cl.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                            <SelectItem value="planned">Planned</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="on_hold">On Hold</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="timeline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timeline</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="assigned"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assigned (Owner/Team)</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl><Textarea {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">{editProject ? "Update" : "Create"} Project</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No projects found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">StartwiseCRM lets you track every client engagement and deliverable with real projects. Click "Add Project" to begin.</p>
          </CardContent>
        </Card>
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Client</Th>
              <Th>Status</Th>
              <Th>Budget</Th>
              <Th>Timeline</Th>
              <Th>Owner/Team</Th>
              <Th>Last Updated</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {projects.map((project) => (
              <Tr key={project.id}>
                <Td>{project.title}</Td>
                <Td>{project.clientName}</Td>
                <Td>
                  <Badge variant={(
                    project.status === "active" ? "default"
                    : project.status === "planned" ? "secondary"
                    : project.status === "completed" ? "success"
                    : project.status === "on_hold" ? "outline"
                    : "destructive"
                  )}>
                    {project.status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Badge>
                </Td>
                <Td>{project.budget}</Td>
                <Td>{project.timeline}</Td>
                <Td>{project.assigned}</Td>
                <Td>{new Date(project.updatedAt).toLocaleString()}</Td>
                <Td>
                  {isEditable && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => { setEditProject(project); setModalOpen(true); }}>
                        Edit
                      </Button>
                      {project.status === "archived" ? (
                        <Button size="sm" variant="outline" onClick={() => onUnarchive(project.id)}>
                          Unarchive
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" onClick={() => onArchive(project.id)}>
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