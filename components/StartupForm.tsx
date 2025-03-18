"use client";

import React, { useState, useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createPitch } from "@/lib/actions";

const StartupForm = () => {
  // State for tracking the errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  // State for saving the pitch
  const [pitch, setPitch] = useState("");
  // Toast Notifications
  const { toast } = useToast();
  // Reroute to the homepage
  const router = useRouter();

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: formData.get("link") as string,
        pitch,
      };

      await formSchema.parseAsync(formValues);

      const result = await createPitch(prevState, formData, pitch);

      if (result.status == "SUCCESS") {
        toast({
          title: "Success",
          description: "Your startup pitch has been created successfully",
        });

        router.push(`/startup/${result._id}`);
      }

      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErorrs = error.flatten().fieldErrors;

        setErrors(fieldErorrs as unknown as Record<string, string>);

        toast({
          title: "Error",
          description: "Please check your inputs and try again",
          variant: "destructive",
        });

        return { ...prevState, error: "Validation failed", status: "ERROR" };
      }

      toast({
        title: "Error",
        description: "An unexpected error has occurred",
        variant: "destructive",
      });

      return {
        ...prevState,
        error: "An unexpected error has occurred",
        status: "ERROR",
      };
    }
  };

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
  });

  return (
    <form action={formAction} className="startup-form">
      {/* Title input form */}
      <div>
        {/* Title Label */}
        <label htmlFor="title" className="startup-form_label">
          Title
        </label>
        {/* Title Input */}
        <Input
          id="title"
          name="title"
          className="startup-form_input"
          required
          placeholder="Startup Title"
        />

        {/* Checking for title input errors */}
        {errors.title && <p className="startup-form_error">{errors.title}</p>}
      </div>

      {/* Description Input */}
      <div>
        {/* Description Label */}
        <label htmlFor="description" className="startup-form_label">
          Description
        </label>
        {/* Description Input */}
        <Textarea
          id="description"
          name="description"
          className="startup-form_textarea"
          required
          placeholder="Startup Description"
        />

        {/* Checking for description errors */}
        {errors.description && (
          <p className="startup-form_error">{errors.description}</p>
        )}
      </div>

      {/* Category Input */}
      <div>
        {/* Category Label */}
        <label htmlFor="category" className="startup-form_label">
          Category
        </label>
        {/* Category Input */}
        <Input
          id="category"
          name="category"
          className="startup-form_input"
          required
          placeholder="Startup Category (Tech, Health, Education...)"
        />

        {/* Checking for category input errors */}
        {errors.category && (
          <p className="startup-form_error">{errors.category}</p>
        )}
      </div>

      {/* Image Input */}
      <div>
        {/* Image URL label */}
        <label htmlFor="link" className="startup-form_label">
          Image URL
        </label>
        {/* Image URL Input */}
        <Input
          id="link"
          name="link"
          className="startup-form_input"
          required
          placeholder="Startup Image URL"
        />

        {/* Checking for image url errors */}
        {errors.link && <p className="startup-form_error">{errors.link}</p>}
      </div>

      {/* Pitch Input */}
      <div data-color-mode="light">
        {/* Pitch Label */}
        <label htmlFor="pitch" className="startup-form_label">
          Pitch
        </label>

        {/* Pitch Input */}
        <MDEditor
          value={pitch}
          onChange={(value) => setPitch(value as string)}
          id="pitch"
          preview="edit"
          height={300}
          style={{ borderRadius: 20, overflow: "hidden" }}
          textareaProps={{
            placeholder:
              "Briefly describe your idea and what problem it solves",
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />

        {/* Checking errors in the pitch input */}
        {errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        className="startup-form_btn text-white"
        disabled={isPending}
      >
        {/* Checking the state of submission */}
        {isPending ? "Submitting..." : "Submit Your Pitch"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};

export default StartupForm;
