export interface  Product {
    id: string;
    name: string;
    description: string;
    image_url: string;
    slug: string;
    price: number;
    created_at: string;
}


export const products: Product[] = [
    {
      id: 'uuid',
      name: 'produto teste',
      description: "muito muito texto",
      price: 50.50,
      image_url: 'https://source.unsplash.com/random?product',
      slug: 'produto-teste',
      created_at: '2021-06-06T00:00:00'
    },
    {
        id: 'uuid2',
        name: 'produto teste 2',
        description: "muito muito texto",
        price: 60.50,
        image_url: 'https://source.unsplash.com/random?product2',
        slug: 'produto-teste2',
        created_at: '2021-06-06T00:00:00'
    }
]