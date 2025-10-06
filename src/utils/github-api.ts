import { Repo } from '../types/repo';
import { PROFILE } from '../constants/profile';

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
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues?labels=portfolio-comment&state=open&sort=created&direction=desc`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'kxrim-dev-portfolio'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}: ${response.statusText}`);
    }

    const issues = await response.json();
    
    // Process each issue and automatically fetch user data
    const comments = await Promise.all(
      issues.map(async (issue: any) => {
        try {
          // Fetch detailed user information
          const userResponse = await fetch(issue.user.url, {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
              'User-Agent': 'kxrim-dev-portfolio'
            }
          });

          let userData = issue.user; // Fallback to basic user data
          if (userResponse.ok) {
            userData = await userResponse.json();
          }

          return {
            id: issue.id.toString(),
            author: {
              name: userData.name || userData.login,
              username: userData.login,
              avatar: userData.avatar_url,
              profileUrl: userData.html_url,
              bio: userData.bio || null,
              location: userData.location || null,
              company: userData.company || null
            },
            content: issue.body || 'No content provided',
            timestamp: new Date(issue.created_at),
            issueUrl: issue.html_url,
            issueNumber: issue.number
          };
        } catch (error) {
          console.warn('Error processing issue:', issue.number, error);
          // Return basic data if detailed fetch fails
          return {
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
          };
        }
      })
    );

    return comments;
  } catch (error) {
    console.error('Error fetching portfolio comments:', error);
    throw error;
  }
}
