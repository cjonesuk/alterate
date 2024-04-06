import { useQuery } from "@tanstack/react-query";
 
import { FluffyRequired, Input, InputDefinition, ObjectInfoRoot, ObjectNode } from "./types/node-definitions";
import { fetchObjectInfo } from "./api";

export const InputTypes = { 
    INT: "types/INT",
    FLOAT: "types/FLOAT",
    BOOLEAN: "types/BOOLEAN",
    STRING: "types/STRING",
    STRING_VALUES : "types/STRING_VALUES",
    IGNORED: "IGNORED", 
} as const

export type NodeInput = {
    required: boolean,
    name: string,
}

export type IntType = NodeInput & {
    type: typeof InputTypes.INT,
    default: number,
    min: number,
    max: number
}

export type FloatType = NodeInput & {
    type: typeof InputTypes.FLOAT,
    default: number,
    min: number,
    max: number
    step: number,
    round: number
}

export type BooleanType = NodeInput & { 
    type: typeof InputTypes.BOOLEAN,
    default: boolean
    label_on: string
    label_off: string
}

export type StringType = NodeInput & {
    type: typeof InputTypes.STRING
    multiline: boolean
    placeholder: string
}

export type StringValuesType = NodeInput & {
    type: typeof InputTypes.STRING_VALUES,
    values: string[]
}
 

export type IgnoredType = NodeInput & {
    type: typeof InputTypes.IGNORED 
}
 
export type AnyInputType = IntType | FloatType | BooleanType | StringType | StringValuesType |  IgnoredType

export type NodeDefinition = {
    class_type : string,
    inputs: AnyInputType[]
}
  
function mapInput(inputName: string, inputDef: InputDefinition) : AnyInputType | undefined {
    if(inputDef instanceof Array) { 
        const [type, ...rest] = inputDef

        const properties = rest[0] as FluffyRequired | undefined

        if(type instanceof Array) {
            return {
                type: InputTypes.STRING_VALUES,
                required: true,
                name: inputName,                
                values: type as string[]
            }
        }

        if(type === 'INT') { 
            return {
                type: InputTypes.INT,
                required: true,
                name: inputName,              
                default: (properties?.default ?? 0) as number,
                min: properties?.min ?? Number.MIN_VALUE as number,
                max: properties?.max ?? Number.MAX_VALUE as number                
            };
        }

        if(type === 'FLOAT') { 
             return {
                type: InputTypes.FLOAT,
                required: true,
                name: inputName,                
                default: (properties?.default ?? 0) as number,
                min: properties?.min ?? Number.MIN_VALUE as number,
                max: properties?.max ?? Number.MAX_VALUE as number,
                step: properties?.step ?? 0.1 as number,
                round: (properties?.round ?? 0.01) as number
            }
        }

        if(type === 'BOOLEAN') { 
            return {
                type: InputTypes.BOOLEAN,
                required: true,
                name: inputName,                
                default: (properties?.default ?? false) as boolean,
                label_on: properties?.label_on ?? 'enable',
                label_off: properties?.label_off ?? 'disable'
            }
        }

        if(type === 'STRING') { 
             return {
                type: InputTypes.STRING,
                required: true,
                name: inputName,                
                multiline: properties?.multiline ?? false,
                placeholder: properties?.placeholder ?? ''
            }
        }
    }

    return {
        type: InputTypes.IGNORED,
        required: true,
        name: inputName 
    } 
}

function mapRequiredInputs(required: Input['required'] | undefined) : AnyInputType[] {
    if(!required) {
        return []
    }

    const inputs = Object.keys(required).map((inputKey) => {
        const inputValue = required[inputKey] 
        
        return mapInput(inputKey, inputValue)
    }).filter(Boolean) as AnyInputType[]

    return inputs
}
  

function mapNode(classType: string, entry: ObjectNode): NodeDefinition | undefined {
    const requiredInputs = mapRequiredInputs(entry.input.required) ;
    
    const inputs = requiredInputs;
 
    return {
        class_type: classType,
        inputs 
    }
}

export type NodeDefinitionMap = Map<string, NodeDefinition>

function mapObjectInfo(root: ObjectInfoRoot) : NodeDefinitionMap {
    const nodeNames = Object.keys(root)
  
    const nodeDefinitions = nodeNames.map((nodeName) => {
        const node = root[nodeName];
        const nodeDefinition = mapNode(nodeName, node);
        return nodeDefinition;
    })
    .filter(Boolean) as NodeDefinition[] 

    return new Map<string,  NodeDefinition>(nodeDefinitions.map(x=>[x?.class_type, x]))
}

async function fetchAndMapObjectInfo() { 
    const objectInfo = await fetchObjectInfo()
    return mapObjectInfo(objectInfo)
}


export function useObjectInfo() {
  const { data, error, isLoading } = useQuery<ObjectNode>({
    queryKey: ["object_info"],
    queryFn: fetchObjectInfo,
  });


  return { data, error, isLoading };
}


export function useNodeDefinitions() {
    const { data, error, isLoading } = useQuery<NodeDefinitionMap>({
      queryKey: ["object_info"],
      queryFn: fetchAndMapObjectInfo,
    });  
  
    return { definitions: data, error, isLoading };
  }
  