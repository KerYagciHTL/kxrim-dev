import { Repo } from '../types/repo';
import { PROFILE } from '../constants/profile';

/**
 * Fetches fallback repository data from public JSON file
 */
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

/**
 * Fetches repository data from GitHub API with automatic fallback to local JSON
 * @param username GitHub username
 * @param timeout Request timeout in milliseconds (default: 5000)
 * @returns Promise<Repo[]> Array of repositories
 */
export async function fetchRepositories(username: string = PROFILE.github, timeout: number = 5000): Promise<Repo[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      {
        signal: controller.signal,
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'kxrim-dev-portfolio'
        }
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}: ${response.statusText}`);
    }

    const repos: Repo[] = await response.json();
    return repos;

  } catch (error) {
    clearTimeout(timeoutId);
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

/**
 * Simple function to get just repo names and descriptions
 * @param username GitHub username
 * @returns Promise<Array<{name: string, description: string}>>
 */
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
