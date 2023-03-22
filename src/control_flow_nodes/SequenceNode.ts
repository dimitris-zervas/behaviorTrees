import { ControlBaseNode } from './ControlBaseNode';
import { NodeStatus } from '../types/nodes';
import { ActionBaseNode } from '@execution_nodes';

export class SequenceNode extends ControlBaseNode {
  private children: ControlBaseNode[] | ActionBaseNode[];

  constructor(children: ControlBaseNode[]) {
    super();

    this.children = children;
    this.status = NodeStatus.Ready;

  }

  public async tick(): Promise<NodeStatus> {
    if (this.status === NodeStatus.Ready) {
      this.status = NodeStatus.Running;
    }
  
    return new Promise(async (resolve, reject) => {
      let hasRunningChild = false;
      let activeNode: string = this.children[0].nodeId;
      
      // Process children in sequence until one returns FAILURE or all have returned SUCCESS
      for (const child of this.children) {
        const childStatus = await child.tick();
        if (childStatus === NodeStatus.Running) {
          hasRunningChild = true;
          activeNode = child.nodeId;
          console.log("Running node: ", activeNode);
          break;
        } else if (childStatus === NodeStatus.Failure) {
          this.status = NodeStatus.Failure;
          reject(this.status);
          return;
        }
      }
      
      // If a child returned RUNNING, set the overall status to RUNNING and resolve
      if (hasRunningChild) {
        this.status = NodeStatus.Running;
        resolve(this.status);
        return;
      }
      
      // All children returned SUCCESS, set the overall status to SUCCESS and resolve
      this.status = NodeStatus.Success;
      resolve(this.status);
    });
  }

}