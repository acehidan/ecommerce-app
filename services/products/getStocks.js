import api from '../api';

export interface StockItem {
  _id: string;
  name: string;
  productCode: string;
  retailQuantity: number;
  retailUnitPrice: number;
  wholeSale: Array<{
    wholeSaleQuantity: number,
    wholeSaleUnitPrice: number,
    _id: string,
  }>;
  stockQuantity: number;
  unitWeight: number;
  weightUnit: string;
  onSale: boolean;
  saleType: string;
  limitedSaleQuantity: number;
  category: string;
  description: string;
  percentageChangeHistory: number;
  images: Array<{
    _id: string,
    url: string,
    spaceKey: string,
  }>;
  isDeleted: boolean;
  updatedAt: string;
  deletedAt: string | null;
  percentageChangeAt: string | null;
  createdAt: string;
  __v: number;
}

export interface StocksResponse {
  success: boolean;
  message: string;
  data: StockItem[];
}

export interface SearchParams {
  name?: string;
  category?: string;
}

const handleGetStocks = async (
  searchParams: SearchParams = {}
): Promise<StocksResponse> => {
  try {
    const params = new URLSearchParams();

    // saleType is always "regular" as constant
    params.append('saleType', 'regular');

    // Add category if provided
    if (searchParams.category) {
      params.append('category', searchParams.category);
    }

    // Add name if provided
    if (searchParams.name) {
      params.append('name', searchParams.name);
    }

    const response = await api.get(
      `/api/v1/stocks/filter/advanced?${params.toString()}`
    );

    // Handle the new response structure: response.data.data.stocks
    const stocks =
      response.data?.data?.stocks || response.data?.stocks || response.data || [];

    return {
      success: true,
      message: response.data?.message || 'Stocks retrieved successfully.',
      data: stocks,
    };
  } catch (error) {
    console.error('Error fetching stocks:', error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        'Failed to get stocks',
      data: [],
    };
  }
};

export default handleGetStocks;
