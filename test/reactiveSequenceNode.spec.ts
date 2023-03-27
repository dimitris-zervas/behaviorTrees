import { ControlBaseNode, ReactiveSequenceNode } from '@control_flow_nodes';
import { ActionBaseNode  } from '@execution_nodes';
import { NodeStatus } from '@types';
import { MockActionNode } from './utils';

let child1: ActionBaseNode;
let child2: ActionBaseNode;
let reactiveSequenceNode: ControlBaseNode;

describe("Control Flow Nodes | reactiveSequenceNode", () => {
  beforeEach(() => {
    child1 = new MockActionNode("1");
    child2 = new MockActionNode("2");
    reactiveSequenceNode = new ReactiveSequenceNode([child1, child2]);
  });

  it("should return RUNNING if the first child returns RUNNING", async () => {
    // Mock child1 to return RUNNING
    jest.spyOn(child1, "tick").mockResolvedValueOnce(NodeStatus.Running);

    const status = await reactiveSequenceNode.tick();
    expect(status).toBe(NodeStatus.Running);
  });

  it("should return FAILURE if the first child returns FAILURE", async () => {
    // Mock child1 to return FAILURE
    jest.spyOn(child1, "tick")
      .mockResolvedValueOnce(NodeStatus.Running)
      .mockResolvedValueOnce(NodeStatus.Failure);

    let status = await reactiveSequenceNode.tick();
    expect(status).toBe(NodeStatus.Running);
    status = await reactiveSequenceNode.tick();
    expect(status).toBe(NodeStatus.Failure);
  });

  it("should return FAILURE if the second child returns FAILURE", async () => {
    // Mock child1 to return FAILURE
    jest.spyOn(child1, "tick")
      .mockResolvedValueOnce(NodeStatus.Running)
      .mockResolvedValueOnce(NodeStatus.Success);
    jest.spyOn(child2, "tick")
      .mockResolvedValueOnce(NodeStatus.Running)
      .mockResolvedValueOnce(NodeStatus.Failure);

    let status = await reactiveSequenceNode.tick();
    expect(status).toBe(NodeStatus.Running);
    status = await reactiveSequenceNode.tick();
    expect(status).toBe(NodeStatus.Running);
    status = await reactiveSequenceNode.tick();
    expect(status).toBe(NodeStatus.Failure);
  });

  it("should return RUNNING if the first child returns SUCCESS but the second child returns RUNNING", async () => {
    /** 
     * child 1 Running
     * Child 1 Success - Child 2 Running
     * Child 1 Success - Child 2 Running
     * Child 1 Running - Hault child 2
     */
    
    // Mock child1 to return SUCCESS
    jest.spyOn(child1, "tick")
      .mockResolvedValueOnce(NodeStatus.Running)
      .mockResolvedValueOnce(NodeStatus.Success);
    // Mock child2 to return RUNNING
    jest.spyOn(child2, "tick").mockResolvedValueOnce(NodeStatus.Running);

    let status = await reactiveSequenceNode.tick();
    expect(status).toEqual(NodeStatus.Running);
    status = await reactiveSequenceNode.tick();
    expect(status).toEqual(NodeStatus.Running);
    
    jest.spyOn(child1, "tick").mockResolvedValueOnce(NodeStatus.Running);
    status = await reactiveSequenceNode.tick();
    expect(status).toEqual(NodeStatus.Running);

  });

  it("should return Failure if the second child returns Running but the first child returns FAILURE", async () => {
    /** 
     * child 1 Running
     * Child 1 Success - Child 2 Running
     * Child 1 Success - Child 2 Running
     * Child 1 Failure - Hault child 2
     */
    
    // Mock child1 to return SUCCESS
    jest.spyOn(child1, "tick")
      .mockResolvedValueOnce(NodeStatus.Running)
      .mockResolvedValueOnce(NodeStatus.Success);
    // Mock child2 to return RUNNING
    jest.spyOn(child2, "tick").mockResolvedValueOnce(NodeStatus.Running);

    let status = await reactiveSequenceNode.tick();
    expect(status).toEqual(NodeStatus.Running);
    status = await reactiveSequenceNode.tick();
    expect(status).toEqual(NodeStatus.Running);
    
    jest.spyOn(child1, "tick").mockResolvedValueOnce(NodeStatus.Failure);
    status = await reactiveSequenceNode.tick();
    expect(status).toEqual(NodeStatus.Failure);

  });

  it("should return SUCCESS after both childs return SUCCESS", async () => {
    jest.spyOn(child1, "tick")
      .mockResolvedValueOnce(NodeStatus.Running)
      .mockResolvedValueOnce(NodeStatus.Success);
    // Mock child2 to return RUNNING
    jest.spyOn(child2, "tick")
      .mockResolvedValueOnce(NodeStatus.Running)
      .mockResolvedValueOnce(NodeStatus.Success);

    let status = await reactiveSequenceNode.tick();
    expect(status).toEqual(NodeStatus.Running);
    status = await reactiveSequenceNode.tick();
    expect(status).toEqual(NodeStatus.Running);
    
    status = await reactiveSequenceNode.tick();
    expect(status).toEqual(NodeStatus.Success);

  });

  it("should return READY when the node is halted", async () => {
    // Mock child1 to return SUCCESS
    jest.spyOn(child1, "tick").mockResolvedValueOnce(NodeStatus.Running);

    let status = await reactiveSequenceNode.tick();
    expect(status).toBe(NodeStatus.Running);

    status = await reactiveSequenceNode.halt();
    expect(status).toBe(NodeStatus.Ready);
      
  });

});
