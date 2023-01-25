'use client'

import { Button, Select, Stepper, TextField, Textarea } from "@navikt/ds-react";
import { Header } from "@navikt/ds-react-internal";
import { useState } from "react";
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";

const schema = z.object({
    tema: z.string().min(1, {message: "Tema må være satt"}),
    team: z.string().min(1, {message: "Team må være valgt"}),
    participants: z.string().array().nonempty({message: "Det må være med minst én deltaker"}),
    risk_owner: z.string().min(1, {message: "Risikoeier må være satt"}),
    status: z.string(),
    comments: z.string().optional(),
})

export default function Pvk() {
    const [activeStep, setActiveStep] = useState(1)
    const [participant, setParticipant] = useState("")

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
      } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            tema: "",
            team: "",
            participants: [],
            risk_owner: "",
            status: "under-arbeid",
            comments: ""
        }
      });

    return (<div className="bg-surface-subtle min-h-screen">
        <Header>
            <Header.Title as="h1">pvk/poc</Header.Title>
            <Header.User name="PVK PVKsen" className="ml-auto" />
        </Header>
        <div className="py-6 px-8">
            <div className="flex flex-col">
                <Stepper
                    className="max-w-2xl"
                    aria-labelledby="stepper-heading"
                    activeStep={activeStep}
                    onStepChange={(x) => setActiveStep(x)}
                    orientation="horizontal"
                >
                    <Stepper.Step href="#">Ansvarlige for PVK</Stepper.Step>
                    <Stepper.Step href="#">Behandlingsgrunnlag</Stepper.Step>
                    <Stepper.Step href="#">Scenarier og tiltak</Stepper.Step>
                </Stepper>
            </div>
            <form 
                onSubmit={handleSubmit((d) => console.log(d))}
                className="max-w-xl flex flex-col gap-4 py-4 px-16"
            >
                <TextField {...register("tema")} label="Tema for PVK" error={errors.tema?.message?.toString()} />
                <Select {...register("team")} label="Ansvarlig team" error={errors.team?.message?.toString()}>
                    <option value="">Velg team</option>
                    <option value="pvk-teamet">PVK-teamet</option>
                    <option value="et annet team">Et annet team</option>
                </Select>
                <Controller control={control} name="participants" render={({field: { onChange, value}}) => (
                    <div>
                        <div className="flex gap-2 items-end">
                            <TextField value={participant} onChange={(e) => setParticipant(e.currentTarget.value)} label="Deltakere" className="pb-2 flex-grow" error={errors.participants != null} />
                            <Button variant="secondary" className="h-12 my-2" onClick={(e) => {
                                e.preventDefault();
                                if (participant != "") {
                                    onChange([...value, participant])
                                    setParticipant("")
                                }
                            }}>Legg til</Button>
                        </div>
                        {errors.participants?.message && <p className="flex gap-2 text-text-danger navds-label before:content-['•']">{errors.participants.message?.toString()}</p>}
                        {value && <ul className="list-disc ml-4">{value.map((v: string, idx: number) => <li key={idx}>{v}</li>)}</ul>}
                    </div>
                )} />
                <TextField {...register("risk_owner")} label="Risikoeier" error={errors.risk_owner?.message?.toString()} />
                <hr />
                <Select {...register("status")} label="Status" description="Description">
                    <option value="under-arbeid">Under arbeid</option>
                    <option value="til-godkjenning">Til godkjenning</option>
                    <option value="godkjent">Godkjent</option>
                </Select>
                <Textarea {...register("comments")} label="Kommentarer" />
                <Button variant="primary" className="w-24">Lagre</Button>
            </form>
        </div>
    </div>)
}