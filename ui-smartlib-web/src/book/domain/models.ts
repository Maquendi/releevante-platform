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
  status: "sold" | "borrowed" | "lost" | "available" | "InCart";
  is_available: boolean
}

export interface BookCompartment{
  id: string
  compartment: string
}

export interface BookEdition {
  id: string;
  title: string;
  publisher: string;
  unitPrice: number;
  quantity: number;
  images: BookImage[];
  availableLocally: boolean;
  bookId: string;
}

export class Book {
  constructor(
    public id: string,
    private editions: BookEdition[],
    private cagories: BookCategory[]
  ) {}
  public numEditions(): number {
    return this.editions.length;
  }

  public isAvailable(): boolean {
    return (
      this.editions
        .filter((item) => item.availableLocally)
        .reduce((result, item) => result + item.quantity, 0) > 0
    );
  }

  public isOfCategory(category: BookCategory): boolean {
    return this.cagories.indexOf(category) > 0;
  }
}
