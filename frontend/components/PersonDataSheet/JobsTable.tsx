import { Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { KeyedState } from "@/lib/useKeyedState";
import { ChangeEvent } from "react";
import { Input } from "../ui/input";
import { Job } from "@/lib/personInterfaces";
import { Label } from "@radix-ui/react-label";
import { DateInput } from "./DateInput";

interface Props {
  jobs: KeyedState<Job>[];
  addJob: (job: Job) => void;
  updateJob: (key: string, job: Job) => void;
  deleteJob: (key: string) => void;
}

export function JobsTable({ jobs, addJob, updateJob, deleteJob }: Props) {
  const handleAddNewJob = () => addJob({ name: "", place: "", from_date: "", untill_date: "" });

  const jobsInputs = jobs.map((job) => {
    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => updateJob(job.key, { ...job.value, name: e.target.value });
    const handlePlaceChange = (e: ChangeEvent<HTMLInputElement>) => updateJob(job.key, { ...job.value, place: e.target.value });
    const handleFromDateChange = (from: string) => updateJob(job.key, { ...job.value, from_date: from });
    const handleUntillDateChange = (untill: string) => updateJob(job.key, { ...job.value, untill_date: untill });
    const handleDelete = () => deleteJob(job.key);

    return (
      <TableRow key={job.key}>
        <TableCell>
          <Label>Posada</Label>
          <Input placeholder="Posada" value={job.value.name} onChange={handleNameChange} />
          <Label className="block mt-4">Miejsce pracy</Label>
          <Input type="text" placeholder="Miejsce pracy" value={job.value.place} onChange={handlePlaceChange} />
        </TableCell>

        <TableCell>
          <Label>Rozpoczęcie pracy</Label>
          <DateInput date={job.value.from_date} onDateChange={handleFromDateChange} />
          <Label className="block mt-4">Zakończenie pracy</Label>
          <DateInput date={job.value.untill_date} onDateChange={handleUntillDateChange} />
        </TableCell>

        <TableCell className="w-10">
          <Button size="icon" onClick={handleDelete}>
            <Trash className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    )
  })

  return (
    <>
      <h3 className="text-2xl font-semibold tracking-tight text-center mt-5">
        Prace
      </h3>
      <Table>
        <TableBody>
          {jobsInputs}
          <TableRow>
            <TableCell colSpan={3}>
              <Button onClick={handleAddNewJob} className="w-full">
                <Plus className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  )
}