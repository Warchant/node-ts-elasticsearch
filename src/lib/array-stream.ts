import { Readable } from 'stream';

export class ArrayStream extends Readable {
  constructor(source: any[]) {
    super({ objectMode: true });
    this.source = source.slice();
  }
  private source: any[] | null;

  _read(size: number): void {
    if (this.source) {
      // @ts-ignore
      for (const source of this.source) {
        this.push(source);
      }
      this.push(null);
      this.source = null;
    }
  }
}
