import { ControlBaseNode } from '@control_flow_nodes';
import { ActionBaseNode } from '@execution_nodes';

export enum NodeStatus {
  Ready,
  Running,
  Success,
  Failure,
}

export type Node = ActionBaseNode | ControlBaseNode;