import {
  BooleanType,
  FloatType,
  IntType,
  StringType,
  StringValuesType,
} from "../../comfyui/useObjectInfo";

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

export function StringFormField({
  definition,
  input,
  form,
}: InputFormFieldProps<StringType>) {
  if (definition.multiline) {
    return (
      <FormField
        key={input.fieldId}
        control={form.control}
        name={input.fieldId}
        defaultValue={input.value}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{definition.name}</FormLabel>
            <FormControl>
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
      key={input.fieldId}
      control={form.control}
      name={input.fieldId}
      defaultValue={input.value}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{definition.name}</FormLabel>
          <FormControl>
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
      key={input.fieldId}
      control={form.control}
      name={input.fieldId}
      defaultValue={input.value}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{definition.name}</FormLabel>
          <FormControl>
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
      key={input.fieldId}
      control={form.control}
      name={input.fieldId}
      defaultValue={input.value}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{definition.name}</FormLabel>
          <FormControl>
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
      key={input.fieldId}
      control={form.control}
      name={input.fieldId}
      defaultValue={input.value}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{definition.name}</FormLabel>
          <FormControl>
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
      key={input.fieldId}
      control={form.control}
      name={input.fieldId}
      defaultValue={input.value}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{definition.name}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
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
