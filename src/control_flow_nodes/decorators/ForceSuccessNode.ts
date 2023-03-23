// If the child returns RUNNING, this node returns RUNNING too.

import { ActionBaseNode } from "@execution_nodes";
import { ControlBaseNode } from "@control_flow_nodes";
import { NodeStatus } from "@types";

// Otherwise, it returns always SUCCESS.

export class ForceSuccessNode extends ControlBaseNode {
  private child: ActionBaseNode;

  constructor(child: ActionBaseNode) {
    super();

    this.child = child;
    this.status = NodeStatus.Ready;
  }

  public async tick(): Promise<NodeStatus> {
    if (this.status === NodeStatus.Success || this.status === NodeStatus.Failure) {
      throw new Error("You are trying to tick a ForceSuccessNode that has already returned SUCCESS/FAILURE");
      // TODO: Add here a typed error.
    }

    // Tick the child
    const childStatus = await this.child.tick();
    switch (childStatus) {
      case NodeStatus.Running:
        // If the child returns RUNNING, this node returns RUNNING too.
        this.status = NodeStatus.Running;
        break;
      case NodeStatus.Failure:
        this.status = NodeStatus.Success;
        break;
      case NodeStatus.Success:
        this.status = NodeStatus.Success;
        break;
    }
    
    return this.status;

  }
}