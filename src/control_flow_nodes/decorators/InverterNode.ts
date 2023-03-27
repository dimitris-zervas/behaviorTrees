import { ActionBaseNode } from '@execution_nodes';
import { ControlBaseNode } from '@control_flow_nodes';
import { NodeStatus } from '@types';

export class InverterNode extends ControlBaseNode {
  private child: ActionBaseNode;

  constructor(child: ActionBaseNode) {
    super();

    this.child = child;
    this.status = NodeStatus.Ready;
  }

  public async tick(): Promise<NodeStatus> {

    // Tick the child
    const childStatus = await this.child.tick();
    switch (childStatus) {
      case NodeStatus.Running:
        // If the child returns RUNNING, this node returns RUNNING too.
        this.status = NodeStatus.Running;
        break;
      case NodeStatus.Failure:
        // If the child returns FAILURE, this node returns SUCCESS.
        this.status = NodeStatus.Success;
        break;
      case NodeStatus.Success:
        // If the child returns SUCCESS, this node returns FAILURE.
        this.status = NodeStatus.Failure;
        break;
    }

    return this.status;
  }

  public async halt(): Promise<any> {
    await this.child.halt();
    // TODO: More checks here to ensure child's halt?
    this.status = NodeStatus.Ready;
    return this.status;
  }
}
