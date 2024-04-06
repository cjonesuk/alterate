import { InputTypes } from "../../comfyui/useObjectInfo";

import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  WorkflowEditorForm,
  WorkflowEditorNode,
  WorkflowEditorNodeInput,
} from "./useWorkflowEditor";
import { FieldValues, UseFormReturn } from "react-hook-form";
import {
  BooleanFormField,
  FloatFormField,
  IntFormField,
  StringFormField,
  StringValuesFormField,
} from "./form-fields";

interface Props {
  editor: WorkflowEditorNode;
  form: WorkflowEditorForm;
}

export const NodeEditorCard: React.FC<Props> = ({ editor, form }) => {
  const inputs = editor.inputs.map((input) => mapComponent(form, input));

  return (
    <Card>
      <CardHeader>
        <CardTitle> {editor.node._meta.title}</CardTitle>
        <CardDescription> {editor.node.class_type}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-2">{inputs}</CardContent>
    </Card>
  );
};

function mapComponent(
  form: UseFormReturn<FieldValues, unknown, undefined>,
  input: WorkflowEditorNodeInput
) {
  const { definition } = input;

  if (definition.type === InputTypes.IGNORED) {
    return null;
  }

  if (definition.type === InputTypes.STRING) {
    return (
      <StringFormField definition={definition} input={input} form={form} />
    );
  }

  if (definition.type === InputTypes.INT) {
    return <IntFormField definition={definition} input={input} form={form} />;
  }

  if (definition.type === InputTypes.FLOAT) {
    return <FloatFormField definition={definition} input={input} form={form} />;
  }

  if (definition.type === InputTypes.BOOLEAN) {
    return (
      <BooleanFormField definition={definition} input={input} form={form} />
    );
  }

  if (definition.type === InputTypes.STRING_VALUES) {
    return (
      <StringValuesFormField
        definition={definition}
        input={input}
        form={form}
      />
    );
  }

  return (
    <div key={input.fieldId}>
      {input.definition.name} - {input.value} UNSUPPORTED
    </div>
  );
}
