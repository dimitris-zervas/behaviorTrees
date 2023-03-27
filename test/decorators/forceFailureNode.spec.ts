import { ForceFailureNode } from '@control_flow_nodes';
import { NodeStatus } from '@types';
import { MockActionNode } from '../utils';


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

  it("should return READY when the node is halted", async () => {
    const child = new MockActionNode();
    const forceFailureNode = new ForceFailureNode(child);

    const status = await forceFailureNode.halt();
    expect(status).toBe(NodeStatus.Ready);
  });
});