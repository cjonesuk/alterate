export type WorkflowNodeInput = number | string | Array<string | number>

export interface WorkflowNode {
    inputs: Record<string, WorkflowNodeInput>;
    class_type: string;
    _meta: {
      title: string;
    };
  }
  
 export interface WorkflowDocument {
    [nodeId: string]: WorkflowNode;
  }