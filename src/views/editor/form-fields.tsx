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
import { useCallback, useMemo } from "react";
import { useAlterateStore } from "@/lib/store";
import { EmptyImageReference, ImageReference } from "@/lib/comfyui/images";
import { useDialogControl } from "@/lib/dialog-control";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { ImageEditor } from "../../components/image-editor/image-editor";
import { ImageReferenceImage } from "./image-reference";

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
  image,
}: {
  onUploaded: (reference: ImageReference) => void;
  image?: ImageReference | null | undefined;
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
      className={`flex flex-row max-h-56 border-2 border-dashed ${borderColour} rounded p-2 text-center cursor-pointer`}
    >
      <input {...getInputProps()} />

      {image && (
        <div className="grow">
          <ImageReferenceImage image={image} />
        </div>
      )}

      {!image && <p>Drag 'n' drop some files here, or click to select files</p>}
    </div>
  );
}

interface ImageReferenceKeyValue {
  key: string;
  value: string;
  reference: ImageReference;
}
function mapImageReferenceToOption(
  imageReference: ImageReference
): ImageReferenceKeyValue | undefined {
  if (imageReference === EmptyImageReference) {
    console.log("empty", imageReference);
    return undefined;
  }

  const filenamePart = imageReference.subfolder
    ? `${imageReference.subfolder}/${imageReference.filename}`
    : imageReference.filename;

  return {
    key: `${imageReference.type}-${filenamePart}`,
    value: filenamePart,
    reference: imageReference,
  };
}

export function ImageFilenamesFormField({
  definition,
  input,
  form,
}: InputFormFieldProps<ImageFilenamesType>) {
  const [open, setOpen] = useDialogControl();

  const save = useCallback(
    (mr: ImageReference) => {
      console.log("save", mr);
      setOpen(false);
      form.setValue(input.fieldId, mr);
    },
    [setOpen, form, input.fieldId]
  );

  const imageReference: ImageReference | undefined = form.watch(input.fieldId);

  const imageReferences = definition.values;

  const options: ImageReferenceKeyValue[] = useMemo(() => {
    const all =
      imageReference &&
      imageReference !== EmptyImageReference &&
      !imageReferences.includes(imageReference)
        ? [...imageReferences, imageReference]
        : imageReferences;

    const mapped = all
      .map(mapImageReferenceToOption)
      .filter(Boolean) as ImageReferenceKeyValue[];
    console.log("all", { all, mapped });
    return mapped;
  }, [imageReference, imageReferences]);

  return (
    <FormField
      control={form.control}
      name={input.fieldId}
      defaultValue={input.value}
      render={({ field }) => {
        const fieldValue = field.value as ImageReference | undefined;
        const cnv = mapImageReferenceToOption(
          fieldValue ?? EmptyImageReference
        );

        console.log("debug", {
          fieldValue,
          cnv,
          imageReference,
          options,
        });
        return (
          <FormItem className="flex flex-row gap-1">
            <FormLabel className="flex-1">{definition.name}</FormLabel>
            <div className="flex flex-col gap-1">
              <Select
                onValueChange={(ev) => {
                  const next = options.find((o) => o.key === ev)?.reference;
                  console.log("onValueChange", { ev, next });
                  field.onChange(next);
                }}
                defaultValue={options[0]?.key}
                value={cnv?.key}
              >
                <FormControl className="flex-1">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a file" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {options.map(({ key, value }) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />

              <ImageDropzone
                onUploaded={(reference) => {
                  field.onChange(reference.filename);
                }}
                image={imageReference}
              />

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="" variant="secondary">
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-full h-full max-w-full max-h-full">
                  <ImageEditor
                    onSave={save}
                    imageReference={imageReference ?? EmptyImageReference}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </FormItem>
        );
      }}
    />
  );
}
