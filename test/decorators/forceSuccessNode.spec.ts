import { ForceSuccessNode } from '@control_flow_nodes';
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

describe("Control Flow Nodes | Decorators | ForceSuccessNode", () => {
  it("should return RUNNING if the child returns RUNNING", async () => {
    const child = new MockActionNode();
    const forceSuccessNode = new ForceSuccessNode(child);

    // Mock child to return RUNNING
    jest.spyOn(child, "tick").mockResolvedValueOnce(NodeStatus.Running);

    const status = await forceSuccessNode.tick();
    expect(status).toBe(NodeStatus.Running);
  });

  it("should return SUCCESS if the child returns SUCCESS", async () => {
    const child = new MockActionNode();
    const forceSuccessNode = new ForceSuccessNode(child);

    // Mock child to return SUCCESS
    jest.spyOn(child, "tick").mockResolvedValueOnce(NodeStatus.Success);

    const status = await forceSuccessNode.tick();
    expect(status).toBe(NodeStatus.Success);
  });

  it("should return SUCCESS if the child returns FAILURE", async () => {
    const child = new MockActionNode();
    const forceSuccessNode = new ForceSuccessNode(child);

    // Mock child to return FAILURE
    jest.spyOn(child, "tick").mockResolvedValueOnce(NodeStatus.Failure);

    const status = await forceSuccessNode.tick();
    expect(status).toBe(NodeStatus.Success);
  });

  it("should throw an error if the parent node has already returned SUCCESS", async () => {
    const child = new MockActionNode();
    const forceSuccessNode = new ForceSuccessNode(child);

    // Mock child to return SUCCESS
    jest.spyOn(child, "tick").mockResolvedValueOnce(NodeStatus.Success);

    await forceSuccessNode.tick();  // This will make forceFailureNode.status = NodeStatus.Success

    expect(async () => {
      await forceSuccessNode.tick();
    }).rejects.toThrowError("You are trying to tick a ForceSuccessNode that has already returned SUCCESS/FAILURE");
  });
});