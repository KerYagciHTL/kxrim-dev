import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROFILE_GITHUB = 'KerYagciHTL';
const FALLBACK_PATH = path.join(__dirname, 'public', 'repos-fallback.json');

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'kxrim-dev-portfolio'
    };
    
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
    }
    
    const options = { headers };

    const req = https.get(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`GitHub API returned ${res.statusCode}: ${res.statusMessage}`));
          return;
        }

        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (error) {
          reject(new Error(`Failed to parse JSON: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function fetchRepositories() {
  try {
    console.log('Fetching repositories from GitHub API...');

    const repos = await httpsGet(`https://api.github.com/users/${PROFILE_GITHUB}/repos?per_page=100&sort=updated`);

    const cleanedRepos = repos.map(repo => ({
      name: repo.name,
      description: repo.description,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      language: repo.language,
      html_url: repo.html_url,
      topics: repo.topics || [],
      archived: repo.archived,
      pushed_at: repo.pushed_at
    }));

    console.log(`Successfully fetched ${cleanedRepos.length} repositories`);
    return cleanedRepos;

  } catch (error) {
    console.log('GitHub API request failed:', error.message);
    console.log('Using existing fallback data...');

    if (fs.existsSync(FALLBACK_PATH)) {
      const fallbackData = fs.readFileSync(FALLBACK_PATH, 'utf8');
      return JSON.parse(fallbackData);
    } else {
      console.log('No fallback data found, creating empty array');
      return [];
    }
  }
}

async function main() {
  try {
    const repos = await fetchRepositories();

    const dir = path.dirname(FALLBACK_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(FALLBACK_PATH, JSON.stringify(repos, null, 2));
    console.log(`Saved ${repos.length} repositories to ${FALLBACK_PATH}`);

  } catch (error) {
    console.error('Script failed:', error.message);
    process.exit(1);
  }
}

main();
