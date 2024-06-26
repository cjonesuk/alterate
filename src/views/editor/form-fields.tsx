import {
  BooleanType,
  FloatType,
  ImageFilenamesType,
  IntType,
  StringType,
  StringValuesType,
} from "../../lib/definition-mapping";

import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { InputFormFieldProps } from "./types";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useDropzone } from "react-dropzone";
import { useCallback } from "react";
import { useAlterateStore } from "@/lib/store";
import { ImageReference } from "@/lib/comfyui/images";

export function StringFormField({
  definition,
  input,
  form,
}: InputFormFieldProps<StringType>) {
  if (definition.multiline) {
    return (
      <FormField
        control={form.control}
        name={input.fieldId}
        defaultValue={input.value}
        render={({ field }) => (
          <FormItem className="grid grid-cols-4">
            <FormLabel className="flex items-center">
              {definition.name}
            </FormLabel>
            <FormControl className="col-span-3">
              <Textarea
                placeholder={definition.placeholder}
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return (
    <FormField
      control={form.control}
      name={input.fieldId}
      defaultValue={input.value}
      render={({ field }) => (
        <FormItem className="grid grid-cols-4">
          <FormLabel className="flex items-center">{definition.name}</FormLabel>
          <FormControl className="col-span-3">
            <Input placeholder={definition.placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function IntFormField({
  definition,
  input,
  form,
}: InputFormFieldProps<IntType>) {
  return (
    <FormField
      control={form.control}
      name={input.fieldId}
      defaultValue={input.value}
      render={({ field }) => (
        <FormItem className="grid grid-cols-4">
          <FormLabel className="flex items-center">{definition.name}</FormLabel>
          <FormControl className="col-span-3">
            <Input
              type="number"
              {...field}
              min={definition.min}
              max={definition.max}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function FloatFormField({
  definition,
  input,
  form,
}: InputFormFieldProps<FloatType>) {
  return (
    <FormField
      control={form.control}
      name={input.fieldId}
      defaultValue={input.value}
      render={({ field }) => (
        <FormItem className="grid grid-cols-4">
          <FormLabel className="flex items-center">{definition.name}</FormLabel>
          <FormControl className="col-span-3">
            <Input
              type="number"
              {...field}
              min={definition.min}
              max={definition.max}
              step={definition.step}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function BooleanFormField({
  definition,
  input,
  form,
}: InputFormFieldProps<BooleanType>) {
  return (
    <FormField
      control={form.control}
      name={input.fieldId}
      defaultValue={input.value}
      render={({ field }) => (
        <FormItem className="grid grid-cols-4">
          <FormLabel className="flex items-center">{definition.name}</FormLabel>
          <FormControl className="col-span-3">
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function StringValuesFormField({
  definition,
  input,
  form,
}: InputFormFieldProps<StringValuesType>) {
  return (
    <FormField
      control={form.control}
      name={input.fieldId}
      defaultValue={input.value}
      render={({ field }) => (
        <FormItem className="grid grid-cols-4">
          <FormLabel className="flex items-center">{definition.name}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl className="col-span-3 align-middle">
              <SelectTrigger>
                <SelectValue placeholder="Select a value" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {definition.values.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function ImageDropzone({
  onUploaded,
}: {
  onUploaded: (reference: ImageReference) => void;
}) {
  const uploadImage = useAlterateStore((state) => state.uploadImage);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      uploadImage(file).then(onUploaded);
    },
    [uploadImage, onUploaded]
  );

  const { getRootProps, getInputProps, isDragAccept, isDragReject } =
    useDropzone({ onDrop, accept: { "image/*": [] }, maxFiles: 1 });

  const borderColour = isDragReject
    ? "border-red-500"
    : isDragAccept
      ? "border-green-500"
      : "border-gray-300";

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed ${borderColour} rounded p-4 text-center cursor-pointer`}
    >
      <input {...getInputProps()} />

      <p>Drag 'n' drop some files here, or click to select files</p>
    </div>
  );
}

export function ImageFilenamesFormField({
  definition,
  input,
  form,
}: InputFormFieldProps<ImageFilenamesType>) {
  return (
    <FormField
      control={form.control}
      name={input.fieldId}
      defaultValue={input.value}
      render={({ field }) => {
        const appendEntry = !definition.values.includes(field.value);
        return (
          <FormItem className="grid grid-cols-4 gap-4">
            <FormLabel>{definition.name}</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a file" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {definition.values.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
                {appendEntry && (
                  <SelectItem key={field.value} value={field.value}>
                    {field.value}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <FormMessage />

            <ImageDropzone
              onUploaded={(reference) => {
                field.onChange(reference.filename);
              }}
            />
          </FormItem>
        );
      }}
    />
  );
}
