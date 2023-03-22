import { ControlBaseNode } from './ControlBaseNode';
import { NodeStatus } from '../types/nodes';
import { ActionBaseNode } from '@execution_nodes';

export class FallbackNode extends ControlBaseNode {
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
      let hasSucceededChild = false;
      let activeNode: string = this.children[0].nodeId;
      
      // Process children in sequence until one returns SUCCESS or all have returned FAILURE
      for (const child of this.children) {
        const childStatus = await child.tick();
        if (childStatus === NodeStatus.Running) {
          activeNode = child.nodeId;
          console.log("Running node: ", activeNode);
          break;
        } else if (childStatus === NodeStatus.Success) {
          hasSucceededChild = true;
          break;
        }
      }
      
      // If a child returned SUCCESS, set the overall status to SUCCESS and resolve
      if (hasSucceededChild) {
        this.status = NodeStatus.Success;
        resolve(this.status);
        return;
      }
      
      // All children returned FAILURE, set the overall status to FAILURE and resolve
      if (activeNode === this.children[this.children.length - 1].nodeId) {
        this.status = NodeStatus.Failure;
        reject(this.status);
      }
    });
  }

}