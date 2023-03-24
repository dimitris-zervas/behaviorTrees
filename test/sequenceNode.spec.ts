import { ControlBaseNode, SequenceNode } from '@control_flow_nodes';
import { ActionBaseNode  } from '@execution_nodes';
import { NodeStatus } from '@types';
import { MockActionNode } from './utils';

let child1: ActionBaseNode;
let child2: ActionBaseNode;
let sequenceNode: ControlBaseNode;

describe("Control Flow Nodes | SequenceNode", () => {
  beforeEach(() => {
    child1 = new MockActionNode();
    child2 = new MockActionNode();
    sequenceNode = new SequenceNode([child1, child2]);
  });

  it("should return RUNNING if the first child returns RUNNING", async () => {
    // Mock child1 to return RUNNING
    jest.spyOn(child1, "tick").mockResolvedValueOnce(NodeStatus.Running);

    const status = await sequenceNode.tick();
    expect(status).toBe(NodeStatus.Running);
  });

  it("should return FAILURE if the first child returns FAILURE", async () => {
    // Mock child1 to return FAILURE
    jest.spyOn(child1, "tick").mockResolvedValueOnce(NodeStatus.Failure);

    const status = await sequenceNode.tick();
    expect(status).toBe(NodeStatus.Failure);
  });

  it("should return RUNNING if the first child returns SUCCESS but the second child returns RUNNING", async () => {
    // Mock child1 to return SUCCESS
    jest.spyOn(child1, "tick").mockResolvedValueOnce(NodeStatus.Success);
    // Mock child2 to return RUNNING
    jest.spyOn(child2, "tick").mockResolvedValueOnce(NodeStatus.Running);

    let status = await sequenceNode.tick();
    expect(status).toBe(NodeStatus.Running);

    status = await sequenceNode.tick();
    expect(status).toBe(NodeStatus.Running);

  });

  it("should return FAILURE if the second child returns FAILURE", async () => {
    // Mock child1 to return SUCCESS
    jest.spyOn(child1, "tick")
      .mockResolvedValueOnce(NodeStatus.Running)
      .mockResolvedValueOnce(NodeStatus.Success)
    // Mock child2 to return FAILURE
    jest.spyOn(child2, "tick")
      .mockResolvedValueOnce(NodeStatus.Running)
      .mockResolvedValueOnce(NodeStatus.Failure);


    let status = await sequenceNode.tick();
    expect(status).toBe(NodeStatus.Running);
    
    status = await sequenceNode.tick();
    expect(status).toBe(NodeStatus.Running);
    
    status = await sequenceNode.tick();
    expect(status).toBe(NodeStatus.Running);
    
    status = await sequenceNode.tick();
    expect(status).toBe(NodeStatus.Failure);
  });

  it("should return SUCCESS if the second child returns FAILURE", async () => {
    // Mock child1 to return SUCCESS
    jest.spyOn(child1, "tick")
      .mockResolvedValueOnce(NodeStatus.Running)
      .mockResolvedValueOnce(NodeStatus.Success)
    // Mock child2 to return FAILURE
    jest.spyOn(child2, "tick")
      .mockResolvedValueOnce(NodeStatus.Running)
      .mockResolvedValueOnce(NodeStatus.Success);


    let status = await sequenceNode.tick();
    expect(status).toBe(NodeStatus.Running);
    
    status = await sequenceNode.tick();
    expect(status).toBe(NodeStatus.Running);
    
    status = await sequenceNode.tick();
    expect(status).toBe(NodeStatus.Running);
    
    status = await sequenceNode.tick();
    expect(status).toBe(NodeStatus.Success);
  });

  it("should throw an error if you try to tick a node that has already finished", async () => {
    // Mock child1 to return SUCCESS
    jest.spyOn(child1, "tick")
      .mockResolvedValueOnce(NodeStatus.Success)
    // Mock child2 to return FAILURE
    jest.spyOn(child2, "tick")
      .mockResolvedValueOnce(NodeStatus.Success);

    let status = await sequenceNode.tick();
    expect(status).toBe(NodeStatus.Running);
    
    status = await sequenceNode.tick();
    expect(status).toBe(NodeStatus.Success);

    await sequenceNode.tick().catch(err => {
      expect(err.message).toEqual("You are trying to tick a SequenceNode that has already returned SUCCESS");
    });
  });

});
