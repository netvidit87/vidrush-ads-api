/**
 * GET /api/ad_type
 * Mirip ads-api.videy.co – mengembalikan kode iklan untuk VideoPlayer.
 *
 * Query params (opsional):
 *   - uploader  (string)
 *   - width     (number)
 *   - ad_group  (number 1-100)
 *
 * Response format:
 * {
 *   "type": "exo",
 *   "code": "",
 *   "banner_300x250": "<script>...</script>..."
 * }
 *
 * Hanya menggunakan 3 iklan yang disediakan user.
 */

const ADS = [
  // 1. Banner 300x250 (atOptions + biomanos)
  {
    type: 'exo',
    banner_300x250: `<script>
  atOptions = {
    'key' : 'e3390cf0a8cdf953ded85bdaaf3046a5',
    'format' : 'iframe',
    'height' : 250,
    'width' : 300,
    'params' : {}
  };
</script>
<script src="https://biomanos.org/22/e3390cf0a8cdf953ded85bdaaf3046a5"></script>`,
  },

  // 2. Banner / container (biomanos 21)
  {
    type: 'exo',
    banner_300x250: `<script async="async" data-cfasync="false" src="https://biomanos.org/21/d3e082d534e1581e0f78d3cfe456f0d9"></script>
<div id="container-d3e082d534e1581e0f78d3cfe456f0d9"></div>`,
  },

  // 3. Popunder / script (ahuramazda) – dikembalikan juga sebagai banner supaya bisa di-inject
  {
    type: 'exo',
    banner_300x250: `<script data-cfasync="false" src="https://ahuramazda.org/1/d4b3da13003ae6d27d4378a79cb4332d"></script>`,
  },
]

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'public, max-age=30',
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

export async function onRequestGet({ request }) {
  try {
    const url = new URL(request.url)
    const adGroupParam = url.searchParams.get('ad_group')
    let index = 0

    if (adGroupParam) {
      const n = parseInt(adGroupParam, 10)
      if (!Number.isNaN(n) && n > 0) {
        // ad_group 1-100 → pilih salah satu dari 3 iklan secara stabil
        index = (n - 1) % ADS.length
      }
    } else {
      // random kalau tidak ada ad_group
      index = Math.floor(Math.random() * ADS.length)
    }

    const ad = ADS[index]

    const body = {
      type: ad.type || 'exo',
      code: '',
      banner_300x250: ad.banner_300x250,
    }

    return new Response(JSON.stringify(body), {
      status: 200,
      headers: corsHeaders(),
    })
  } catch (err) {
    return new Response(
      JSON.stringify({ type: 'exo', code: '', banner_300x250: '', error: 'internal' }),
      { status: 500, headers: corsHeaders() }
    )
  }
}
