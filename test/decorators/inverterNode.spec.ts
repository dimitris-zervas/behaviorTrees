import { InverterNode } from '@control_flow_nodes';
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

describe("Control Flow Nodes | Decorators | InverterNode", () => {
  it("should return RUNNING if the child returns RUNNING", async () => {
    const child = new MockActionNode();
    const inverterNode = new InverterNode(child);

    // Mock child to return RUNNING
    jest.spyOn(child, "tick").mockResolvedValueOnce(NodeStatus.Running);

    const status = await inverterNode.tick();
    expect(status).toBe(NodeStatus.Running);
  });

  it("should return SUCCESS if the child returns FAILURE", async () => {
    const child = new MockActionNode();
    const inverterNode = new InverterNode(child);

    // Mock child to return FAILURE
    jest.spyOn(child, "tick").mockResolvedValueOnce(NodeStatus.Failure);

    const status = await inverterNode.tick();
    expect(status).toBe(NodeStatus.Success);
  });

  it("should return FAILURE if the child returns SUCCESS", async () => {
    const child = new MockActionNode();
    const inverterNode = new InverterNode(child);

    // Mock child to return SUCCESS
    jest.spyOn(child, "tick").mockResolvedValueOnce(NodeStatus.Success);

    const status = await inverterNode.tick();
    expect(status).toBe(NodeStatus.Failure);
  });
});