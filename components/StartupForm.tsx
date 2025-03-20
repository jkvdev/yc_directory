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
  // Save all form data inside of an objects
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    link: "",
    pitch: "",
  });
  // State for tracking the errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Toast Notifications
  const { toast } = useToast();
  // Reroute to the homepage
  const router = useRouter();

  // Function to handle all input changes and save them
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData, // Keep the previous state
      [e.target.name]: e.target.value, // Update formData dynamically
    });
  };

  // Function to handle pitch changes
  const handlePitchChange = (value: string | undefined) => {
    setFormData({
      ...formData,
      pitch: value || "",
    });
  };

  // Function to handle form submission
  const handleFormSubmit = async (prevState: any, formValues: FormData) => {
    try {
      // Validate the entire form only on submit
      await formSchema.parseAsync(formData);

      // Get the result / Created pitch
      const result = await createPitch(prevState, formValues, formData.pitch);

      if (result.status == "SUCCESS") {
        // Success toast notification
        toast({
          title: "Success",
          description: "Your startup pitch has been created successfully",
        });

        // Clear the form data
        setFormData({
          title: "",
          description: "",
          category: "",
          link: "",
          pitch: "",
        });
        // Redirect to the startup page
        router.push(`/startup/${result._id}`);
      }

      // Return the result
      return result;

      // Catch any errors
    } catch (error) {
      // If it's a zod error
      if (error instanceof z.ZodError) {
        // Flatten the errors in a single array
        const fieldErorrs = error.flatten().fieldErrors;

        // Set the errors
        setErrors(fieldErorrs as unknown as Record<string, string>);

        // Display a toast notification
        toast({
          title: "Error",
          description: "Please check your inputs and try again",
          variant: "destructive",
        });

        // Return the error state
        return { ...prevState, error: "Validation failed", status: "ERROR" };
      }

      // Display a toast notification for unexpected errors
      toast({
        title: "Error",
        description: "An unexpected error has occurred",
        variant: "destructive",
      });

      // Return the error state
      return {
        ...prevState,
        error: "An unexpected error has occurred",
        status: "ERROR",
      };
    }
  };

  // Get Form state
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
          value={formData.title}
          onChange={handleChange}
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
          value={formData.description}
          onChange={handleChange}
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
          value={formData.category}
          onChange={handleChange}
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
          value={formData.link}
          onChange={handleChange}
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
          value={formData.pitch}
          onChange={handlePitchChange}
          id="pitch"
          preview="edit"
          height={340}
          className="startup-form_editor"
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
