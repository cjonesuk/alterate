import {
  WorkflowEditorForm,
  WorkflowEditorNodeInput,
} from "@/views/editor/useWorkflowEditor";

export interface InputFormFieldProps<T> {
  definition: T;
  form: WorkflowEditorForm;
  input: WorkflowEditorNodeInput;
}
