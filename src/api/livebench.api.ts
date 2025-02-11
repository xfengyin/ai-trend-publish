import axios from "axios";

interface CategoryMapping {
  [key: string]: string[];
}

interface ModelScore {
  [key: string]: number;
}

interface ModelScores {
  [modelName: string]: ModelScore;
}

interface CategoryAverages {
  [category: string]: number;
}

export class LiveBenchAPI {
  private static readonly BASE_URL = "https://livebench.ai";
  private categoryMapping: CategoryMapping = {};

  constructor() {}

  private async fetchCategories(): Promise<void> {
    try {
      const response = await axios.get(
        `${LiveBenchAPI.BASE_URL}/categories_2024_11_25.json`
      );
      this.categoryMapping = response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error("Failed to fetch LiveBench categories");
    }
  }

  private async fetchScores(): Promise<ModelScores> {
    try {
      const response = await axios.get(
        `${LiveBenchAPI.BASE_URL}/table_2024_11_25.csv`
      );
      const rows = response.data.trim().split("\n");
      const headers = rows[0].split(",");
      const modelScores: ModelScores = {};

      for (let i = 1; i < rows.length; i++) {
        const values = rows[i].split(",");
        const modelName = values[0];
        const scores: ModelScore = {};

        for (let j = 1; j < headers.length; j++) {
          const metric = headers[j];
          const score = parseFloat(values[j]);
          if (!isNaN(score)) {
            scores[metric] = score;
          }
        }

        modelScores[modelName] = scores;
      }

      return modelScores;
    } catch (error) {
      console.error("Error fetching scores:", error);
      throw new Error("Failed to fetch LiveBench scores");
    }
  }

  private calculateCategoryAverages(
    modelScores: ModelScore,
    categories: CategoryMapping
  ): CategoryAverages {
    const averages: CategoryAverages = {};

    // Calculate category averages
    for (const [category, metrics] of Object.entries(categories)) {
      const validScores = metrics
        .map((metric) => modelScores[metric])
        .filter((score) => !isNaN(score));

      if (validScores.length > 0) {
        const sum = validScores.reduce((acc, score) => acc + score, 0);
        averages[`${category} Average`] = Number(
          (sum / validScores.length).toFixed(2)
        );
      } else {
        averages[`${category} Average`] = 0;
      }
    }

    const allScores = Object.values(modelScores).filter(
      (score) => !isNaN(score)
    );
    if (allScores.length > 0) {
      const globalSum = allScores.reduce((acc, score) => acc + score, 0);
      averages["Global Average"] = Number(
        (globalSum / allScores.length).toFixed(2)
      );
    } else {
      averages["Global Average"] = 0;
    }

    return averages;
  }

  public async getModelPerformance(
    modelName?: string
  ): Promise<{ [key: string]: CategoryAverages }> {
    try {
      await this.fetchCategories();
      const modelScores = await this.fetchScores();
      const result: { [key: string]: CategoryAverages } = {};

      if (modelName) {
        if (modelScores[modelName]) {
          result[modelName] = this.calculateCategoryAverages(
            modelScores[modelName],
            this.categoryMapping
          );
        } else {
          throw new Error(`Model ${modelName} not found`);
        }
      } else {
        for (const [model, scores] of Object.entries(modelScores)) {
          result[model] = this.calculateCategoryAverages(
            scores,
            this.categoryMapping
          );
        }
      }

      return result;
    } catch (error) {
      console.error("Error in getModelPerformance:", error);
      throw error;
    }
  }

  public async getTopPerformers(
    limit: number = 5,
    sortBy: string = "Global Average"
  ): Promise<{ [key: string]: CategoryAverages }> {
    const allPerformance = await this.getModelPerformance();

    const modelRankings = Object.entries(allPerformance)
      .map(([model, scores]) => {
        const avgScore = scores[sortBy] || 0;
        return { model, scores, avgScore };
      })
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, limit);

    const result: { [key: string]: CategoryAverages } = {};
    modelRankings.forEach(({ model, scores }) => {
      result[model] = scores;
    });

    return result;
  }
}

const liveBenchAPI = new LiveBenchAPI();

// 测试不同排序方式
Promise.all([
  liveBenchAPI.getTopPerformers(3, "Global Average"),
  liveBenchAPI.getTopPerformers(3, "Reasoning Average"),
  liveBenchAPI.getTopPerformers(3, "Coding Average"),
])
  .then(([globalTop, reasoningTop, codingTop]) => {
    console.log("Top by Global Average:", globalTop);
    console.log("Top by Reasoning:", reasoningTop);
    console.log("Top by Coding:", codingTop);
  })
  .catch((error) => {
    console.error(error);
  });
