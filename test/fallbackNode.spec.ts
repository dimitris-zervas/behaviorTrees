import { ControlBaseNode, FallbackNode } from '@control_flow_nodes';
import { ActionBaseNode } from '@execution_nodes';
import { NodeStatus } from '@types';

// Mock ActionBaseNode
class MockActionNode extends ActionBaseNode {
  public async tick(): Promise<NodeStatus> {
    return NodeStatus.Success;
  }

  public execute() {
    return;
  }
}

let child1: ActionBaseNode;
let child2: ActionBaseNode;
let fallbackNode: ControlBaseNode;

describe("Control Flow Nodes | FallbackNode", () => {
  beforeEach(() => {
    child1 = new MockActionNode();
    child2 = new MockActionNode();
    fallbackNode = new FallbackNode([child1, child2]);
  });

  it("should return SUCCESS if the first child returns SUCCESS", async () => {
    // Mock child1 to return SUCCESS
    jest.spyOn(child1, "tick").mockResolvedValueOnce(NodeStatus.Success);

    const status = await fallbackNode.tick();
    expect(status).toBe(NodeStatus.Success);
  });

  it("should return RUNNING if the first child returns RUNNING", async () => {
    // Mock child1 to return RUNNING
    jest.spyOn(child1, "tick").mockResolvedValueOnce(NodeStatus.Running);

    const status = await fallbackNode.tick();
    expect(status).toBe(NodeStatus.Running);
  });

  it("should return SUCCESS if the first child FAILS but the second child returns SUCCESS", async () => {
    // Mock child1 to return FAILURE
    jest.spyOn(child1, "tick")
      .mockResolvedValueOnce(NodeStatus.Running)
      .mockResolvedValueOnce(NodeStatus.Failure);
    // Mock child2 to return first RUNINNG and then SUCCESS
    jest.spyOn(child2, "tick")
      .mockResolvedValueOnce(NodeStatus.Running)
      .mockResolvedValueOnce(NodeStatus.Success);

    let status = await fallbackNode.tick();
    expect(status).toBe(NodeStatus.Running);
    
    status = await fallbackNode.tick();
    expect(status).toBe(NodeStatus.Running); // child1 failed here

    status = await fallbackNode.tick();
    expect(status).toBe(NodeStatus.Running); // child2 starts running here

    status = await fallbackNode.tick();
    expect(status).toBe(NodeStatus.Success); // child2 returns success here - fallbackNode returns success
  });

  it("should return FAILS if the first child FAILS and the second child FAILS", async () => {
    // Mock child1 to return FAILURE
    jest.spyOn(child1, "tick")
      .mockResolvedValueOnce(NodeStatus.Running)
      .mockResolvedValueOnce(NodeStatus.Failure);
    // Mock child2 to return first RUNINNG and then SUCCESS
    jest.spyOn(child2, "tick")
      .mockResolvedValueOnce(NodeStatus.Running)
      .mockResolvedValueOnce(NodeStatus.Failure);

    let status = await fallbackNode.tick();
    expect(status).toBe(NodeStatus.Running);
    
    status = await fallbackNode.tick();
    expect(status).toBe(NodeStatus.Running); // child1 failed here

    status = await fallbackNode.tick();
    expect(status).toBe(NodeStatus.Running); // child2 starts running here

    status = await fallbackNode.tick();
    expect(status).toBe(NodeStatus.Failure); // child2 returns success here - fallbackNode returns success
  });


});