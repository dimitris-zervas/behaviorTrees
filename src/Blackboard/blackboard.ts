
export class Blackboard {
  
  private data: Record<string, any>;

  constructor() {
    this.data = {};
  }

  public set(key: string, value: any): void {
    this.data[key] = value;
  }

  public get(key: string): any {
    return this.data[key];
  }

  public has(key: string): boolean {
    return key in this.data;
  }

  public remove(key: string): void {
    delete this.data[key];
  }

  public clear(): void {
    this.data = {};
  }
}


