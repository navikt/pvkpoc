'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { Accordion, Button, Stepper, TextField, Textarea, ToggleGroup } from "@navikt/ds-react";
import { Header } from "@navikt/ds-react-internal";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

interface Scenario {
    scenario: string,
    reason: string,
    probability: number,
    consequence: number,
    comment: string,
    measures: string
}

const schema = z.object({
    scenarios: z.object({
        scenario: z.string().min(1, { message: "Scenario må være valgt" }),
        reason: z.string().min(1, { message: "Scenario må være valgt" }),
        probability: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().gte(1, { message: "Sannsynlighet må være mellom 1-5" }).lte(5, { message: "Sannsynlighet må være mellom 1-5" })),
        consequence: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().gte(1, { message: "Konsekvens må være mellom 1-5" }).lte(5, { message: "Konsekvens må være mellom 1-5" })),
        comment: z.string(),
        measures: z.string().min(1, { message: "Tiltak må være beskrevet" })
    }).array().nonempty({ message: "Minst ett scenario må være beskrevet" })
})

export default function Scenarier() {
    const [activeStep, setActiveStep] = useState(3)
    const newScenario = (): Scenario => {
        return {
            scenario: "",
            reason: "",
            probability: 1,
            consequence: 1,
            comment: "",
            measures: ""
        }
    }

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            scenarios: [newScenario()]
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
                    className="md:max-w-3xl"
                    aria-labelledby="stepper-heading"
                    activeStep={activeStep}
                    onStepChange={(x) => setActiveStep(x)}
                    orientation="horizontal"
                >
                    <Stepper.Step href="/pvk">Ansvarlige for PVK</Stepper.Step>
                    <Stepper.Step href="#">Behandlingsgrunnlag</Stepper.Step>
                    <Stepper.Step href="#">Scenarier og tiltak</Stepper.Step>
                </Stepper>
            </div>
            <form
                onSubmit={handleSubmit((d) => console.log(d))}
                className="md:max-w-3xl flex flex-col gap-4 py-4 px-4 md:px-16"
            >
                <Controller control={control} name="scenarios" render={({ field: { onChange, value } }) => (
                    <div>
                        <Button variant="secondary" onClick={(e) => { e.preventDefault(); onChange([...value, newScenario()]) }}>Nytt scenario</Button>
                        <Accordion>
                            {value.map((scenario, idx) =>
                                <Accordion.Item key={idx}>
                                    <Accordion.Header>{scenario.reason != "" ? `${scenario.scenario} fordi ${scenario.reason}` : scenario.scenario}</Accordion.Header>
                                    <Accordion.Content className="flex flex-col gap-2">
                                        <TextField {...register(`scenarios.${idx}.scenario`)} label="Scenario" error={errors.scenarios?.[idx]?.scenario?.message?.toString()} />
                                        <TextField {...register(`scenarios.${idx}.reason`)} label="fordi..." error={errors.scenarios?.[idx]?.reason?.message?.toString()} />
                                        <ToggleGroup 
                                            label="Sannsynlighet"
                                            className="flex flex-col"
                                            defaultValue="1"
                                            onChange={(v) => onChange(value.map((scenario, i) => i === idx ? {...scenario, probability: v} : scenario))}
                                        >
                                            <ToggleGroup.Item value="1">
                                                1
                                            </ToggleGroup.Item>
                                            <ToggleGroup.Item value="2">
                                                2
                                            </ToggleGroup.Item>
                                            <ToggleGroup.Item value="3">
                                                3
                                            </ToggleGroup.Item>
                                            <ToggleGroup.Item value="4">
                                                4
                                            </ToggleGroup.Item>
                                            <ToggleGroup.Item value="5">
                                                5
                                            </ToggleGroup.Item>
                                        </ToggleGroup>
                                        <ToggleGroup 
                                            label="Konsekvens"
                                            className="flex flex-col"
                                            defaultValue="1"
                                            onChange={(v) => onChange(value.map((scenario, i) => i === idx ? {...scenario, consequence: v} : scenario))}
                                        >
                                            <ToggleGroup.Item value="1">
                                                1
                                            </ToggleGroup.Item>
                                            <ToggleGroup.Item value="2">
                                                2
                                            </ToggleGroup.Item>
                                            <ToggleGroup.Item value="3">
                                                3
                                            </ToggleGroup.Item>
                                            <ToggleGroup.Item value="4">
                                                4
                                            </ToggleGroup.Item>
                                            <ToggleGroup.Item value="5">
                                                5
                                            </ToggleGroup.Item>
                                        </ToggleGroup>
                                        <TextField {...register(`scenarios.${idx}.comment`)} label="Kommentar" error={errors.scenarios?.[idx]?.comment?.message?.toString()} />
                                        <TextField {...register(`scenarios.${idx}.measures`)} label="Tiltak" error={errors.scenarios?.[idx]?.measures?.message?.toString()} />
                                    </Accordion.Content>
                                </Accordion.Item>
                            ).reverse()}
                        </Accordion>
                        {JSON.stringify(value)}
                    </div>
                )} />
                <Button variant="primary">Lagre</Button>
            </form>
        </div>
    </div>)
}