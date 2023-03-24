import { RetryNode } from '@control_flow_nodes';
import { ActionBaseNode } from '@execution_nodes';
import { NodeStatus } from '@types';
import { MockActionNode } from '../utils';


let child: ActionBaseNode;
let retryNode: RetryNode;
const maxRetries = 2;

describe("Control Flow Nodes | Decorators | RetryNode", () => {
  beforeEach(() => {
    child = new MockActionNode();
    retryNode = new RetryNode(child, maxRetries);
  });

  it("should return RUNNING if the child returns RUNNING", async () => {
    // Mock child to return RUNNING
    jest.spyOn(child, "tick").mockResolvedValueOnce(NodeStatus.Running);

    const status = await retryNode.tick();
    expect(status).toBe(NodeStatus.Running);
  });

  it("should return SUCCESS if the child returns SUCCESS", async () => {
    // Mock child to return FAILURE
    jest.spyOn(child, "tick").mockResolvedValueOnce(NodeStatus.Success);

    const status = await retryNode.tick();
    expect(status).toBe(NodeStatus.Success);
  });

  it("should return RUNNING if the child returns FAILURES and maxRetries is not reached", async () => {
    // Mock child to return SUCCESS
    jest.spyOn(child, "tick").mockResolvedValueOnce(NodeStatus.Failure);

    const status = await retryNode.tick();
    expect(status).toBe(NodeStatus.Running);
  });

  it("should throw an error if you try to tick a node that has already finished", async () => {
    // Mock child to return SUCCESS
    jest.spyOn(child, "tick").mockResolvedValueOnce(NodeStatus.Success);

    let status = await retryNode.tick();
    expect(status).toBe(NodeStatus.Success);

    await retryNode.tick().catch(err => {
      expect(err.message).toBe("You are trying to tick a RetryNode that has already returned SUCCESS/FAILURE");
    });
  });

  it("should return FAILURE if the child returns FAILURES and maxRetries is reached", async () => {
    // Mock child to return SUCCESS
    jest.spyOn(child, "tick")
      .mockResolvedValueOnce(NodeStatus.Failure)
      .mockResolvedValueOnce(NodeStatus.Failure)
      .mockResolvedValueOnce(NodeStatus.Failure);

    let status = await retryNode.tick();
    expect(status).toBe(NodeStatus.Running);

    status = await retryNode.tick();
    expect(status).toBe(NodeStatus.Running);

    status = await retryNode.tick();
    expect(status).toBe(NodeStatus.Failure);
  });


});