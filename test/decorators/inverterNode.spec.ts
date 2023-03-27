import { InverterNode } from '@control_flow_nodes';
import { NodeStatus } from '@types';
import { MockActionNode } from '../utils';

let child: MockActionNode;
let inverterNode: InverterNode;

describe("Control Flow Nodes | Decorators | InverterNode", () => {
  beforeEach(() => {
    child = new MockActionNode();
    inverterNode = new InverterNode(child);
  });

  it("should return RUNNING if the child returns RUNNING", async () => {

    // Mock child to return RUNNING
    jest.spyOn(child, "tick").mockResolvedValueOnce(NodeStatus.Running);

    const status = await inverterNode.tick();
    expect(status).toBe(NodeStatus.Running);
  });

  it("should return SUCCESS if the child returns FAILURE", async () => {
    // Mock child to return FAILURE
    jest.spyOn(child, "tick").mockResolvedValueOnce(NodeStatus.Failure);

    const status = await inverterNode.tick();
    expect(status).toBe(NodeStatus.Success);
  });

  it("should return FAILURE if the child returns SUCCESS", async () => {
    // Mock child to return SUCCESS
    jest.spyOn(child, "tick").mockResolvedValueOnce(NodeStatus.Success);

    const status = await inverterNode.tick();
    expect(status).toBe(NodeStatus.Failure);
  });

  it("should return READY when the node is halted", async () => {
    const status = await inverterNode.halt();
    expect(status).toBe(NodeStatus.Ready);
  });

});