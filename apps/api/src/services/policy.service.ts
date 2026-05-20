import { policyRepo } from '../repositories/policy.repo';

interface PolicyContext {
  id: string;
  title: string;
  content: string;
  category: string;
  relevance: number;
}

export const policyService = {
  async createPolicy(data: {
    title: string;
    content: string;
    category: string;
    keywords?: string[];
  }): Promise<PolicyContext & { version: number; isActive: boolean; createdAt: Date }> {
    const policy = await policyRepo.create(data);

    return {
      id: policy.id,
      title: policy.title,
      content: policy.content,
      category: policy.category,
      relevance: 1.0,
      version: policy.version,
      isActive: policy.isActive,
      createdAt: policy.createdAt,
    };
  },

  async retrieveRelevantPolicies(
    query: string,
    intent: string,
    limit = 5
  ): Promise<PolicyContext[]> {
    const queryTerms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
    const keywordMatches = await policyRepo.searchByKeywords(queryTerms);

    const scored = keywordMatches.map((policy) => {
      let relevance = 0.5;
      const keywordOverlap = policy.keywords.filter((kw) =>
        queryTerms.some((term) => kw.toLowerCase().includes(term))
      ).length;
      relevance += keywordOverlap * 0.2;
      if (policy.title.toLowerCase().includes(query.toLowerCase())) {
        relevance += 0.2;
      }
      if (policy.content.toLowerCase().includes(query.toLowerCase())) {
        relevance += 0.1;
      }
      return { ...policy, relevance };
    });

    scored.sort((a, b) => b.relevance - a.relevance);
    return scored.slice(0, limit).map((p) => ({
      id: p.id,
      title: p.title,
      content: p.content,
      category: p.category,
      relevance: Math.min(1, p.relevance),
    }));
  },

  async syncEmbeddings(): Promise<{ synced: number; failed: number }> {
    return { synced: 0, failed: 0 };
  },

  async updatePolicy(
    id: string,
    data: Partial<{ title: string; content: string; category: string; keywords: string[] }>
  ): Promise<PolicyContext | null> {
    const policy = await policyRepo.update(id, data);

    if (!policy) return null;

    return {
      id: policy.id,
      title: policy.title,
      content: policy.content,
      category: policy.category,
      relevance: 1.0,
    };
  },
};