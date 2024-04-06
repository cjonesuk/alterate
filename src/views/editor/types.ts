import {
  WorkflowEditorForm,
  WorkflowEditorNodeInput,
} from "@/views/editor/use-workflow-editor";

export interface InputFormFieldProps<T> {
  definition: T;
  form: WorkflowEditorForm;
  input: WorkflowEditorNodeInput;
}
