// schema.org graph for both pages. One Person (@id /#person) that everything points to.
// It repeats only facts that are on the page; when content changes, this changes with it.
import { profile } from '~~/content/profile'
import { work } from '~~/content/work'
import type { Locale } from '~~/content/types'

export const SITE = 'https://yagci.cc'
const PERSON = `${SITE}/#person`
const WEBSITE = `${SITE}/#website`

function person(locale: Locale) {
  return {
    '@type': 'Person',
    '@id': PERSON,
    name: profile.name,
    givenName: profile.givenName,
    familyName: profile.familyName,
    alternateName: [profile.alternateName, 'Kerim'],
    url: `${SITE}/`,
    image: { '@type': 'ImageObject', url: `${SITE}/icon.png`, width: 460, height: 460 },
    email: `mailto:${profile.email}`,
    description:
      locale === 'de'
        ? 'Softwareentwickler aus Ansfelden, Schüler an der HTL Leonding (Informatik).'
        : 'Software developer from Ansfelden, Austria, student at HTL Leonding (computer science).',
    homeLocation: {
      '@type': 'Place',
      address: { '@type': 'PostalAddress', addressLocality: profile.locality, addressCountry: profile.country },
    },
    affiliation: { '@type': 'EducationalOrganization', name: profile.school.name, url: profile.school.url },
    knowsAbout: [...profile.languages, ...profile.tools],
    sameAs: [profile.github, profile.linkedin],
  }
}

function website() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE,
    url: `${SITE}/`,
    name: profile.name,
    inLanguage: ['de', 'en'],
    publisher: { '@id': PERSON },
  }
}

export function homeGraph(locale: Locale, url: string, title: string) {
  const projects = work
    .filter((w) => w.type === 'project')
    .map((w) => ({
      '@type': 'SoftwareSourceCode',
      '@id': `${SITE}/#${w.id}`,
      name: w.name,
      description: w.summary[locale],
      codeRepository: w.repo,
      programmingLanguage: w.language,
      author: { '@id': PERSON },
    }))
  const sites = work
    .filter((w) => w.type === 'client')
    .map((w) => ({ '@type': 'WebSite', name: w.company ?? w.name, url: w.url, creator: { '@id': PERSON } }))
  return {
    '@context': 'https://schema.org',
    '@graph': [
      person(locale),
      website(),
      {
        '@type': 'ProfilePage',
        '@id': `${url}#page`,
        url,
        name: title,
        inLanguage: locale,
        isPartOf: { '@id': WEBSITE },
        mainEntity: { '@id': PERSON },
        hasPart: [...projects.map((p) => ({ '@id': p['@id'] }))],
      },
      ...projects,
      ...sites,
    ],
  }
}

export function buildGraph(locale: Locale, url: string, title: string, homeUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      person(locale),
      website(),
      {
        '@type': 'WebPage',
        '@id': `${url}#page`,
        url,
        name: title,
        inLanguage: locale,
        isPartOf: { '@id': WEBSITE },
        about: { '@id': PERSON },
        author: { '@id': PERSON },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: profile.name, item: homeUrl },
            { '@type': 'ListItem', position: 2, name: title.split(' · ')[0], item: url },
          ],
        },
      },
    ],
  }
}
