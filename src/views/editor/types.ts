import {
  WorkflowEditorForm,
  WorkflowEditorNodeInput,
} from "@/useWorkflowEditor";

export interface InputFormFieldProps<T> {
  definition: T;
  form: WorkflowEditorForm;
  input: WorkflowEditorNodeInput;
}
