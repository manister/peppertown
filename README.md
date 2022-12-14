# Pepper town

A directory of chilli pepper cultivars. It aims to be a encyclopedia of many different varities of chilli peppers, where the user can browse by species, geographical origin and heat (Scoville Rating). It is a work in progress.

[pepper.town](https://pepper.town)

## Architecture Overview

Pepper town is built with [Next.js](https://github.com/vercel/next.js/) and hosted on [Netlify](https://www.netlify.com/). The data is stored in a postgres database, and Prisma is used as an ORM. Images are hosted on [Cloudinary](https://cloudinary.com/).

## Next.js

The site is hosted on Netlify and uses Netlify's built in support of [Incremental Static Regeneration](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration) (ISR).

### Incremental Static Regeneration (ISR)

Different cultivars of chilli pepper can be browsed by origin (at `origin/[origin_handle]/`), by species (at `species/[species_handle]/`) as **listing pages**, or the individual cultivar viewed (at `cultivars/[cultivar_handle]/`) as a **profile page**. These routes are generated at build time. See `getStaticPaths` at [[...paths.tsx]](https://github.com/manister/peppertown/blob/main/pages/%5B...paths%5D.tsx). Once generated, these paths are not revalidated, so only rebuilt when another build is kicked off - eg if edits are made to the data in the database.

#### Filtering Routes

Cultivars of chillies can be filtered by both origin and by species. The structure for such filtering is set by the request path in the format `/origin/[origin_handle_1]+[origin_handle_2]...+[origin_handle_n]/species/[species_handle_1]+[species_handle_2]...[species_handle_n]/`. For example `/origin/mexico+trinidad/species/annuum/` would show cultivars of species Annuum, where the origin is either Trinidad or Mexico. More filtering and sorting is handled, but currently lacks a front end implemenation. See [filters.ts](https://github.com/manister/peppertown/blob/main/lib/filters.ts).

These filtered routes are generated at request time using **ISR**, and then never revalidated. This limits reads to the database and keeps response times fast.

### Markdown content

Custom content can be added to a route by creating a markdown file at the corresponding path inside the `content` folder. Eg. the markdown content for the route `origin/mexico` can be set at `content/origin/mexico.md`. This is currently used to set header content on listing pages only.

### API Routes

There is currently 1 api route. This is used to calculate the number of records a particular filter would return. See [count.ts](https://github.com/manister/peppertown/blob/main/pages/api/count.ts) and [ChilliFilters.tsx](https://github.com/manister/peppertown/blob/main/components/chillies/ChilliFilters.tsx)


## CSS

Tailwind is used to style the components, meaning no stylesheet has to be mentained and instead forcing styling into the components themselves meaning that they are kept reusable and consistent without the extra overhead of maintaning stylesheets.


## Going forward

See [Issues](https://github.com/manister/peppertown/labels/tasks).


?? copyright pepper.town, unless otherwise noted, 2022
