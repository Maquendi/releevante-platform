export interface BookCategory {
  id: string;
  title: string;
}

export interface BookImage {
  id: string;
  url: string;
}

export interface BookCopy {
  id: string;
  is_available: boolean;
  at_position: string;
  isbn: string;
}

export interface BookCompartment {
  compartment: string;
<<<<<<< HEAD
=======
}

export interface Isbn {
  value: string;
>>>>>>> 47a6767cd4cf766e210630d935485abe6c0cfde6
}

export interface Isbn {
  value: string;
}

export interface BookItems {
  id: string;
  title: string;
  publisher: string;
  images: BookImage[];
}



export interface BookFilter{
  categoryId:string
  limit?:number
}

export class Book {
  constructor(
    // public id: string,
    private items: BookItems[],
    // private cagories: BookCategory[]
  ) {}
  public numEditions(): number {
    return this.items.length;
  }

  // public isAvailable(): boolean {
  //   return (
  //     this.items
  //       .filter((item) => item.availableLocally)
  //       .reduce((result, item) => result + item.quantity, 0) > 0
  //   );
  // }

  // public isOfCategory(category: BookCategory): boolean {
  //   return this.cagories.indexOf(category) > 0;
  // }
}
