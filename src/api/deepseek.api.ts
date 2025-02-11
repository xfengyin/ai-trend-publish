import axios from "axios";
import { ConfigManager } from "../utils/config/config-manager";

interface BalanceInfo {
  currency: string;
  total_balance: string;
  granted_balance: string;
  topped_up_balance: string;
}

interface DeepseekBalanceResponse {
  is_available: boolean;
  balance_infos: BalanceInfo[];
}

export class DeepseekAPI {
  private baseURL = "https://api.deepseek.com";
  private token!: string;

  constructor() {
    this.refresh();
  }

  async refresh() {
    this.token = await ConfigManager.getInstance().get("DEEPSEEK_API_KEY");
  }

  /**
   * Get the current balance information from Deepseek account
   * @returns Promise<DeepseekBalanceResponse> The balance information including availability and balance details
   * @throws Error if the API request fails
   */
  async getBalance(): Promise<DeepseekBalanceResponse> {
    try {
      const response = await axios.get<DeepseekBalanceResponse>(
        `${this.baseURL}/user/balance`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${this.token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Failed to get Deepseek balance: ${
            error.response?.data?.message || error.message
          }`
        );
      }
      throw error;
    }
  }

  /**
   * Get the total balance in CNY (convenience method)
   * @returns Promise<number> The total balance in CNY
   * @throws Error if the API request fails or CNY balance is not found
   */
  async getCNYBalance(): Promise<number> {
    const response = await this.getBalance();
    const cnyBalance = response.balance_infos.find(
      (info) => info.currency === "CNY"
    );
    if (!cnyBalance) {
      throw new Error("CNY balance not found in response");
    }
    return parseFloat(cnyBalance.total_balance);
  }
}
