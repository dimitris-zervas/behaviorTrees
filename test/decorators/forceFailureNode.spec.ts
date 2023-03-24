import { ForceFailureNode } from '@control_flow_nodes';
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

describe("Control Flow Nodes | Decorators | ForceFailureNode", () => {
  it("should return RUNNING if the child returns RUNNING", async () => {
    const child = new MockActionNode();
    const forceFailureNode = new ForceFailureNode(child);

    // Mock child to return RUNNING
    jest.spyOn(child, "tick").mockResolvedValueOnce(NodeStatus.Running);

    const status = await forceFailureNode.tick();
    expect(status).toBe(NodeStatus.Running);
  });

  it("should return FAILURE if the child returns SUCCESS", async () => {
    const child = new MockActionNode();
    const forceFailureNode = new ForceFailureNode(child);

    // Mock child to return SUCCESS
    jest.spyOn(child, "tick").mockResolvedValueOnce(NodeStatus.Success);

    const status = await forceFailureNode.tick();
    expect(status).toBe(NodeStatus.Failure);
  });

  it("should return FAILURE if the child returns FAILURE", async () => {
    const child = new MockActionNode();
    const forceFailureNode = new ForceFailureNode(child);

    // Mock child to return FAILURE
    jest.spyOn(child, "tick").mockResolvedValueOnce(NodeStatus.Failure);

    const status = await forceFailureNode.tick();
    expect(status).toBe(NodeStatus.Failure);
  });

  it("should throw an error if the parent node has already returned SUCCESS", async () => {
    const child = new MockActionNode();
    const forceFailureNode = new ForceFailureNode(child);

    // Mock child to return SUCCESS
    jest.spyOn(child, "tick").mockResolvedValueOnce(NodeStatus.Success);

    await forceFailureNode.tick();  // This will make forceFailureNode.status = NodeStatus.Failure

    expect(async () => {
      await forceFailureNode.tick();
    }).rejects.toThrowError("You are trying to tick a ForceFailureNode that has already returned FAILURE");
  });
});