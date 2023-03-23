import { RetryNode } from '@control_flow_nodes';
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

const maxRetries = 2;

describe("Control Flow Nodes | Decorators | RetryNode", () => {
  it("should return RUNNING if the child returns RUNNING", async () => {
    const child = new MockActionNode();
    const retryNode = new RetryNode(child, maxRetries);

    // Mock child to return RUNNING
    jest.spyOn(child, "tick").mockResolvedValueOnce(NodeStatus.Running);

    const status = await retryNode.tick();
    expect(status).toBe(NodeStatus.Running);
  });

  it("should return SUCCESS if the child returns SUCCESS", async () => {
    const child = new MockActionNode();
    const retryNode = new RetryNode(child, maxRetries);

    // Mock child to return FAILURE
    jest.spyOn(child, "tick").mockResolvedValueOnce(NodeStatus.Success);

    const status = await retryNode.tick();
    expect(status).toBe(NodeStatus.Success);
  });

  it("should return RUNNING if the child returns FAILURES and maxRetries is not reached", async () => {
    const child = new MockActionNode();
    const retryNode = new RetryNode(child, maxRetries);

    // Mock child to return SUCCESS
    jest.spyOn(child, "tick").mockResolvedValueOnce(NodeStatus.Failure);

    const status = await retryNode.tick();
    expect(status).toBe(NodeStatus.Running);
  });


});

const required = {
  calendar: {
    availableSteps: [
      "Step1Id", "Step2Id", "Step3Id", "Step4Id"
    ]
  },
  user: {
    availableSteps: [
      "Step1Id", "Step2Id", "Step3Id",
    ]
  }
}