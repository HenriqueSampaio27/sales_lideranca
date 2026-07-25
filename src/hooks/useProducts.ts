import { useState, useCallback } from "react";
import { Product } from "../types";
import { ProductService } from "../services/productService";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const sorted = await ProductService.fetchProducts();
      setProducts(sorted);
      setFilteredProducts(sorted);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
    }
  }, []);

  const searchProductByBarcode = useCallback(
    async (barcode: string, onFound: (product: Product) => void) => {
      try {
        const found = await ProductService.searchProductByBarcode(barcode);
        if (found) {
          onFound(found);
        } else {
          alert("Produto não encontrado");
        }
      } catch (err) {
        console.error("Erro ao buscar produto por código de barras:", err);
      }
    },
    []
  );

  const filterProducts = useCallback(
    (query: string) => {
      const value = query.toLowerCase();
      if (!value) {
        setFilteredProducts(products);
        return;
      }
      const filtered = products.filter(
        (p) =>
          p.product_name.toLowerCase().includes(value) ||
          p.barcode.includes(value)
      );
      setFilteredProducts(filtered);
    },
    [products]
  );

  return {
    products,
    filteredProducts,
    searchProduct,
    setSearchProduct,
    isProductModalOpen,
    setIsProductModalOpen,
    fetchProducts,
    searchProductByBarcode,
    filterProducts,
  };
}
