import { InputTypes } from "../../lib/definition-mapping";

import React from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { WorkflowEditorForm } from "./form";
import { FieldValues, UseFormReturn } from "react-hook-form";
import {
  BooleanFormField,
  FloatFormField,
  ImageFilenamesFormField,
  IntFormField,
  StringFormField,
  StringValuesFormField,
} from "./form-fields";
import {
  WorkflowEditorNode,
  WorkflowEditorNodeInput,
} from "@/lib/editor-mapping";

interface Props {
  editor: WorkflowEditorNode;
  form: WorkflowEditorForm;
}

export const NodeEditorCard: React.FC<Props> = ({ editor, form }) => {
  const inputs = editor.inputs.map((input) => mapComponent(form, input));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">
          <span>{editor.node._meta.title}</span>
          <span className="pl-2 text-xs  text-slate-500 dark:text-slate-400">
            {"["}
            {editor.node.class_type}
            {"]"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-1">{inputs}</CardContent>
    </Card>
  );
};

function mapComponent(
  form: UseFormReturn<FieldValues, unknown, undefined>,
  input: WorkflowEditorNodeInput
) {
  const { definition } = input;
  const key = input.fieldId;

  if (definition.type === InputTypes.IGNORED) {
    return null;
  }

  if (definition.type === InputTypes.STRING) {
    return (
      <StringFormField
        key={key}
        definition={definition}
        input={input}
        form={form}
      />
    );
  }

  if (definition.type === InputTypes.INT) {
    return (
      <IntFormField
        key={key}
        definition={definition}
        input={input}
        form={form}
      />
    );
  }

  if (definition.type === InputTypes.FLOAT) {
    return (
      <FloatFormField
        key={key}
        definition={definition}
        input={input}
        form={form}
      />
    );
  }

  if (definition.type === InputTypes.BOOLEAN) {
    return (
      <BooleanFormField
        key={key}
        definition={definition}
        input={input}
        form={form}
      />
    );
  }

  if (definition.type === InputTypes.STRING_VALUES) {
    return (
      <StringValuesFormField
        key={key}
        definition={definition}
        input={input}
        form={form}
      />
    );
  }

  if (definition.type === InputTypes.IMAGE_FILENAMES) {
    return (
      <ImageFilenamesFormField
        key={key}
        definition={definition}
        input={input}
        form={form}
      />
    );
  }

  return (
    <div key={key}>
      {input.definition.name} - {input.value} UNSUPPORTED
    </div>
  );
}
