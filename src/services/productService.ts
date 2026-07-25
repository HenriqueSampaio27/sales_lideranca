import { baseUrl } from "./AuthService";
import { Product, ApiResponse } from "../types/product";
import { apiRequest } from "./apiClient";

export const getProducts = async (): Promise<Product[]> => {
  const response: Response = await fetch(`${baseUrl}/product`);

  if (!response.ok) {
    throw new Error("Erro ao buscar produtos");
  }

  const data: Product[] = await response.json();
  return data;
};

export const createProduct = async (formData: FormData): Promise<ApiResponse> => {
  const response: Response = await fetch(`${baseUrl}/product`, {
    method: "POST",
    body: formData,
  });

  const data: ApiResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erro ao salvar produto");
  }

  return data;
};

export const updateProduct = async (
  id: string,
  formData: FormData
): Promise<ApiResponse> => {
  const response: Response = await fetch(`${baseUrl}/product/${id}`, {
    method: "PUT",
    body: formData,
  });

  const data: ApiResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erro ao salvar produto");
  }

  return data;
};

export const deleteProduct = async (id: string): Promise<ApiResponse> => {
  const response: Response = await fetch(`${baseUrl}/product/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const data: ApiResponse = await response.json().catch(() => ({}));
    throw new Error(data.message || "Erro ao excluir produto");
  }

  return response.json().catch(() => ({ message: "Produto excluído com sucesso" }));
};

export const toggleProductStatus = async (
  id: string,
  active: boolean
): Promise<ApiResponse> => {
  const response: Response = await fetch(`${baseUrl}/product/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ active }),
  });

  if (!response.ok) {
    const fallbackResponse: Response = await fetch(`${baseUrl}/product/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ active }),
    });

    if (!fallbackResponse.ok) {
      const errorData: ApiResponse = await fallbackResponse
        .json()
        .catch(() => ({}));
      throw new Error(errorData.message || "Erro ao alterar status do produto");
    }

    return fallbackResponse.json();
  }

  return response.json();
};

export const updateProductStatus = toggleProductStatus;

export class ProductService {
  static async fetchProducts(): Promise<Product[]> {
    const data = await apiRequest<Product[]>("/product");
    const activeProducts = data.filter((p) => p.active);
    return activeProducts.sort((a, b) =>
      a.product_name.localeCompare(b.product_name)
    );
  }

  static async searchProductByBarcode(barcode: string): Promise<Product | null> {
    const data = await apiRequest<Product[]>("/product");
    const found = data.find((p) => p.barcode === barcode);
    return found || null;
  }
}