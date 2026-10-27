export type ProductCategory = {
  id: string;
  slug: string;
  name: string;
  image: string;
  description: string;
  featured?: boolean;
}

export const productCategories: ProductCategory[] = [
  {
    id: "1",
    slug: "paper-boxes",
    name: "Paper Boxes",
    image: "https://images.unsplash.com/photo-1546554137-f86b9593a222?w=1000&q=80",
    description: "Custom rigid and folding paper boxes for premium products."
  },
  {
    id: "2",
    slug: "gift-boxes",
    name: "Gift Boxes",
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=1000&q=80",
    description: "Elegant gift boxes with custom finishes and inserts."
  },
  {
    id: "3",
    slug: "paper-bags",
    name: "Paper Bags",
    image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1000&q=80",
    description: "Durable custom paper shopping bags with handles."
  },
  {
    id: "4",
    slug: "folding-cartons",
    name: "Folding Cartons",
    image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=1000&q=80",
    description: "Versatile folding cartons for retail packaging."
  },
  {
    id: "5",
    slug: "food-packaging",
    name: "Food Packaging",
    image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1000&q=80",
    description: "Food-safe custom packaging solutions."
  },
  {
    id: "6",
    slug: "labels-sleeves",
    name: "Labels & Sleeves",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1000&q=80",
    description: "Custom labels, wraps and sleeve packaging."
  },
  {
    id: "7",
    slug: "other-custom-packaging",
    name: "Other Custom Packaging",
    image: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=1000&q=80",
    description: "Bespoke packaging solutions tailored to your needs."
  }
]
