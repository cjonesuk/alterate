import {
  WorkflowEditorForm,
  WorkflowEditorNodeInput,
} from "@/views/editor/form";

export interface InputFormFieldProps<T> {
  definition: T;
  form: WorkflowEditorForm;
  input: WorkflowEditorNodeInput;
}
