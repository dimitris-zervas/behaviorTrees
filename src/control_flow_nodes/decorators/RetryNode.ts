import { ControlBaseNode } from '@control_flow_nodes';
import { ActionBaseNode } from '@execution_nodes';
import { NodeStatus } from '@types';

export class RetryNode extends ControlBaseNode {
  private child: ActionBaseNode;
  private maxRetries: number;
  private retries: number;

  constructor(child: ActionBaseNode, maxRetries: number) {
    super();

    this.child = child;
    this.maxRetries = maxRetries;
    this.retries = 0;
    this.status = NodeStatus.Ready;
  }

  public async tick(): Promise<NodeStatus> {
    if (this.status === NodeStatus.Success) {
      throw new Error("You are trying to tick a RetryNode that has already returned SUCCESS/FAILURE");
      // TODO: Add here a typed error.
    }

    // Tick the child
    const childStatus = await this.child.tick();
    switch (childStatus) {
      case NodeStatus.Running:
        this.status = NodeStatus.Running;
        break;
      case NodeStatus.Success:
        this.status = NodeStatus.Success;
        break;
      case NodeStatus.Failure:
        if (this.retries < this.maxRetries ) {
          this.retries++;
          this.status = NodeStatus.Running;
        } else {
          this.status = NodeStatus.Failure;
        }
        break;
    }

    return this.status;
  }
}