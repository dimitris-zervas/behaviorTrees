import { ForceSuccessNode } from '@control_flow_nodes';
import { NodeStatus } from '@types';
import { MockActionNode } from '../utils';

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

  it("should return READY when the node is halted", async () => {
    const child = new MockActionNode();
    const forceFailureNode = new ForceSuccessNode(child);

    const status = await forceFailureNode.halt();
    expect(status).toBe(NodeStatus.Ready);
  });
});