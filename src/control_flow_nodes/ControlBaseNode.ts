import { NodeStatus } from '../types/nodes';
import { v4 as uuid } from 'uuid';

export abstract class ControlBaseNode {
  public status: NodeStatus;
  public nodeId: string = uuid();
  
  public abstract tick(): Promise<NodeStatus>;
  
  constructor(id?: string) {
    this.status = NodeStatus.Ready;
  }

}
