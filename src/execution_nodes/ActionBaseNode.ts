import { NodeStatus } from '../types/nodes';
import { v4 as uuid } from 'uuid';

export abstract class ActionBaseNode {
  public status: NodeStatus;
  public nodeId: string = uuid();
  
  public abstract tick(): Promise<NodeStatus>;

  public abstract execute(): any;

  public abstract halt(): Promise<any>;

  constructor(id?: string) {
    this.status = NodeStatus.Ready;
  }
}
