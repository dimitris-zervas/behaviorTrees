import { ActionBaseNode } from '@execution_nodes';
import { NodeStatus } from '@types';

export class DummyActionNode extends ActionBaseNode {
  private duration: number;

  constructor(duration: number, id?: string) {
    super(id);

    this.duration = duration;
    this.nodeId = id ? id : this.nodeId;
  }

  public async tick(): Promise<NodeStatus> {
    // console.log("tick on Node ID", this.id);
    if (this.status === NodeStatus.Ready) {
      this.status = NodeStatus.Running;
      this.execute();
    }

    return this.status;
  }

  public execute(): void {
      setTimeout(() => {
        this.status = NodeStatus.Success;
        if (this.nodeId === "node 1") {
          this.status = NodeStatus.Failure;
        }
      }, this.duration);

      // return;
  }
}