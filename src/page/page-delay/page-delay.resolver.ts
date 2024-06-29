export class PageDelayResolver {
  private readonly base: number;
  private readonly randomMax: number;

  constructor(delayBetweenRequests: [number, number]) {
    this.base = delayBetweenRequests[0];
    this.randomMax = delayBetweenRequests[1];
  }

  public resolve(): number {
    return this.base + Math.floor(Math.random() * this.randomMax);
  }
}
