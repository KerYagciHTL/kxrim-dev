import { Repo } from '../types/repo';
import { PROFILE } from '../constants/profile';

// Rate limiting and cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
const REQUEST_DELAY = 100; // Delay between requests in milliseconds

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const apiCache = new Map<string, CacheEntry<any>>();

// Helper function for cached API requests
async function cachedFetch<T>(url: string, cacheKey: string): Promise<T> {
  // Check cache first
  const cached = apiCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  // Add small delay to avoid rapid-fire requests
  await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY));

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'kxrim-dev-portfolio',
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API returned ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  
  // Cache the result
  apiCache.set(cacheKey, { data, timestamp: Date.now() });
  
  return data;
}

async function getFallbackRepos(): Promise<Repo[]> {
  try {
    const response = await fetch('/repos-fallback.json');
    if (!response.ok) {
      throw new Error('Failed to fetch fallback data');
    }
    return await response.json();
  } catch (error) {
    console.warn('Failed to load fallback data, using empty array');
    return [];
  }
}

export async function fetchRepositories(username: string = PROFILE.github): Promise<Repo[]> {
  try {
    const cacheKey = `repos-${username}`;
    const repos: Repo[] = await cachedFetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      cacheKey
    );
    return repos;

  } catch (error) {
    console.warn('Failed to fetch repositories from API, using fallback:', error);
    return await getFallbackRepos();
  }
}

export async function fetchOrganizedRepositories(
  username: string = PROFILE.github,
  featuredRepos: string[] = PROFILE.featured
): Promise<Repo[]> {
  try {
    const allRepos = await fetchRepositories(username);

    const repoMap = new Map(allRepos.map(repo => [repo.name, repo]));

    const featured = featuredRepos
      .map(name => repoMap.get(name))
      .filter((repo): repo is Repo => repo !== undefined);

    const remaining = allRepos
      .filter(repo => !featuredRepos.includes(repo.name) && !repo.archived)
      .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime());

    return [...featured, ...remaining];

  } catch (error) {
    throw error;
  }
}

export async function fetchRepoNamesAndDescriptions(username: string = PROFILE.github) {
  try {
    const repos = await fetchRepositories(username);
    return repos.map(repo => ({
      name: repo.name,
      description: repo.description || 'No description available'
    }));
  } catch (error) {
    throw error;
  }
}

export async function fetchPortfolioComments(owner: string, repo: string): Promise<any[]> {
  try {
    const cacheKey = `comments-${owner}-${repo}`;
    const issues: any[] = await cachedFetch(
      `https://api.github.com/repos/${owner}/${repo}/issues?labels=portfolio-comment&state=open&sort=created&direction=desc`,
      cacheKey
    );
    
    const comments = [];
    
    for (const issue of issues) {
      try {
        comments.push({
          id: issue.id.toString(),
          author: {
            name: issue.user.login,
            username: issue.user.login,
            avatar: issue.user.avatar_url,
            profileUrl: issue.user.html_url,
            bio: null,
            location: null,
            company: null
          },
          content: issue.body || 'No content provided',
          timestamp: new Date(issue.created_at),
          issueUrl: issue.html_url,
          issueNumber: issue.number
        });
      } catch (error) {
        console.warn('Error processing issue:', issue.number, error);
        comments.push({
          id: issue.id.toString(),
          author: {
            name: issue.user.login,
            username: issue.user.login,
            avatar: issue.user.avatar_url,
            profileUrl: issue.user.html_url,
            bio: null,
            location: null,
            company: null
          },
          content: issue.body || 'No content provided',
          timestamp: new Date(issue.created_at),
          issueUrl: issue.html_url,
          issueNumber: issue.number
        });
      }
    }

    return comments;
  } catch (error) {
    console.error('Error fetching portfolio comments:', error);
    
    if (error instanceof Error && error.message.includes('403')) {
      const enhancedError = new Error(
        'GitHub API rate limit exceeded. The site is experiencing high traffic. Please try again in a few minutes.'
      );
      enhancedError.name = 'RateLimitError';
      throw enhancedError;
    }
    
    throw error;
  }
}
