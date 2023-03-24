import { ControlBaseNode } from './ControlBaseNode';
import { NodeStatus } from '../types/nodes';
import { ActionBaseNode } from '@execution_nodes';

export class FallbackNode extends ControlBaseNode {
  private children: ControlBaseNode[] | ActionBaseNode[];
  private activeNodeIdx: number;

  constructor(children: ControlBaseNode[] | ActionBaseNode[]) {
    super();

    this.children = children;
    this.status = NodeStatus.Ready;
    this.activeNodeIdx = 0;

  }

  public async tick(): Promise<NodeStatus> {
    if (this.status === NodeStatus.Ready) {
      this.status = NodeStatus.Running;
    }
  
    return new Promise(async (resolve, reject) => {
      if (this.status === NodeStatus.Success) {
        reject(new Error("You are trying to tick a SequenceNode that has already returned SUCCESS"));
        // TODO: Add here a typed error.
      }
      
      // TODO: Change that when you have a proper logger
      console.log("Fallback Active Node", this.activeNodeIdx);

      // Tick the activeNode
      const childStatus = await this.children[this.activeNodeIdx].tick();
      
      switch (childStatus) {
        case NodeStatus.Running:
          // If a child is RUNNING then the fallback is RUNNING
          this.status = NodeStatus.Running;
          break;
        case NodeStatus.Failure:
          // If a child fails point to the next node
          // If this was the last child then the fallback returns FAILURE
          if (this.activeNodeIdx === this.children.length - 1) {
            this.status = NodeStatus.Failure;
          } else {
            this.activeNodeIdx += 1;
            this.status = NodeStatus.Running;   // TODO: Is there a chance a -child- node returns directly SUCCESS? 
          }
          break;
        case NodeStatus.Success:
          // The first child that returns SUCCESS makes the fallback return SUCCESS
          this.status = NodeStatus.Success;
          break;
      }

      resolve(this.status);

    });
  }

}