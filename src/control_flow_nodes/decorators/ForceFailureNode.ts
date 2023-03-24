// If the child returns RUNNING, this node returns RUNNING too.

import { ActionBaseNode } from "@execution_nodes";
import { ControlBaseNode } from "@control_flow_nodes";
import { NodeStatus } from "@types";

// Otherwise, it returns always SUCCESS.

export class ForceFailureNode extends ControlBaseNode {
  private child: ActionBaseNode;

  constructor(child: ActionBaseNode) {
    super();

    this.child = child;
    this.status = NodeStatus.Ready;
  }

  public async tick(): Promise<NodeStatus> {
    if (this.status === NodeStatus.Failure) {
      throw new Error("You are trying to tick a ForceFailureNode that has already returned FAILURE");
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
        this.status = NodeStatus.Failure;
        break;
      case NodeStatus.Success:
        this.status = NodeStatus.Failure;
        break;
    }
    
    return this.status;

  }
}