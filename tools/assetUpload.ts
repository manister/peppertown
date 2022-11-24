//@TODO type defs

import 'dotenv/config'

const fetch = require('node-fetch')

import cloudinary from 'cloudinary'

const headers = {
  Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
}

const ENDPOINT = `${process.env.AIRTABLE_ENDPOINT}/Image%20library`

const getRawAssets = async (): Promise<{ handle: string; url: string; id: string }[]> => {
  try {
    const res = await fetch(ENDPOINT, { headers })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (await res.json()) as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.records.map((data: any) => {
      return {
        handle: data.fields.handle,
        url: data.fields.src?.[0].url,
        id: data.fields.src?.[0].id,
      }
    })
  } catch (e) {
    console.error(e)
    return []
  }
}

getRawAssets().then((assets) => {
  assets.forEach(async (asset) => {
    try {
      const public_id = `${asset.handle}`
      const res = await cloudinary.v2.uploader.upload(asset.url, { public_id, unique_filename: true, overwrite: false })
      if (res.existing) {
        console.info(`${public_id} already exists, skipping`)
      } else {
        console.info(`${public_id} uploaded!`)
      }
    } catch (e) {
      console.error(e)
    }
  })
})
