import { NextRequest, NextResponse } from "next/server";
import { fetchSSProducts, fetchSSStyles, searchSSProducts } from "@/app/lib/ssactivewear";

// GET /api/ss-products?brand=Richardson
// or /api/ss-products?styleID=4379
// or /api/ss-products?search=trucker hat
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const brand = searchParams.get("brand");
  const styleID = searchParams.get("styleID");
  const search = searchParams.get("search");
  const type = searchParams.get("type") || "products"; // "products" or "styles"

  try {
    if (search) {
      const products = await searchSSProducts(search);
      return NextResponse.json({ products });
    }

    if (type === "styles") {
      const styles = await fetchSSStyles({
        styleID: styleID ? parseInt(styleID) : undefined,
        brandName: brand || undefined,
      });
      return NextResponse.json({ styles });
    } else {
      const products = await fetchSSProducts({
        styleID: styleID ? parseInt(styleID) : undefined,
        brandName: brand || undefined,
      });
      return NextResponse.json({ products });
    }
  } catch (error) {
    console.error("SS Products API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products from SS Activewear" },
      { status: 500 }
    );
  }
}

