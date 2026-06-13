import { getStore } from '@netlify/blobs'

export default async (req, context) => {
  const headers = { 'content-type': 'application/json' }
  const key = req.headers.get('x-admin-key') || new URL(req.url).searchParams.get('key')
  const SECRET_KEY = Netlify.env.get('SECRET_KEY') || 'admin123'

  if (!key || key !== SECRET_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized: invalid or missing key' }), {
      status: 401,
      headers,
    })
  }

  const store = getStore('portfolio-data')

  // GET — baca data dari blob
  if (req.method === 'GET') {
    let data = await store.get('data.json', { type: 'json' })

    // Jika blob kosong, seed dari public/data.json (bundled)
    if (!data) {
      try {
        const fs = await import('fs/promises')
        const raw = await fs.readFile('public/data.json', 'utf-8')
        data = JSON.parse(raw)
        await store.setJSON('data.json', data)
      } catch {
        return new Response(JSON.stringify({ error: 'No data found and seed failed' }), {
          status: 404,
          headers,
        })
      }
    }

    return new Response(JSON.stringify(data), { headers })
  }

  // POST — simpan data + backup versi lama
  if (req.method === 'POST') {
    const newData = await req.json()
    const current = await store.get('data.json', { type: 'json' })

    // Cari nomor versi backup terakhir
    const listResp = await store.list()
    const versions = listResp.blobs
      .filter((b) => /^datav\d+\.json$/.test(b.key))
      .map((b) => parseInt(b.key.match(/datav(\d+)\.json/)[1], 10))
    const nextVer = versions.length ? Math.max(...versions) + 1 : 1

    // Backup data lama ke blob versioned
    if (current) {
      await store.setJSON(`datav${nextVer}.json`, current)
    }

    // Simpan data baru
    await store.setJSON('data.json', newData)

    return new Response(JSON.stringify({ success: true, version: nextVer }), { headers })
  }

  return new Response('Method not allowed', { status: 405, headers })
}
