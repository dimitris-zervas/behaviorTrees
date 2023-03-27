// import { ControlBaseNode } from "./ControlBaseNode";
// import { NodeStatus } from "@types";
// import { ActionBaseNode } from "@execution_nodes";

// export class ParallelNode extends ControlBaseNode {
//   private children: ControlBaseNode[] | ActionBaseNode[];

//   constructor(children: ControlBaseNode[] | ActionBaseNode[]) {
//     super();

//     this.children = children;
//     this.status = NodeStatus.Ready;
    
//   }

//   public async tick(): Promise<NodeStatus> {
//     if (this.status === NodeStatus.Ready) {
//       this.status = NodeStatus.Running;
//     }
    
//     return new Promise(async (resolve, reject) => {
//       // Promise.race([...this.children.])
//     })
  
//   }

// }