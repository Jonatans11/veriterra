// ---------------------------------------------------------------------------
// Veriterra.AI — Barcode / Photo Scanner Integration
// ---------------------------------------------------------------------------
// Integrates with Open Food Facts API and provides a unified interface
// for identifying products from barcodes or photos. Returns product data
// that can be linked to research reports.
// ---------------------------------------------------------------------------

import type { Product, Brand, Category } from "./types.js";

// ── Open Food Facts API constants ──────────────────────────────────────────
const OFF_API_BASE = "https://world.openfoodfacts.org/api/v2";

// ── Public interfaces ──────────────────────────────────────────────────────

export interface BarcodeScanResult {
  success: boolean;
  product?: {
    barcode: string;
    name: string;
    brand: string;
    category: string;
    imageUrl?: string;
    description?: string;
    servingSize?: string;
    ingredients?: string[];
  };
  rawData?: Record<string, unknown>;
  error?: string;
}

export interface PhotoScanResult {
  success: boolean;
  barcode?: string;
  product?: BarcodeScanResult["product"];
  error?: string;
}

// ── Barcode lookup ─────────────────────────────────────────────────────────

/**
 * Look up a product by barcode (UPC, EAN, GTIN) using Open Food Facts API.
 * Returns normalized product data.
 */
export async function lookupByBarcode(barcode: string): Promise<BarcodeScanResult> {
  // Clean the barcode: remove spaces and dashes
  const cleanedBarcode = barcode.replace(/[\s-]/g, "");

  try {
    const url = `${OFF_API_BASE}/product/${cleanedBarcode}.json`;
    const response = await fetch(url);
    
    if (!response.ok) {
      return {
        success: false,
        error: `Open Food Facts returned status ${response.status}`,
      };
    }

    const data = (await response.json()) as Record<string, unknown>;

    if (data.status === 0) {
      return {
        success: false,
        error: "Product not found in Open Food Facts database",
      };
    }

    const productData = data.product as Record<string, unknown> | undefined;
    if (!productData) {
      return {
        success: false,
        error: "No product data returned from Open Food Facts",
      };
    }

    // Extract ingredient list
    const ingredients: string[] = [];
    const rawIngredients = productData.ingredients as Array<{ text?: string; id?: string }> | undefined;
    if (rawIngredients) {
      for (const ing of rawIngredients) {
        if (ing.text) ingredients.push(ing.text);
      }
    }

    return {
      success: true,
      product: {
        barcode: cleanedBarcode,
        name: (productData.product_name as string) || "Unknown Product",
        brand: (productData.brands as string) || "Unknown Brand",
        category: (productData.categories as string) || "Supplements",
        imageUrl: (productData.image_url as string) || undefined,
        description: (productData.generic_name as string) || undefined,
        servingSize: (productData.serving_size as string) || undefined,
        ingredients: ingredients.length > 0 ? ingredients : undefined,
      },
      rawData: data as Record<string, unknown>,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      error: `Failed to lookup barcode: ${message}`,
    };
  }
}

// ── Photo scan placeholder ─────────────────────────────────────────────────

/**
 * Scan a product from a photo/image.
 * Currently a placeholder — in production this would use a vision API
 * to extract a barcode from an image, then delegate to lookupByBarcode.
 */
export async function scanFromPhoto(
  imageUrlOrBase64: string,
): Promise<PhotoScanResult> {
  // TODO: Integrate with a barcode detection/QR scanning API
  // For now, return a placeholder indicating this is not yet implemented
  return {
    success: false,
    error: "Photo-based barcode scanning is not yet implemented. Use the barcode lookup API instead.",
  };
}

// ── Create product record from scan result ─────────────────────────────────

/**
 * Generate SQL insert statements for creating brand/product records from a scan.
 * This helps the web engineer ingest scanned products into the database.
 */
export function generateProductInserts(
  scanResult: BarcodeScanResult,
  brandId?: string,
  categoryId?: string,
): { brandSql?: string; categorySql?: string; productSql?: string } {
  if (!scanResult.success || !scanResult.product) {
    return {};
  }

  const product = scanResult.product;
  const productId = crypto.randomUUID();
  const result: { brandSql?: string; categorySql?: string; productSql?: string } = {};

  // If no brandId provided, generate a brand insert
  if (!brandId) {
    const newBrandId = crypto.randomUUID();
    const brandName = product.brand.replace(/'/g, "''");
    result.brandSql = `INSERT OR IGNORE INTO brands (id, name, created_at, updated_at) VALUES ('${newBrandId}', '${brandName}', datetime('now'), datetime('now'))`;
    brandId = newBrandId;
  }

  // If no categoryId provided, generate a category insert
  if (!categoryId) {
    const newCategoryId = crypto.randomUUID();
    const catName = product.category.replace(/'/g, "''");
    const catSlug = product.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    result.categorySql = `INSERT OR IGNORE INTO categories (id, name, slug, created_at) VALUES ('${newCategoryId}', '${catName}', '${catSlug}', datetime('now'))`;
    categoryId = newCategoryId;
  }

  const productName = product.name.replace(/'/g, "''");
  const productDesc = product.description ? product.description.replace(/'/g, "''") : "";
  const imageUrl = product.imageUrl ? product.imageUrl.replace(/'/g, "''") : "";
  const servingSize = product.servingSize ? product.servingSize.replace(/'/g, "''") : "";

  result.productSql = `INSERT OR IGNORE INTO products (id, name, brand_id, category_id, barcode, image_url, description, serving_size, created_at, updated_at) VALUES ('${productId}', '${productName}', '${brandId}', '${categoryId}', '${product.barcode}', '${imageUrl}', '${productDesc}', '${servingSize}', datetime('now'), datetime('now'))`;

  return result;
}