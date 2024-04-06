import { InputTypes } from "./comfyui/useObjectInfo";

import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { WorkflowEditorNode } from "./useWorkflowEditor";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Switch } from "./components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./components/ui/form";

interface Props {
  editor: WorkflowEditorNode;
  form: UseFormReturn<FieldValues, unknown, undefined>;
}

export const WorkflowNodeEditorCard: React.FC<Props> = ({ editor, form }) => {
  const inputs = editor.inputs.map((input) => {
    const { definition } = input;

    if (definition.type === InputTypes.IGNORED) {
      return null;
    }

    if (definition.type === InputTypes.STRING) {
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

    if (definition.type === InputTypes.INT) {
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

    if (definition.type === InputTypes.FLOAT) {
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

    if (definition.type === InputTypes.BOOLEAN) {
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
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    if (definition.type === InputTypes.STRING_VALUES) {
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

    return (
      <div key={input.fieldId}>
        {input.definition.name} - {input.value} UNSUPPORTED
      </div>
    );
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle> {editor.node._meta.title}</CardTitle>
        <CardDescription> {editor.node.class_type}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">{inputs}</div>
      </CardContent>
    </Card>
  );
};
