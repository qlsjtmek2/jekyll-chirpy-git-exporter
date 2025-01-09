// 비교 함수 타입 정의
type EqualsFn<T> = (a: T, b: T) => boolean;

export class UniqueQueue<T> {
  private items: T[];

  // 생성 시, 비교 함수를 인자로 받음
  constructor(private equalsFn: EqualsFn<T>) {
    this.items = [];
  }

  /**
   * 큐에 원소를 추가.
   * 이미 동일한 원소가 존재하면 무시함.
   */
  enqueue(item: T): void {
    // 이미 동일한 아이템이 있는지 확인
    const exists = this.items.some((el) => this.equalsFn(el, item));
    if (!exists) {
      this.items.push(item);
    }
  }

  /**
   * 큐에서 맨 앞 원소를 제거하고 반환.
   * 비어있다면 undefined 반환.
   */
  dequeue(): T | undefined {
    return this.items.shift();
  }

  /**
   * 큐가 비었는지 여부
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * 큐에 들어있는 원소 수
   */
  size(): number {
    return this.items.length;
  }

  /**
   * 내부 배열을 직접 반환(읽기 전용)
   * 필요시 깊은 복사를 해도 됨
   */
  getItems(): readonly T[] {
    return this.items;
  }
}
