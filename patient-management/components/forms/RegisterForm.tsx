"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl } from "@/components/ui/form";
import { createUser } from "@/lib/actions/patient.actions";
import { UserFormValidation } from "@/lib/validation";

import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { GenderOptions } from "@/constants";
import { RadioGroupItem } from "../ui/radio-group";
import { Label } from "@radix-ui/react-label";

export const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true);

    try {
      const user = { name: values.name, email: values.email, phone: values.phone, };

      const newUser = await createUser(user);

      if (newUser) {
        router.push(`/patients/${newUser.$id}/register`);
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-12">
        <section className="mb-12 space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">Let us know more about yourself.</p>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information</h2>
          </div>
        </section>

        <CustomFormField fieldType={FormFieldType.INPUT} control={form.control} name="name" placeholder="John Doe" iconSrc="/assets/icons/user.svg" iconAlt="user" />

        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField fieldType={FormFieldType.INPUT} control={form.control} name="email" label="Email" placeholder="johndoe@gmail.com" iconSrc="/assets/icons/email.svg" iconAlt="email" />
            <CustomFormField fieldType={FormFieldType.PHONE_INPUT} control={form.control} name="phone" label="Phone number" placeholder="(555) 123-4567" />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField fieldType={FormFieldType.DATE_PICKER} control={form.control} name="birthDate" label="Date of birth" />
            <CustomFormField fieldType={FormFieldType.SKELETON} control={form.control} name="gender" label="Gender" renderSkeleton={(field) => (
                <FormControl>
                    <RadioGroup className="flex h-11 gap-6 xl:justify-between" onValueChange={field.onChange} defaultValue={field.value} >
                        {GenderOptions.map((option, i) => (
                            <div key={option + i} className="radio-group">
                                <RadioGroupItem value={option} id={option} />
                                <Label htmlFor={option} className="cursor-pointer">
                                    {option}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </FormControl>
            )}/>
        </div>

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};