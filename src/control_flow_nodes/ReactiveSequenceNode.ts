import { ControlBaseNode } from '@control_flow_nodes';
import { ActionBaseNode } from '@execution_nodes';
import { NodeStatus } from '@types';

export class ReactiveSequenceNode extends ControlBaseNode {
  private children: ControlBaseNode[] | ActionBaseNode[];
  private hasRunningChild: boolean = false;
  private runningNode: number;
  
  constructor(children: ControlBaseNode[] | ActionBaseNode[]) {
    super();
    this.children = children;
    this.runningNode = 0;
  }

  /**
   * The ReactiveSequenceNode ticks its children in sequence without wating for a tick from the parent node.
   * A ReactiveSequenceNode, on every Parent tick, will tick all the children with the following rules:
   * 1. The first child that returns RUNNING will stop the ticking and will retrun RUNNING to the parent.
   * 2. If a children return SUCCESS, the ReactiveSequenceNode will tick immediately the next child 
   * (it will not wait for the next parent tick).
   * 3. If a child returns FAILURE, the ReactiveSequenceNode will return FAILURE to the parent.
   * 4 If all the children return SUCCESS, the ReactiveSequenceNode will return SUCCESS to the parent.
   * @returns NodeStatus
   */
  public async tick(): Promise<NodeStatus> {
    if (this.status === NodeStatus.Ready) {
      this.status = NodeStatus.Running;
    }

    console.log("------- TICK -------");

    return new Promise(async (resolve, reject) => {

      // Process children in sequence until one returns FAILURE or all have returned SUCCESS
      for (let childIdx = 0; childIdx < this.children.length; childIdx++) {
      // for (const {idx, child} of this.children) {
        const childStatus = await this.children[childIdx].tick();
        if (childStatus === NodeStatus.Running) {
          console.log("running: ", childIdx);
          this.hasRunningChild = true;
          this.runningNode = childIdx;
          break;
        } else if (childStatus === NodeStatus.Failure) {
          this.status = NodeStatus.Failure;
          console.log("failure: ", childIdx);
          // Hault the running node!
          // TODO: 
          console.log("Resolving failure");
          resolve(this.status);
          return;
        } else if (childStatus === NodeStatus.Success) {
          console.log("success: ", childIdx);
          if (childIdx === this.children.length - 1) {
            console.log("Resolving: ReactiveSequenceNode Success");
            this.hasRunningChild = false;
          }
          // On success, tick directly the next child.
          // pass - the loop will handle the tick.
        }
      }

      // If a child returned RUNNING, set the sequence status to RUNNING and resolve
      if (this.hasRunningChild) {
        this.status = NodeStatus.Running;
        console.log("Resolving running");
        resolve(this.status);
        return;
      }

      // All children returned SUCCESS, set the overall status to SUCCESS and resolve
      this.status = NodeStatus.Success;
      resolve(this.status);
    });
  }

  // private async haultRunningNode(children: ControlBaseNode[] | ActionBaseNode[]): Promise<void> {
  //   for (const child of children) {
  //     // await child.hault();
  //   }
  // }
}